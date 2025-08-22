import Header from '@/components/layout/Header';
import PaperList from '@/components/papers/PaperList';
import { Paper } from '@/lib/types/paper';

// 임시 데이터 (나중에 API에서 가져올 예정)
const mockPapers: Paper[] = [
  {
    id: '1',
    title: 'AI와 머신러닝의 발전',
    abstract:
      '이 논문은 **AI**와 머신러닝의 최신 발전 동향을 다룹니다. 특히 딥러닝 모델의 성능 향상과 실제 응용 사례에 대해 자세히 분석합니다.',
    authors: ['김철수', '이영희'],
    link: 'https://example.com/paper1',
    lastUpdate: '2024-01-15',
  },
  {
    id: '2',
    title: '딥러닝을 활용한 자연어 처리',
    abstract:
      '자연어 처리를 위한 **딥러닝** 모델의 성능 향상에 대한 연구입니다. Transformer 아키텍처의 발전과 BERT, GPT 모델들의 비교 분석을 포함합니다.',
    authors: ['박민수'],
    link: 'https://example.com/paper2',
    lastUpdate: '2024-01-20',
  },
  {
    id: '3',
    title: '컴퓨터 비전의 최신 동향',
    abstract:
      '컴퓨터 비전 분야에서 **CNN**과 **Vision Transformer**의 발전 과정을 다룹니다. 이미지 분류, 객체 탐지, 세그멘테이션 등의 태스크에서의 성능 비교를 포함합니다.',
    authors: ['최지영', '정현우', '김태호'],
    link: 'https://example.com/paper3',
    lastUpdate: '2024-01-25',
  },
];

export default function Home() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Curatify에 오신 것을 환영합니다</h1>
          <p className="mt-4 text-gray-600">AI가 큐레이션하는 연구 정보 허브</p>
        </div>

        <PaperList papers={mockPapers} currentPage={1} totalPages={3} />
      </main>
    </div>
  );
}
