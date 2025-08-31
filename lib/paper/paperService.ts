/**
 * 논문 관련 서비스
 * @author Minseok kim
 */

import { Paper, PaperDetail, PaperContentBlock } from '@/lib/types/paper';
import { getPaperRepository, getUserLibraryRepository } from '@/lib/database/repositories';
import { Paper as PaperEntity } from '@/lib/database/entities/Paper';
import { PaperContent as PaperContentEntity } from '@/lib/database/entities/PaperContent';
import { ensureDatabaseConnection } from '@/lib/database/connection';
import { publishJson } from '@/lib/redis/client';
import { getSession } from '@/lib/auth/session';
import { UserLibrary as UserLibraryEntity } from '@/lib/database/entities/UserLibrary';
import { UserLibrary as UserLibraryType } from '@/lib/types/paper';
/**
 * PaperEntity를 Paper 타입으로 변환하는 함수
 *
 * @param {PaperEntity} entity - 변환할 Paper 엔티티
 * @returns {Paper} 변환된 Paper 타입
 * @private
 */
async function entityToDto(entity: PaperEntity): Promise<Paper> {
  // categories 관계에서 카테고리 이름들을 가져옴
  const categoryEntities = await entity.categories;
  const categories = categoryEntities.map((cat) => cat.name);

  // authors를 배열로 파싱 (콤마 구분 또는 JSON 형태로 저장되어 있다고 가정)
  let authors: string[] = [];
  try {
    authors = entity.authors ? JSON.parse(entity.authors) : [];
  } catch {
    // JSON 파싱 실패 시 콤마로 분리
    authors = entity.authors ? entity.authors.split(',').map((a) => a.trim()) : [];
  }

  return {
    id: entity.id,
    title: entity.title,
    summary: entity.summary || entity.abstract || '',
    authors,
    link: entity.url || '',
    lastUpdate: entity.updateDate
      ? entity.updateDate.toISOString().split('T')[0]
      : entity.createdAt.toISOString().split('T')[0],
    categories,
  };
}

/**
 * UserLibraryEntity를 UserLibraryType으로 변환하는 함수
 *
 * @param {UserLibraryEntity} entity - 변환할 UserLibrary 엔티티
 * @returns {UserLibraryType} 변환된 UserLibraryType
 * @private
 */
async function userLibraryEntityToDto(entity: UserLibraryEntity): Promise<UserLibraryType> {
  const paper = await entity.paper;

  // authors를 배열로 파싱
  let authors: string[] = [];
  try {
    authors = paper.authors ? JSON.parse(paper.authors) : [];
  } catch {
    authors = paper.authors ? paper.authors.split(',').map((a: string) => a.trim()) : [];
  }

  return {
    paperContentId: entity.paperId, // paperId로 변경
    title: paper.title,
    authors,
    createdAt: entity.createdAt,
  };
}

/**
 * PaperContentEntity를 PaperContentBlock 타입으로 변환하는 함수
 *
 * @param {PaperContentEntity} entity - 변환할 PaperContent 엔티티
 * @returns {PaperContentBlock} 변환된 PaperContentBlock 타입
 * @private
 */
function paperContentEntityToBlock(entity: PaperContentEntity): PaperContentBlock {
  return {
    id: entity.id,
    title: entity.contentTitle, // DB의 contentTitle 필드 사용
    content: entity.content,
    order: entity.order,
  };
}

/**
 * PaperEntity와 PaperContentEntity 배열을 PaperDetail 타입으로 변환하는 함수
 *
 * @param {PaperEntity} paper - Paper 엔티티
 * @param {PaperContentEntity[]} paperContents - PaperContent 엔티티 배열
 * @returns {PaperDetail} 변환된 PaperDetail 타입
 * @private
 */
function paperAndContentsToDetail(
  paper: PaperEntity,
  paperContents: PaperContentEntity[]
): PaperDetail {
  // authors를 배열로 파싱
  let authors: string[] = [];
  try {
    authors = paper.authors ? JSON.parse(paper.authors) : [];
  } catch {
    authors = paper.authors ? paper.authors.split(',').map((a: string) => a.trim()) : [];
  }

  // PaperContent를 PaperContentBlock 배열로 변환 (이미 DB에서 정렬됨)
  const contentBlocks = paperContents.map(paperContentEntityToBlock);

  return {
    paperContentId: paper.id, // paperId를 사용
    title: paper.title,
    authors,
    content: contentBlocks,
    createdAt: paper.createdAt,
    publishedAt: paper.createdAt,
    url: paper.url || '',
  };
}

/**
 * 논문 목록을 가져오는 함수 (SSR용)
 * @param page 현재 페이지 (1부터 시작)
 * @param pageSize 페이지당 항목 수
 * @returns 논문 목록과 페이지네이션 정보
 */
export async function getPapers(
  page: number = 1,
  pageSize: number = 10
): Promise<{
  papers: Paper[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}> {
  try {
    await ensureDatabaseConnection();
    const paperRepository = getPaperRepository();

    // 전체 개수 조회
    const totalCount = await paperRepository.count();

    // 페이지네이션 계산
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(totalCount / pageSize);

    // 논문 목록 조회 (최신순으로 정렬, categories 관계 포함)
    const entities = await paperRepository.find({
      skip,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
      relations: ['categories'],
    });

    // 엔티티를 DTO로 변환 (비동기 처리)
    const papers = await Promise.all(entities.map(entityToDto));

    return {
      papers,
      currentPage: page,
      totalPages,
      totalCount,
    };
  } catch (error) {
    console.error('논문 목록 조회 중 오류 발생:', error);
    throw new Error('논문 목록 조회에 실패했습니다');
  }
}

/**
 * 현재 사용자의 논문 라이브러리를 조회하는 함수
 * @param page 현재 페이지 (1부터 시작)
 * @param pageSize 페이지당 항목 수
 * @returns 사용자의 논문 라이브러리와 페이지네이션 정보
 */
export async function getUserLibrary(
  page: number = 1,
  pageSize: number = 10
): Promise<{
  papers: UserLibraryType[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}> {
  try {
    await ensureDatabaseConnection();

    // 현재 사용자 세션 가져오기
    const session = await getSession();
    if (!session) {
      throw new Error('사용자 세션을 찾을 수 없습니다.');
    }
    const userLibraryRepository = getUserLibraryRepository();
    // 전체 개수 조회
    const totalCount = await userLibraryRepository.count({
      where: { userId: session.userId },
    });

    // 페이지네이션 계산
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(totalCount / pageSize);

    // 사용자의 논문 라이브러리 조회 (최신순으로 정렬)
    const userLibraries = await userLibraryRepository.find({
      where: { userId: session.userId },
      relations: ['paper'],
      skip,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });

    // UserLibraryEntity를 UserLibraryType으로 변환
    const papers = await Promise.all(userLibraries.map(userLibraryEntityToDto));

    return {
      papers,
      currentPage: page,
      totalPages,
      totalCount,
    };
  } catch (error) {
    console.error('사용자 라이브러리 조회 중 오류 발생:', error);
    throw new Error('사용자 라이브러리 조회에 실패했습니다');
  }
}

/**
 * 논문을 심층 분석을 위해 등록하는 함수
 * @param paperId 등록할 논문의 ID
 * @returns 등록 성공 여부
 */
export async function registerPaper(paperId: number): Promise<boolean> {
  try {
    await ensureDatabaseConnection();
    const paperRepository = getPaperRepository();

    // 논문 존재 여부 확인
    const paper = await paperRepository.findOne({ where: { id: paperId } });
    if (!paper) {
      console.error(`논문을 찾을 수 없습니다: ${paperId}`);
      return false;
    }

    // 현재 사용자 세션 가져오기
    const session = await getSession();
    if (!session) {
      console.error('사용자 세션을 찾을 수 없습니다.');
      return false;
    }

    // Redis 채널에 메시지 발행
    try {
      await publishJson('paper:analysis', {
        user_id: session.userId,
        paper_id: paperId,
      });
      console.log(`논문 심층 분석 등록: ${paperId} - ${paper.title} (사용자: ${session.userId})`);
    } catch (redisError) {
      console.error('Redis 메시지 발행 중 오류 발생:', redisError);
      // Redis 오류가 있어도 논문 등록은 성공으로 처리
    }

    return true;
  } catch (error) {
    console.error('논문 등록 중 오류 발생:', error);
    return false;
  }
}

/**
 * 논문 상세 정보를 조회하는 함수
 * @param paperId 논문 ID
 * @returns 논문 상세 정보
 */
export async function getPaperDetail(paperId: number): Promise<PaperDetail | null> {
  try {
    await ensureDatabaseConnection();
    const paperRepository = getPaperRepository();

    // 논문 정보와 관련된 PaperContent들을 함께 조회 (order 순으로 정렬)
    const paper = await paperRepository.findOne({
      where: { id: paperId },
      relations: {
        paperContents: true,
      },
      order: {
        paperContents: {
          order: 'ASC',
        },
      },
    });

    if (!paper) {
      console.error(`논문을 찾을 수 없습니다: ${paperId}`);
      return null;
    }

    // Paper의 paperContents 관계에서 PaperContent 배열 가져오기 (이미 정렬됨)
    const paperContents = await paper.paperContents;

    // Paper와 PaperContent를 PaperDetail로 변환
    return paperAndContentsToDetail(paper, paperContents);
  } catch (error) {
    console.error('논문 상세 정보 조회 중 오류 발생:', error);
    throw new Error('논문 상세 정보 조회에 실패했습니다');
  }
}
