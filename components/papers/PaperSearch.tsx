'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, ChevronDown, RotateCcw, ChevronUp } from 'lucide-react';
import AddPaperModal from './AddPaperModal';

interface PaperSearchProps {
  categories?: { code: string; description: string }[];
}

export default function PaperSearch({ categories = [] }: PaperSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [publicationYear, setPublicationYear] = useState(searchParams.get('year') || 'all');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [userOnly, setUserOnly] = useState(searchParams.get('userOnly') === 'true');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }

    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    }

    if (publicationYear && publicationYear !== 'all') {
      params.set('year', publicationYear);
    }

    if (sortBy && sortBy !== 'newest') {
      params.set('sort', sortBy);
    }

    if (userOnly) {
      params.set('userOnly', 'true');
    }

    // 페이지를 1로 리셋
    params.set('page', '1');

    const queryString = params.toString();
    const newUrl = queryString ? `/?${queryString}` : '/';

    router.push(newUrl);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPublicationYear('all');
    setSortBy('newest');
    setUserOnly(false);
    router.push('/');
  };

  return (
    <div className="mb-8 space-y-6">
      {/* 검색바 섹션 */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">연구 논문 검색</h3>

          {/* 검색바 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="논문 제목을 입력하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="pl-10 pr-4 py-3 text-base"
            />
          </div>

          {/* 내가 추가한 논문만 보기 체크박스 */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="userOnly"
              checked={userOnly}
              onCheckedChange={(checked: boolean) => setUserOnly(checked)}
            />
            <label
              htmlFor="userOnly"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              내가 추가한 논문만 보기
            </label>
          </div>

          {/* 검색 버튼들 */}
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <div className="flex gap-3">
              <Button onClick={handleSearch} className="flex items-center gap-2 cursor-pointer">
                <Search className="h-4 w-4" />
                검색
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="flex items-center gap-2 cursor-pointer"
              >
                고급 검색
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showAdvancedSearch ? 'rotate-180' : ''}`}
                />
              </Button>
            </div>
            <AddPaperModal 
              onSuccess={() => {
                // 논문 등록 성공 시 페이지 새로고침
                window.location.reload();
              }}
            />
          </div>
        </div>
      </Card>

      {/* 고급 검색 필터 섹션 */}
      {showAdvancedSearch && (
        <Card className="p-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">카테고리별 필터</h3>

            {/* 카테고리 체크박스 */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <div key={category.code} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.code}
                      checked={selectedCategories.includes(category.code)}
                      onCheckedChange={(checked: boolean) => {
                        if (checked) {
                          setSelectedCategories([...selectedCategories, category.code]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter((cat) => cat !== category.code)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={category.code}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.description}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* 발행년도와 정렬 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 발행년도 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">발행년도</label>
                <Select value={publicationYear} onValueChange={setPublicationYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="전체 년도" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 년도</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="older">2020년 이전</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 정렬 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">정렬 기준</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="정렬 기준" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">최신순</SelectItem>
                    <SelectItem value="oldest">오래된순</SelectItem>
                    <SelectItem value="title">제목순</SelectItem>
                    <SelectItem value="relevance">관련성순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 필터 초기화 버튼 */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={clearSearch} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                필터 초기화
              </Button>
            </div>

            {/* 최소화 버튼 */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setShowAdvancedSearch(false)}
                className="w-full flex items-center justify-center"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
