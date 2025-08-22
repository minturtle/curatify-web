/**
 * 논문 관련 타입 정의
 * @author Minseok kim
 */

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  authors: string[];
  link: string;
  lastUpdate: string;
}

export interface PaperListProps {
  papers: Paper[];
  currentPage: number;
  totalPages: number;
}
