/**
 * 논문 관련 서비스
 * @author Minseok kim
 */

import { Paper } from '@/lib/types/paper';

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
  // 임시 데이터 (나중에 실제 API로 교체 예정)
  const allPapers: Paper[] = [
    {
      id: '1',
      title: 'AI와 머신러닝의 발전',
      summary:
        '이 논문은 **AI**와 머신러닝의 최신 발전 동향을 다룹니다. 특히 딥러닝 모델의 성능 향상과 실제 응용 사례에 대해 자세히 분석합니다.',
      authors: ['김철수', '이영희'],
      link: 'https://example.com/paper1',
      lastUpdate: '2024-01-15',
    },
    {
      id: '2',
      title: '딥러닝을 활용한 자연어 처리',
      summary:
        '자연어 처리를 위한 **딥러닝** 모델의 성능 향상에 대한 연구입니다. Transformer 아키텍처의 발전과 BERT, GPT 모델들의 비교 분석을 포함합니다.',
      authors: ['박민수'],
      link: 'https://example.com/paper2',
      lastUpdate: '2024-01-20',
    },
    {
      id: '3',
      title: '컴퓨터 비전의 최신 동향',
      summary:
        '컴퓨터 비전 분야에서 **CNN**과 **Vision Transformer**의 발전 과정을 다룹니다. 이미지 분류, 객체 탐지, 세그멘테이션 등의 태스크에서의 성능 비교를 포함합니다.',
      authors: ['최지영', '정현우', '김태호'],
      link: 'https://example.com/paper3',
      lastUpdate: '2024-01-25',
    },
    {
      id: '4',
      title: '강화학습의 응용 사례',
      summary:
        '강화학습을 활용한 **게임 AI**와 **로봇 제어** 시스템의 실제 응용 사례를 다룹니다. AlphaGo, DQN 등의 성공 사례와 향후 발전 방향을 분석합니다.',
      authors: ['이민수', '박지영'],
      link: 'https://example.com/paper4',
      lastUpdate: '2024-01-30',
    },
    {
      id: '5',
      title: '생성형 AI의 윤리적 고려사항',
      summary:
        '**생성형 AI**의 발전에 따른 윤리적 문제와 사회적 영향을 분석합니다. 편향성, 저작권, 프라이버시 등의 문제점과 해결 방안을 제시합니다.',
      authors: ['정철수', '김영희', '박민수'],
      link: 'https://example.com/paper5',
      lastUpdate: '2024-02-05',
    },
  ];

  // 페이지네이션 계산
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const papers = allPapers.slice(startIndex, endIndex);
  const totalCount = allPapers.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    papers,
    currentPage: page,
    totalPages,
    totalCount,
  };
}

/**
 * 논문을 심층 분석을 위해 등록하는 함수
 * @param paperId 등록할 논문의 ID
 * @returns 등록 성공 여부
 */
export async function registerPaper(paperId: string): Promise<boolean> {
  try {
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 임시로 성공 응답 반환 (나중에 실제 API로 교체 예정)
    return true;
  } catch {
    return false;
  }
}
