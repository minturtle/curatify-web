/**
 * PaperCard 컴포넌트 테스트
 * @author Minseok kim
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '../../utils';
import userEvent from '@testing-library/user-event';
import PaperCard from '@/components/papers/PaperCard';
import { Paper } from '@/lib/types/paper';
import * as paperService from '@/lib/services/paperService';

const mockPaper: Paper = {
  id: '1',
  title: 'AI와 머신러닝의 발전',
  abstract: '이 논문은 **AI**와 머신러닝의 최신 발전 동향을 다룹니다.',
  authors: ['김철수', '이영희'],
  link: 'https://example.com/paper1',
  lastUpdate: '2024-01-15',
};

describe('PaperCard 컴포넌트', () => {
  const defaultProps = {
    paper: mockPaper,
  };

  it('초기 상태에서는 상세 정보가 숨겨져야 한다', () => {
    render(<PaperCard {...defaultProps} />);

    // Abstract가 숨겨져 있어야 함
    expect(screen.queryByText(/이 논문은/)).not.toBeInTheDocument();

    // Authors가 숨겨져 있어야 함
    expect(screen.queryByText('김철수, 이영희')).not.toBeInTheDocument();

    // Link가 숨겨져 있어야 함
    expect(screen.queryByRole('link', { name: /view paper/i })).not.toBeInTheDocument();

    // ChevronDown 아이콘이 표시되어야 함
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });

  it('제목 클릭 시 상세 정보가 토글되어야 한다', async () => {
    const user = userEvent.setup();
    render(<PaperCard {...defaultProps} />);

    const paperTitle = screen.getByText('AI와 머신러닝의 발전');

    // 초기 상태 확인 (축소됨)
    expect(screen.queryByText(/이 논문은/)).not.toBeInTheDocument();
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();

    // 제목 클릭하여 확장
    await user.click(paperTitle);

    // 확장 상태 확인
    expect(screen.getByText(/이 논문은/)).toBeInTheDocument();
    expect(screen.getByText(/머신러닝의 최신 발전 동향/)).toBeInTheDocument();
    expect(screen.getByText('김철수, 이영희')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view paper/i })).toBeInTheDocument();
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByTestId('chevron-up')).toBeInTheDocument();

    // 다시 클릭하여 축소
    await user.click(paperTitle);

    // 축소 상태 확인
    expect(screen.queryByText(/이 논문은/)).not.toBeInTheDocument();
    expect(screen.queryByText('김철수, 이영희')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /view paper/i })).not.toBeInTheDocument();
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });

  it('헤더 영역 클릭 시에도 토글되어야 한다', async () => {
    const user = userEvent.setup();
    render(<PaperCard {...defaultProps} />);

    // CardHeader 영역 클릭
    const cardHeader = screen.getByRole('button');

    // 초기 상태 확인
    expect(screen.queryByText(/이 논문은/)).not.toBeInTheDocument();

    // 헤더 클릭하여 확장
    await user.click(cardHeader);

    // 확장 상태 확인
    expect(screen.getByText(/이 논문은/)).toBeInTheDocument();
    expect(screen.getByTestId('chevron-up')).toBeInTheDocument();
  });

  it('아이콘만 클릭해도 토글되어야 한다', async () => {
    const user = userEvent.setup();
    render(<PaperCard {...defaultProps} />);

    const chevronIcon = screen.getByTestId('chevron-down');

    // 초기 상태 확인
    expect(screen.queryByText(/이 논문은/)).not.toBeInTheDocument();

    // 아이콘 클릭하여 확장
    await user.click(chevronIcon);

    // 확장 상태 확인
    expect(screen.getByText(/이 논문은/)).toBeInTheDocument();
    expect(screen.getByTestId('chevron-up')).toBeInTheDocument();
  });

  it('데스크톱에서 Author, LastUpdate, URL이 수평으로 배치되어야 한다', async () => {
    const user = userEvent.setup();
    render(<PaperCard {...defaultProps} />);

    // 논문 확장
    const paperTitle = screen.getByText('AI와 머신러닝의 발전');
    await user.click(paperTitle);

    // 메타 정보 컨테이너가 수평 배치되어야 함
    const metaContainer = screen.getByTestId('paper-meta');
    expect(metaContainer).toHaveClass(
      'flex',
      'flex-col',
      'md:flex-row',
      'md:items-center',
      'md:space-x-6',
      'md:space-y-0',
      'space-y-2'
    );

    // 각 메타 정보 항목들이 존재해야 함
    expect(screen.getByText('김철수, 이영희')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view paper/i })).toBeInTheDocument();
  });

  it('모바일에서 Author, LastUpdate, URL이 수직으로 배치되어야 한다', async () => {
    const user = userEvent.setup();
    render(<PaperCard {...defaultProps} />);

    // 논문 확장
    const paperTitle = screen.getByText('AI와 머신러닝의 발전');
    await user.click(paperTitle);

    // 메타 정보 컨테이너가 수직 배치되어야 함 (기본값)
    const metaContainer = screen.getByTestId('paper-meta');
    expect(metaContainer).toHaveClass('flex', 'flex-col', 'space-y-2');
  });

  describe('심층 분석 버튼', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('심층 분석 버튼 클릭 시 registerPaper 함수가 호출되어야 한다', async () => {
      const user = userEvent.setup();
      const mockRegisterPaper = vi.spyOn(paperService, 'registerPaper').mockResolvedValue(true);

      render(<PaperCard {...defaultProps} />);

      // 논문 확장
      const paperTitle = screen.getByText('AI와 머신러닝의 발전');
      await user.click(paperTitle);

      // 심층 분석 버튼 클릭
      const deepAnalysisButton = screen.getByTestId('deep-analysis-button');
      await user.click(deepAnalysisButton);

      // registerPaper 함수가 올바른 인자로 호출되어야 함
      expect(mockRegisterPaper).toHaveBeenCalledWith('1');
      expect(mockRegisterPaper).toHaveBeenCalledTimes(1);
    });

    it('심층 분석 등록 중에는 버튼이 비활성화되어야 한다', async () => {
      const user = userEvent.setup();
      vi.spyOn(paperService, 'registerPaper').mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(true), 100))
      );

      render(<PaperCard {...defaultProps} />);

      // 논문 확장
      const paperTitle = screen.getByText('AI와 머신러닝의 발전');
      await user.click(paperTitle);

      // 심층 분석 버튼 클릭
      const deepAnalysisButton = screen.getByTestId('deep-analysis-button');
      await user.click(deepAnalysisButton);

      // 버튼이 비활성화되어야 함
      expect(deepAnalysisButton).toBeDisabled();
      expect(screen.getByText('등록 중...')).toBeInTheDocument();
    });
  });
});
