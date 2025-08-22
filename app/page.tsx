import Header from '@/components/layout/Header';

export default function Home() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Curatify에 오신 것을 환영합니다</h1>
        <p className="mt-4 text-gray-600">AI가 큐레이션하는 연구 정보 허브</p>
      </main>
    </div>
  );
}
