/**
 * paperService 테스트
 * TODO: 실제 DB 연동 시 Repository 모킹을 통해 테스트 코드 작성
 * @author Minseok kim
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPapers, registerPaper, getUserLibrary, getPaperDetail } from '@/lib/paper/paperService';

// 데이터베이스 연결 모킹
vi.mock('@/lib/database/connection', () => ({
  ensureDatabaseConnection: vi.fn().mockResolvedValue(undefined),
}));

// Redis 클라이언트 모킹
vi.mock('@/lib/redis/client', () => ({
  publishJson: vi.fn().mockResolvedValue(undefined),
}));

// 세션 모킹
vi.mock('@/lib/auth/session', () => ({
  getSession: vi.fn(),
}));

// Repository 모킹
const mockRepository = {
  count: vi.fn(),
  find: vi.fn(),
  findOne: vi.fn(),
};

const mockUserLibraryRepository = {
  count: vi.fn(),
  find: vi.fn(),
  findOne: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
};

const mockPaperContentRepository = {
  findOne: vi.fn(),
};

vi.mock('@/lib/database/repositories', () => ({
  getPaperRepository: vi.fn(() => mockRepository),
  getUserLibraryRepository: vi.fn(() => mockUserLibraryRepository),
  getPaperContentRepository: vi.fn(() => mockPaperContentRepository),
}));

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
      categories: Promise.resolve([
        { id: 1, name: 'cs.AI' },
        { id: 2, name: 'cs.ML' },
      ]),
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
      categories: Promise.resolve([
        { id: 3, name: 'cs.CL' },
        { id: 1, name: 'cs.AI' },
      ]),
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
      categories: Promise.resolve([
        { id: 4, name: 'cs.CV' },
        { id: 1, name: 'cs.AI' },
      ]),
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
      categories: Promise.resolve([
        { id: 1, name: 'cs.AI' },
        { id: 5, name: 'cs.LG' },
      ]),
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
      categories: Promise.resolve([
        { id: 1, name: 'cs.AI' },
        { id: 6, name: 'cs.CY' },
      ]),
    },
  ];

  // UserLibrary 테스트 데이터
  const mockUserLibraryEntities = [
    {
      id: 1,
      userId: 123,
      paperContentId: 1,
      createdAt: new Date('2024-01-15'),
      paperContent: Promise.resolve({
        id: 1,
        title: 'AI와 머신러닝의 발전',
        authors: '김철수, 이영희',
        content: '논문 전체 내용...',
        paperId: 1,
        createdAt: new Date('2024-01-15'),
      }),
    },
    {
      id: 2,
      userId: 123,
      paperContentId: 2,
      createdAt: new Date('2024-01-20'),
      paperContent: Promise.resolve({
        id: 2,
        title: '딥러닝을 활용한 자연어 처리',
        authors: '박민수',
        content: '논문 전체 내용...',
        paperId: 2,
        createdAt: new Date('2024-01-20'),
      }),
    },
    {
      id: 3,
      userId: 123,
      paperContentId: 3,
      createdAt: new Date('2024-01-25'),
      paperContent: Promise.resolve({
        id: 3,
        title: '컴퓨터 비전의 최신 동향',
        authors: '최지영, 정현우, 김태호',
        content: '논문 전체 내용...',
        paperId: 3,
        createdAt: new Date('2024-01-25'),
      }),
    },
  ];

  // PaperDetail 테스트 데이터
  const mockPaperContentEntities = [
    {
      id: 1,
      title: 'AI와 머신러닝의 발전',
      authors: '김철수, 이영희',
      content:
        '이 논문은 인공지능과 머신러닝의 최신 발전 동향을 다룹니다. 특히 딥러닝 모델의 성능 향상과 실제 응용 사례에 대해 자세히 분석합니다.',
      paperId: 1,
      createdAt: new Date('2024-01-15'),
      paper: {
        id: 1,
        title: 'AI와 머신러닝의 발전',
        summary: '이 논문은 **AI**와 머신러닝의 최신 발전 동향을 다룹니다.',
        abstract: '이 논문은 **AI**와 머신러닝의 최신 발전 동향을 다룹니다.',
        authors: '["김철수", "이영희"]',
        url: 'https://example.com/paper1',
        updateDate: new Date('2024-01-15'),
        createdAt: new Date('2024-01-15'),
      },
    },
    {
      id: 2,
      title: '딥러닝을 활용한 자연어 처리',
      authors: '박민수',
      content:
        '자연어 처리를 위한 딥러닝 모델의 성능 향상에 대한 연구입니다. Transformer 아키텍처와 BERT 모델의 발전 과정을 다룹니다.',
      paperId: 2,
      createdAt: new Date('2024-01-20'),
      paper: {
        id: 2,
        title: '딥러닝을 활용한 자연어 처리',
        summary: '자연어 처리를 위한 **딥러닝** 모델의 성능 향상에 대한 연구입니다.',
        abstract: '자연어 처리를 위한 **딥러닝** 모델의 성능 향상에 대한 연구입니다.',
        authors: '["박민수"]',
        url: 'https://example.com/paper2',
        updateDate: new Date('2024-01-20'),
        createdAt: new Date('2024-01-20'),
      },
    },
    {
      id: 3,
      title: '컴퓨터 비전의 최신 동향',
      authors: '최지영, 정현우, 김태호',
      content:
        '컴퓨터 비전 분야에서 CNN과 Vision Transformer의 발전 과정을 다룹니다. 이미지 분류, 객체 감지, 세그멘테이션 등의 태스크에서의 성능 비교를 포함합니다.',
      paperId: 3,
      createdAt: new Date('2024-01-25'),
      paper: {
        id: 3,
        title: '컴퓨터 비전의 최신 동향',
        summary: '컴퓨터 비전 분야에서 **CNN**과 **Vision Transformer**의 발전 과정을 다룹니다.',
        abstract: '컴퓨터 비전 분야에서 **CNN**과 **Vision Transformer**의 발전 과정을 다룹니다.',
        authors: '["최지영", "정현우", "김태호"]',
        url: 'https://example.com/paper3',
        updateDate: new Date('2024-01-25'),
        createdAt: new Date('2024-01-25'),
      },
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

  describe('getUserLibrary', () => {
    const mockSession = {
      userId: 123,
      email: 'test@example.com',
      role: 'approved' as const,
    };

    it('유효한 세션으로 사용자 라이브러리를 조회할 수 있어야 한다', async () => {
      // 세션 모킹 설정 - 유효한 세션
      const { getSession } = await import('@/lib/auth/session');
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Repository 모킹 설정 - 3개의 저장된 논문
      mockUserLibraryRepository.count.mockResolvedValue(3);
      mockUserLibraryRepository.find.mockResolvedValue(mockUserLibraryEntities);

      const result = await getUserLibrary(1, 3);

      expect(result.papers).toHaveLength(3);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.totalCount).toBe(3);

      // 첫 번째 논문 확인
      const firstPaper = result.papers[0];
      expect(firstPaper.paperContentId).toBe(1);
      expect(firstPaper.title).toBe('AI와 머신러닝의 발전');
      expect(firstPaper.authors).toEqual(['김철수', '이영희']);
      expect(firstPaper.createdAt).toBeInstanceOf(Date);
    });

    it('페이지네이션이 올바르게 작동해야 한다', async () => {
      // 세션 모킹 설정 - 유효한 세션
      const { getSession } = await import('@/lib/auth/session');
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Repository 모킹 설정 - 5개의 저장된 논문, 첫 페이지 2개
      mockUserLibraryRepository.count.mockResolvedValue(5);
      mockUserLibraryRepository.find.mockResolvedValue(mockUserLibraryEntities.slice(0, 2));

      const result = await getUserLibrary(1, 2);

      expect(result.papers).toHaveLength(2);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(3); // 5개 논문, 페이지당 2개
      expect(result.totalCount).toBe(5);
    });

    it('저장된 논문이 없으면 빈 배열을 반환해야 한다', async () => {
      // 세션 모킹 설정 - 유효한 세션
      const { getSession } = await import('@/lib/auth/session');
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Repository 모킹 설정 - 저장된 논문 없음
      mockUserLibraryRepository.count.mockResolvedValue(0);
      mockUserLibraryRepository.find.mockResolvedValue([]);

      const result = await getUserLibrary(1, 10);

      expect(result.papers).toHaveLength(0);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(0);
      expect(result.totalCount).toBe(0);
    });

    it('저장된 논문의 구조가 올바르게 반환되어야 한다', async () => {
      // 세션 모킹 설정 - 유효한 세션
      const { getSession } = await import('@/lib/auth/session');
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Repository 모킹 설정 - 1개의 저장된 논문
      mockUserLibraryRepository.count.mockResolvedValue(1);
      mockUserLibraryRepository.find.mockResolvedValue([mockUserLibraryEntities[0]]);

      const result = await getUserLibrary(1, 1);
      const paper = result.papers[0];

      expect(paper).toHaveProperty('paperContentId');
      expect(paper).toHaveProperty('title');
      expect(paper).toHaveProperty('authors');
      expect(paper).toHaveProperty('createdAt');

      expect(typeof paper.paperContentId).toBe('number');
      expect(typeof paper.title).toBe('string');
      expect(Array.isArray(paper.authors)).toBe(true);
      expect(paper.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('registerPaper', () => {
    const mockSession = {
      userId: 123,
      email: 'test@example.com',
      role: 'approved' as const,
    };

    it('존재하는 논문 ID와 유효한 세션으로 등록에 성공해야 한다', async () => {
      // Repository 모킹 설정 - 논문 존재
      mockRepository.findOne.mockResolvedValue(mockPaperEntities[0]);

      // 세션 모킹 설정 - 유효한 세션
      const { getSession } = await import('@/lib/auth/session');
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Redis 모킹 설정
      const { publishJson } = await import('@/lib/redis/client');

      const result = await registerPaper(1);

      expect(result).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(getSession).toHaveBeenCalled();
      expect(publishJson).toHaveBeenCalledWith('paper:analysis', {
        user_id: 123,
        paper_id: 1,
      });
    });

    it('존재하지 않는 논문 ID로 등록에 실패해야 한다', async () => {
      // Repository 모킹 설정 - 논문 없음
      mockRepository.findOne.mockResolvedValue(null);

      const result = await registerPaper(999);

      expect(result).toBe(false);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
    });

    it('세션이 없으면 등록에 실패해야 한다', async () => {
      // Repository 모킹 설정 - 논문 존재
      mockRepository.findOne.mockResolvedValue(mockPaperEntities[0]);

      // 세션 모킹 설정 - 세션 없음
      const { getSession } = await import('@/lib/auth/session');
      vi.mocked(getSession).mockResolvedValue(null);

      const result = await registerPaper(1);

      expect(result).toBe(false);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(getSession).toHaveBeenCalled();
    });

    it('Redis 발행 실패 시에도 논문 등록은 성공해야 한다', async () => {
      // Repository 모킹 설정 - 논문 존재
      mockRepository.findOne.mockResolvedValue(mockPaperEntities[0]);

      // 세션 모킹 설정 - 유효한 세션
      const { getSession } = await import('@/lib/auth/session');
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Redis 발행 모킹 설정 - 실패
      const { publishJson } = await import('@/lib/redis/client');
      vi.mocked(publishJson).mockRejectedValue(new Error('Redis connection failed'));

      const result = await registerPaper(1);

      expect(result).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(getSession).toHaveBeenCalled();
      expect(publishJson).toHaveBeenCalledWith('paper:analysis', {
        user_id: 123,
        paper_id: 1,
      });
    });

    it('다양한 논문 ID로 등록할 수 있어야 한다', async () => {
      // Repository 모킹 설정 - 다른 논문
      mockRepository.findOne.mockResolvedValue(mockPaperEntities[2]);

      // 세션 모킹 설정 - 유효한 세션
      const { getSession } = await import('@/lib/auth/session');
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Redis 모킹 설정
      const { publishJson } = await import('@/lib/redis/client');

      const result = await registerPaper(3);

      expect(result).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 3 } });
      expect(publishJson).toHaveBeenCalledWith('paper:analysis', {
        user_id: 123,
        paper_id: 3,
      });
    });

    it('Redis 메시지가 올바른 형식으로 발행되어야 한다', async () => {
      // Repository 모킹 설정 - 논문 존재
      mockRepository.findOne.mockResolvedValue(mockPaperEntities[0]);

      // 세션 모킹 설정 - 유효한 세션
      const { getSession } = await import('@/lib/auth/session');
      vi.mocked(getSession).mockResolvedValue(mockSession);

      // Redis 모킹 설정
      const { publishJson } = await import('@/lib/redis/client');

      await registerPaper(1);

      expect(publishJson).toHaveBeenCalledWith('paper:analysis', {
        user_id: 123,
        paper_id: 1,
      });
    });
  });

  describe('getPaperDetail', () => {
    it('존재하는 논문 콘텐츠 ID로 상세 정보를 조회할 수 있어야 한다', async () => {
      // Repository 모킹 설정 - 논문 콘텐츠 존재
      mockPaperContentRepository.findOne.mockResolvedValue(mockPaperContentEntities[0]);

      const result = await getPaperDetail(1);

      expect(result).not.toBeNull();
      expect(result?.paperContentId).toBe(1);
      expect(result?.title).toBe('AI와 머신러닝의 발전');
      expect(result?.authors).toEqual(['김철수', '이영희']);
      expect(result?.content).toBe(
        '이 논문은 인공지능과 머신러닝의 최신 발전 동향을 다룹니다. 특히 딥러닝 모델의 성능 향상과 실제 응용 사례에 대해 자세히 분석합니다.'
      );
      expect(result?.createdAt).toBeInstanceOf(Date);
      expect(result?.publishedAt).toBeInstanceOf(Date);
      expect(result?.url).toBe('https://example.com/paper1');

      expect(mockPaperContentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['paper'],
      });
    });

    it('존재하지 않는 논문 콘텐츠 ID로 조회 시 null을 반환해야 한다', async () => {
      // Repository 모킹 설정 - 논문 콘텐츠 없음
      mockPaperContentRepository.findOne.mockResolvedValue(null);

      const result = await getPaperDetail(999);

      expect(result).toBeNull();
      expect(mockPaperContentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['paper'],
      });
    });

    it('authors 필드가 올바르게 파싱되어야 한다', async () => {
      // Repository 모킹 설정 - 여러 저자가 있는 논문
      mockPaperContentRepository.findOne.mockResolvedValue(mockPaperContentEntities[2]);

      const result = await getPaperDetail(3);

      expect(result?.authors).toEqual(['최지영', '정현우', '김태호']);
    });

    it('authors 필드가 비어있는 경우 빈 배열을 반환해야 한다', async () => {
      // Repository 모킹 설정 - 저자 정보가 없는 논문
      const paperContentWithoutAuthors = {
        ...mockPaperContentEntities[0],
        authors: null,
      };
      mockPaperContentRepository.findOne.mockResolvedValue(paperContentWithoutAuthors);

      const result = await getPaperDetail(1);

      expect(result?.authors).toEqual([]);
    });

    it('url 필드가 null인 경우 빈 문자열을 반환해야 한다', async () => {
      // Repository 모킹 설정 - URL이 null인 논문
      const paperContentWithNullUrl = {
        ...mockPaperContentEntities[0],
        paper: {
          ...mockPaperContentEntities[0].paper,
          url: null,
        },
      };
      mockPaperContentRepository.findOne.mockResolvedValue(paperContentWithNullUrl);

      const result = await getPaperDetail(1);

      expect(result?.url).toBe('');
    });
  });
});
