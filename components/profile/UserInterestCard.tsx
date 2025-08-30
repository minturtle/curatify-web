'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { UserInterestsType } from '@/lib/types/user';
import {
  updateUserInterestAction,
  removeUserInterestAction,
  ActionState,
} from '@/lib/profile/actions';
import { useActionState } from 'react';

interface UserInterestCardProps {
  interest: UserInterestsType;
}

export default function UserInterestCard({ interest }: UserInterestCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(interest.content);
  const [updateState, updateAction] = useActionState<ActionState, FormData>(
    updateUserInterestAction,
    {}
  );
  const [removeState, removeAction] = useActionState<ActionState, FormData>(
    removeUserInterestAction,
    {}
  );

  // 수정 성공 시 편집 모드 종료
  if (updateState.success && isEditing) {
    setIsEditing(false);
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(interest.content);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(interest.content);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        {isEditing ? (
          <form action={updateAction} className="flex items-center gap-2">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1"
              placeholder="관심사 내용을 입력하세요"
            />
            <input type="hidden" name="interestsId" value={interest.interestsId} />
            <input type="hidden" name="content" value={editContent} />
            <Button size="sm" variant="outline" type="submit" disabled={!editContent.trim()}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" type="button" onClick={handleCancel}>
              <X className="h-4 w-4" />
            </Button>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <span className="flex-1">{interest.content}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
              <form action={removeAction} className="inline">
                <input type="hidden" name="interestsId" value={interest.interestsId} />
                <Button
                  size="sm"
                  variant="outline"
                  type="submit"
                  onClick={(e) => {
                    if (!confirm('정말로 이 관심사를 삭제하시겠습니까?')) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        )}

        {updateState.message && (
          <p className={`text-sm mt-2 ${updateState.success ? 'text-green-600' : 'text-red-600'}`}>
            {updateState.message}
          </p>
        )}

        {removeState.message && (
          <p className={`text-sm mt-2 ${removeState.success ? 'text-green-600' : 'text-red-600'}`}>
            {removeState.message}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
