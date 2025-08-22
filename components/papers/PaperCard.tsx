/**
 * 논문 카드 클라이언트 컴포넌트
 * @author Minseok kim
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Paper } from '@/lib/types/paper';
import { ChevronDown, ChevronUp, ExternalLink, Calendar, Users } from 'lucide-react';

interface PaperCardProps {
  paper: Paper;
}

export default function PaperCard({ paper }: PaperCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader
        className="pb-2 cursor-pointer"
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
        <CardContent className="pt-0 space-y-4">
          {/* Abstract */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Abstract</h4>
            <div className="prose prose-sm max-w-none text-gray-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{paper.abstract}</ReactMarkdown>
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
        </CardContent>
      )}
    </Card>
  );
}
