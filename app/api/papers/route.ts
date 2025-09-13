import { NextRequest, NextResponse } from 'next/server';
import { getPapers } from '@/lib/paper/paperService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // URL 파라미터에서 검색 조건 추출
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '5', 10);
    const search = searchParams.get('search') ?? undefined;
    const categories = searchParams.get('categories') ?? undefined;
    const year = searchParams.get('year') ?? undefined;
    const sort = searchParams.get('sort') ?? undefined;

    // 논문 데이터 가져오기
    const result = await getPapers(page, limit, search, categories, year, sort);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Papers API Error:', error);
    return NextResponse.json(
      { error: '논문 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
