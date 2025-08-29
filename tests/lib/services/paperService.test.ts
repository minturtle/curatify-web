/**
 * paperService 테스트
 * TODO: 실제 DB 연동 시 Repository 모킹을 통해 테스트 코드 작성
 * @author Minseok kim
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPapers, registerPaper } from '@/lib/paper/paperService';

// 데이터베이스 연결 모킹
vi.mock('@/lib/database/connection', () => ({
  ensureDatabaseConnection: vi.fn().mockResolvedValue(undefined),
}));

// Repository 모킹
const mockRepository = {
  count: vi.fn(),
  find: vi.fn(),
  findOne: vi.fn(),
};

vi.mock('@/lib/database/ormconfig', () => ({
  AppDataSource: {
    getRepository: vi.fn(() => mockRepository),
    isInitialized: true,
  },
}));

describe('paperService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 공통 테스트 데이터
  const mockPaperEntities = [
    {
      id: 1,
      title: 'AI와 머신러닝의 발전',
      summary: '이 논문은 **AI**와 머신러닝의 최신 발전 동향을 다룹니다.',
      abstract: '이 논문은 **AI**와 머신러닝의 최신 발전 동향을 다룹니다.',
      authors: '["김철수", "이영희"]',
      url: 'https://example.com/paper1',
      updateDate: new Date('2024-01-15'),
      createdAt: new Date('2024-01-15'),
      allCategories: 'cs.AI cs.ML',
    },
    {
      id: 2,
      title: '딥러닝을 활용한 자연어 처리',
      summary: '자연어 처리를 위한 **딥러닝** 모델의 성능 향상에 대한 연구입니다.',
      abstract: '자연어 처리를 위한 **딥러닝** 모델의 성능 향상에 대한 연구입니다.',
      authors: '["박민수"]',
      url: 'https://example.com/paper2',
      updateDate: new Date('2024-01-20'),
      createdAt: new Date('2024-01-20'),
      allCategories: 'cs.CL cs.AI',
    },
    {
      id: 3,
      title: '컴퓨터 비전의 최신 동향',
      summary: '컴퓨터 비전 분야에서 **CNN**과 **Vision Transformer**의 발전 과정을 다룹니다.',
      abstract: '컴퓨터 비전 분야에서 **CNN**과 **Vision Transformer**의 발전 과정을 다룹니다.',
      authors: '["최지영", "정현우", "김태호"]',
      url: 'https://example.com/paper3',
      updateDate: new Date('2024-01-25'),
      createdAt: new Date('2024-01-25'),
      allCategories: 'cs.CV cs.AI',
    },
    {
      id: 4,
      title: '강화학습의 응용 사례',
      summary: '강화학습을 활용한 **게임 AI**와 **로봇 제어** 시스템의 실제 응용 사례를 다룹니다.',
      abstract: '강화학습을 활용한 **게임 AI**와 **로봇 제어** 시스템의 실제 응용 사례를 다룹니다.',
      authors: '["이민수", "박지영"]',
      url: 'https://example.com/paper4',
      updateDate: new Date('2024-01-30'),
      createdAt: new Date('2024-01-30'),
      allCategories: 'cs.AI cs.LG',
    },
    {
      id: 5,
      title: '생성형 AI의 윤리적 고려사항',
      summary: '**생성형 AI**의 발전에 따른 윤리적 문제와 사회적 영향을 분석합니다.',
      abstract: '**생성형 AI**의 발전에 따른 윤리적 문제와 사회적 영향을 분석합니다.',
      authors: '["정철수", "김영희", "박민수"]',
      url: 'https://example.com/paper5',
      updateDate: new Date('2024-02-05'),
      createdAt: new Date('2024-02-05'),
      allCategories: 'cs.AI cs.CY',
    },
  ];

  describe('getPapers', () => {
    it('기본 페이지(1)에서 논문 목록을 가져와야 한다', async () => {
      // Repository 모킹 설정 - 첫 번째 페이지 (3개)
      mockRepository.count.mockResolvedValue(5);
      mockRepository.find.mockResolvedValue(mockPaperEntities.slice(0, 3));

      const result = await getPapers(1, 3);

      expect(result.papers).toHaveLength(3);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(2); // 5개 논문, 페이지당 3개
      expect(result.totalCount).toBe(5);

      // 첫 번째 페이지의 논문들 확인
      expect(result.papers[0].title).toBe('AI와 머신러닝의 발전');
      expect(result.papers[1].title).toBe('딥러닝을 활용한 자연어 처리');
      expect(result.papers[2].title).toBe('컴퓨터 비전의 최신 동향');

      // categories 필드 확인
      expect(result.papers[0].categories).toEqual(['cs.AI', 'cs.ML']);
      expect(result.papers[1].categories).toEqual(['cs.CL', 'cs.AI']);
    });

    it('두 번째 페이지에서 논문 목록을 가져와야 한다', async () => {
      // Repository 모킹 설정 - 두 번째 페이지 (2개)
      mockRepository.count.mockResolvedValue(5);
      mockRepository.find.mockResolvedValue(mockPaperEntities.slice(3, 5));

      const result = await getPapers(2, 3);

      expect(result.papers).toHaveLength(2); // 마지막 2개 논문
      expect(result.currentPage).toBe(2);
      expect(result.totalPages).toBe(2);
      expect(result.totalCount).toBe(5);

      // 두 번째 페이지의 논문들 확인
      expect(result.papers[0].title).toBe('강화학습의 응용 사례');
      expect(result.papers[1].title).toBe('생성형 AI의 윤리적 고려사항');
    });

    it('페이지 크기를 변경할 수 있어야 한다', async () => {
      // Repository 모킹 설정 - 페이지 크기 2 (첫 2개)
      mockRepository.count.mockResolvedValue(5);
      mockRepository.find.mockResolvedValue(mockPaperEntities.slice(0, 2));

      const result = await getPapers(1, 2);

      expect(result.papers).toHaveLength(2);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(3); // 5개 논문, 페이지당 2개
      expect(result.totalCount).toBe(5);
    });

    it('존재하지 않는 페이지에서는 빈 배열을 반환해야 한다', async () => {
      // Repository 모킹 설정 - 빈 결과
      mockRepository.count.mockResolvedValue(5);
      mockRepository.find.mockResolvedValue([]);

      const result = await getPapers(10, 3);

      expect(result.papers).toHaveLength(0);
      expect(result.currentPage).toBe(10);
      expect(result.totalPages).toBe(2);
      expect(result.totalCount).toBe(5);
    });

    it('기본 매개변수로 호출할 수 있어야 한다', async () => {
      // Repository 모킹 설정 - 모든 논문 (5개)
      mockRepository.count.mockResolvedValue(5);
      mockRepository.find.mockResolvedValue(mockPaperEntities);

      const result = await getPapers();

      expect(result.papers).toHaveLength(5); // 기본 페이지 크기 10, 총 5개 논문
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.totalCount).toBe(5);
    });

    it('논문 데이터의 구조가 올바르게 반환되어야 한다', async () => {
      // Repository 모킹 설정 - 1개 논문
      mockRepository.count.mockResolvedValue(1);
      mockRepository.find.mockResolvedValue([mockPaperEntities[0]]);

      const result = await getPapers(1, 1);
      const paper = result.papers[0];

      expect(paper).toHaveProperty('id');
      expect(paper).toHaveProperty('title');
      expect(paper).toHaveProperty('summary');
      expect(paper).toHaveProperty('authors');
      expect(paper).toHaveProperty('link');
      expect(paper).toHaveProperty('lastUpdate');
      expect(paper).toHaveProperty('categories');

      expect(Array.isArray(paper.authors)).toBe(true);
      expect(Array.isArray(paper.categories)).toBe(true);
      expect(typeof paper.title).toBe('string');
      expect(typeof paper.summary).toBe('string');

      // categories 필드가 올바르게 파싱되는지 확인
      expect(paper.categories).toEqual(['cs.AI', 'cs.ML']);
    });
  });

  describe('registerPaper', () => {
    it('존재하는 논문 ID로 등록에 성공해야 한다', async () => {
      // Repository 모킹 설정 - 논문 존재
      mockRepository.findOne.mockResolvedValue(mockPaperEntities[0]);

      const result = await registerPaper(1);

      expect(result).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('존재하지 않는 논문 ID로 등록에 실패해야 한다', async () => {
      // Repository 모킹 설정 - 논문 없음
      mockRepository.findOne.mockResolvedValue(null);

      const result = await registerPaper(999);

      expect(result).toBe(false);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });
});
