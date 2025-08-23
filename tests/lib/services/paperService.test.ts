/**
 * paperService 테스트
 * TODO: 실제 DB 연동 시 Repository 모킹을 통해 테스트 코드 작성
 * @author Minseok kim
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPapers, registerPaper } from '@/lib/paper/paperService';

describe('paperService', () => {
  describe('getPapers', () => {
    it('기본 페이지(1)에서 논문 목록을 가져와야 한다', async () => {
      const result = await getPapers(1, 3);

      expect(result.papers).toHaveLength(3);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(2); // 5개 논문, 페이지당 3개
      expect(result.totalCount).toBe(5);

      // 첫 번째 페이지의 논문들 확인
      expect(result.papers[0].title).toBe('AI와 머신러닝의 발전');
      expect(result.papers[1].title).toBe('딥러닝을 활용한 자연어 처리');
      expect(result.papers[2].title).toBe('컴퓨터 비전의 최신 동향');
    });

    it('두 번째 페이지에서 논문 목록을 가져와야 한다', async () => {
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
      const result = await getPapers(1, 2);

      expect(result.papers).toHaveLength(2);
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(3); // 5개 논문, 페이지당 2개
      expect(result.totalCount).toBe(5);
    });

    it('존재하지 않는 페이지에서는 빈 배열을 반환해야 한다', async () => {
      const result = await getPapers(10, 3);

      expect(result.papers).toHaveLength(0);
      expect(result.currentPage).toBe(10);
      expect(result.totalPages).toBe(2);
      expect(result.totalCount).toBe(5);
    });

    it('기본 매개변수로 호출할 수 있어야 한다', async () => {
      const result = await getPapers();

      expect(result.papers).toHaveLength(5); // 기본 페이지 크기 10, 총 5개 논문
      expect(result.currentPage).toBe(1);
      expect(result.totalPages).toBe(1);
      expect(result.totalCount).toBe(5);
    });

    it('논문 데이터의 구조가 올바르게 반환되어야 한다', async () => {
      const result = await getPapers(1, 1);
      const paper = result.papers[0];

      expect(paper).toHaveProperty('id');
      expect(paper).toHaveProperty('title');
      expect(paper).toHaveProperty('abstract');
      expect(paper).toHaveProperty('authors');
      expect(paper).toHaveProperty('link');
      expect(paper).toHaveProperty('lastUpdate');

      expect(Array.isArray(paper.authors)).toBe(true);
      expect(typeof paper.title).toBe('string');
      expect(typeof paper.summary).toBe('string');
    });
  });
});
