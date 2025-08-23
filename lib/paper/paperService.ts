/**
 * 논문 관련 서비스
 * @author Minseok kim
 */

import { Paper } from '@/lib/types/paper';
import { AppDataSource } from '@/lib/database/ormconfig';
import { Paper as PaperEntity } from '@/lib/database/entities/Paper';
import { Repository } from 'typeorm';
import { ensureDatabaseConnection } from '@/lib/database/connection';

/**
 * Paper Repository를 가져오는 private method
 * 
 * @returns {Repository<PaperEntity>} Paper 엔티티의 Repository
 * @private
 */
function getPaperRepository(): Repository<PaperEntity> {
  return AppDataSource.getRepository(PaperEntity);
}

/**
 * PaperEntity를 Paper 타입으로 변환하는 함수
 * 
 * @param {PaperEntity} entity - 변환할 Paper 엔티티
 * @returns {Paper} 변환된 Paper 타입
 * @private
 */
function entityToDto(entity: PaperEntity): Paper {
  // allCategories를 categories 배열로 파싱
  const categories = entity.allCategories ? entity.allCategories.split(' ').filter(Boolean) : [];

  // authors를 배열로 파싱 (콤마 구분 또는 JSON 형태로 저장되어 있다고 가정)
  let authors: string[] = [];
  try {
    authors = entity.authors ? JSON.parse(entity.authors) : [];
  } catch {
    // JSON 파싱 실패 시 콤마로 분리
    authors = entity.authors ? entity.authors.split(',').map(a => a.trim()) : [];
  }

  return {
    id: entity.id.toString(),
    title: entity.title,
    summary: entity.summary || entity.abstract || '',
    authors,
    link: entity.url || '',
    lastUpdate: entity.updateDate ? entity.updateDate.toISOString().split('T')[0] : entity.createdAt.toISOString().split('T')[0],
    categories,
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

    // 논문 목록 조회 (최신순으로 정렬)
    const entities = await paperRepository.find({
      skip,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
    });

    // 엔티티를 DTO로 변환
    const papers = entities.map(entityToDto);

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
 * 논문을 심층 분석을 위해 등록하는 함수
 * @param paperId 등록할 논문의 ID
 * @returns 등록 성공 여부
 */
export async function registerPaper(paperId: string): Promise<boolean> {
  try {
    await ensureDatabaseConnection();
    const paperRepository = getPaperRepository();

    // 논문 존재 여부 확인
    const paper = await paperRepository.findOne({ where: { id: parseInt(paperId) } });
    if (!paper) {
      console.error(`논문을 찾을 수 없습니다: ${paperId}`);
      return false;
    }

    // 여기서는 논문이 존재한다는 것만 확인하고 성공 반환
    // 실제로는 심층 분석 요청을 위한 별도 테이블이나 상태 업데이트가 필요할 수 있음
    console.log(`논문 심층 분석 등록: ${paperId} - ${paper.title}`);

    return true;
  } catch (error) {
    console.error('논문 등록 중 오류 발생:', error);
    return false;
  }
}
