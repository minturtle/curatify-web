/**
 * 논문 관련 서비스
 * @author Minseok kim
 */

import mongoose from 'mongoose';
import { Paper, PaperDetail, PaperContentBlock, UserLibrary } from '@/lib/types/paper';
import { ensureDatabaseConnection } from '@/lib/database/connection';
import { publishJson } from '@/lib/redis/client';
import { getUserAuthStatus } from '@/lib/auth/userService';
import {
  Paper as PaperModel,
  type IPaper,
  UserLibrary as UserLibraryModel,
  type IUserLibrary,
} from '@/lib/database/entities';
import type { IContentBlock } from '@/lib/database/entities/Paper';

/**
 * IPaper를 Paper 타입으로 변환하는 함수
 *
 * @param {IPaper} entity - 변환할 Paper 문서
 * @returns {Paper} 변환된 Paper 타입
 * @private
 */
async function entityToDto(entity: IPaper): Promise<Paper> {
  const categories: string[] = entity.categories || [];

  return {
    id: (entity._id as mongoose.Types.ObjectId).toString(),
    title: entity.title,
    summary: entity.summary || entity.abstract || '',
    authors: entity.authors || [],
    link: entity.url || '',
    lastUpdate: entity.updateDate
      ? entity.updateDate.toISOString().split('T')[0]
      : entity.createdAt.toISOString().split('T')[0],
    categories,
  };
}

/**
 * IUserLibrary를 UserLibrary 타입으로 변환하는 함수
 *
 * @param {IUserLibrary} entity - 변환할 UserLibrary 문서
 * @returns {UserLibrary} 변환된 UserLibrary 타입
 * @private
 */
async function userLibraryEntityToDto(entity: IUserLibrary): Promise<UserLibrary> {
  const paper = await PaperModel.findById(entity.paperId);
  if (!paper) {
    throw new Error('논문을 찾을 수 없습니다.');
  }

  return {
    paperContentId: (entity.paperId as mongoose.Types.ObjectId).toString(),
    title: paper.title,
    authors: paper.authors || [],
    createdAt: entity.createdAt,
  };
}

/**
 * IContentBlock을 PaperContentBlock 타입으로 변환하는 함수
 *
 * @param {IContentBlock} contentBlock - 변환할 ContentBlock
 * @param {number} index - 인덱스 (ID 대신 사용)
 * @returns {PaperContentBlock} 변환된 PaperContentBlock 타입
 * @private
 */
function contentBlockToBlock(contentBlock: IContentBlock, index: number): PaperContentBlock {
  return {
    id: index.toString(),
    title: contentBlock.contentTitle,
    content: contentBlock.content,
    order: contentBlock.order,
  };
}

/**
 * IPaper를 PaperDetail 타입으로 변환하는 함수
 *
 * @param {IPaper} paper - Paper 문서
 * @returns {PaperDetail} 변환된 PaperDetail 타입
 * @private
 */
function paperToDetail(paper: IPaper): PaperDetail {
  // contentBlocks를 PaperContentBlock 배열로 변환 (order로 정렬)
  const contentBlocks = paper.contentBlocks
    .sort((a, b) => a.order - b.order)
    .map((contentBlock, index) => contentBlockToBlock(contentBlock, index));

  return {
    paperContentId: (paper._id as mongoose.Types.ObjectId).toString(),
    title: paper.title,
    authors: paper.authors || [],
    content: contentBlocks,
    createdAt: paper.createdAt,
    publishedAt: paper.updateDate,
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

    // 전체 개수 조회
    const totalCount = await PaperModel.countDocuments();

    // 페이지네이션 계산
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(totalCount / pageSize);

    // 논문 목록 조회 (최신순으로 정렬)
    const entities = await PaperModel.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize);

    // 엔티티를 DTO로 변환
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
  papers: UserLibrary[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}> {
  try {
    await ensureDatabaseConnection();

    const currentUser = await getUserAuthStatus();

    if (!currentUser.authenticate_status) {
      throw new Error('사용자 인증에 실패했습니다.');
    }

    if (!currentUser.authorize_status) {
      throw new Error('사용자 권한이 없습니다.');
    }

    // 전체 개수 조회
    const totalCount = await UserLibraryModel.countDocuments({
      userId: currentUser?.user?.id,
    });

    // 페이지네이션 계산
    const skip = (page - 1) * pageSize;
    const totalPages = Math.ceil(totalCount / pageSize);

    // 사용자의 논문 라이브러리 조회 (최신순으로 정렬)
    const userLibraries = await UserLibraryModel.find({
      userId: currentUser.user?.id,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    // UserLibraryEntity를 UserLibrary로 변환
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
export async function registerPaper(paperId: string): Promise<boolean> {
  try {
    await ensureDatabaseConnection();

    // 논문 존재 여부 확인
    const paper = await PaperModel.findById(paperId);
    if (!paper) {
      console.error(`논문을 찾을 수 없습니다: ${paperId}`);
      return false;
    }

    const currentUser = await getUserAuthStatus();

    if (!currentUser.authenticate_status) {
      throw new Error('사용자 인증에 실패했습니다.');
    }

    if (!currentUser.authorize_status) {
      throw new Error('사용자 권한이 없습니다.');
    }

    // Redis 채널에 메시지 발행
    try {
      await publishJson('paper:analysis', {
        user_id: currentUser.user?.id,
        paper_id: paperId,
      });
      console.log(
        `논문 심층 분석 등록: ${paperId} - ${paper.title} (사용자: ${currentUser.user?.id})`
      );
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
export async function getPaperDetail(paperId: string): Promise<PaperDetail | null> {
  try {
    await ensureDatabaseConnection();

    // Paper를 직접 조회 (contentBlocks 포함)
    const paper = await PaperModel.findById(paperId);
    if (!paper) {
      console.error(`논문을 찾을 수 없습니다: ${paperId}`);
      return null;
    }

    // Paper를 PaperDetail로 변환
    return paperToDetail(paper);
  } catch (error) {
    console.error('논문 상세 정보 조회 중 오류 발생:', error);
    throw new Error('논문 상세 정보 조회에 실패했습니다');
  }
}
