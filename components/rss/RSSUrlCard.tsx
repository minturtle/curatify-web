/**
 * RSS URL 카드 컴포넌트
 * @author Minseok kim
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { RSSUrl } from '@/lib/types/rss';
import { deleteRSSUrlAction } from '@/lib/rss/actions';
import { useActionState } from 'react';
import { useState, useEffect } from 'react';

interface RSSUrlCardProps {
  url: RSSUrl;
}

export default function RSSUrlCard({ url }: RSSUrlCardProps) {
  const [state, formAction] = useActionState(deleteRSSUrlAction, { success: false });
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    const formData = new FormData();
    formData.append('rssUrlId', url.id);

    await formAction(formData);
  };

  // 상태 변경 감지
  useEffect(() => {
    if (state.success) {
      setShowConfirm(false);
      // 성공 시 페이지 새로고침
      window.location.reload();
    } else if (state.error) {
      alert(state.error);
    }
  }, [state]);

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">{url.url}</p>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <span
              className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
                url.type === 'youtube' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}
            >
              {url.type === 'youtube' ? 'YouTube' : 'RSS'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 삭제 확인 모달 */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
              <h3 className="text-lg font-semibold mb-4">RSS URL 삭제</h3>
              <p className="text-gray-600 mb-6">
                정말 삭제하시겠습니까? 이미 존재하는 RSS 피드는 제거되지 않습니다.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={handleCancelDelete}>
                  취소
                </Button>
                <Button variant="destructive" onClick={handleConfirmDelete}>
                  삭제
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
