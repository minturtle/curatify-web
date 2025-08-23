/**
 * 논문 카드 클라이언트 컴포넌트
 * @author Minseok kim
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Paper } from '@/lib/types/paper';
import { registerPaper } from '@/lib/paper/paperService';
import { ChevronDown, ChevronUp, ExternalLink, Calendar, Users, Brain } from 'lucide-react';

interface PaperCardProps {
  paper: Paper;
}

export default function PaperCard({ paper }: PaperCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDeepAnalysis = async () => {
    setIsRegistering(true);
    try {
      const success = await registerPaper(paper.id);
      if (success) {
        alert('심층 분석이 등록되었습니다.');
      } else {
        alert('심층 분석 등록에 실패했습니다.');
      }
    } catch (error) {
      alert(`심층 분석 등록 중 오류가 발생했습니다. ${error}`);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader
        className="cursor-pointer"
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <CardTitle className="flex items-center justify-between text-lg">
          <span className="flex-1">{paper.title}</span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" data-testid="chevron-up" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" data-testid="chevron-down" />
          )}
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-2">
          {/* Abstract */}
          <div>
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{paper.summary}</ReactMarkdown>
            </div>
          </div>

          {/* Meta Information - Authors, LastUpdate, URL */}
          <div
            className="flex flex-col md:flex-row md:items-center md:space-x-6 md:space-y-0 space-y-2"
            data-testid="paper-meta"
          >
            {/* Authors */}
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                <strong>Authors:</strong> {paper.authors.join(', ')}
              </span>
            </div>

            {/* Last Update */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                <strong>Last Update:</strong> {paper.lastUpdate}
              </span>
            </div>

            {/* Link */}
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4 text-gray-500" />
              <a
                href={paper.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                View Paper
              </a>
            </div>
          </div>

          {/* 심층 분석 버튼 */}
          <div className="pt-4">
            <Button
              onClick={handleDeepAnalysis}
              disabled={isRegistering}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              data-testid="deep-analysis-button"
            >
              <Brain className="h-4 w-4 mr-2" />
              {isRegistering ? '등록 중...' : '심층 분석'}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
