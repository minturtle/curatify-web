import Header from '@/components/layout/Header';
import PaperList from '@/components/papers/PaperList';
import PaginationSSR from '@/components/ui/pagination-ssr';
import { getPapers } from '@/lib/services/paperService';

interface HomePageProps {
  searchParams: { page?: string };
}

export default async function Home({ searchParams }: HomePageProps) {
  // URL 파라미터에서 페이지 번호 추출 (기본값: 1)
  const currentPage = parseInt((await searchParams).page ?? '1', 10);

  // Service에서 논문 데이터 가져오기
  const { papers, totalPages } = await getPapers(currentPage, 3);

  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Curatify에 오신 것을 환영합니다</h1>
          <p className="mt-4 text-gray-600">AI가 큐레이션하는 연구 정보 허브</p>
        </div>

        <PaperList papers={papers} />
        <PaginationSSR currentPage={currentPage} totalPages={totalPages} />
      </main>
    </div>
  );
}
