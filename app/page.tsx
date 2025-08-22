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
      <Header isLoggedIn={true} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">AI가 추천하는 논문</h2>
        </div>

        <PaperList papers={papers} />
        <PaginationSSR currentPage={currentPage} totalPages={totalPages} />
      </main>
    </div>
  );
}
