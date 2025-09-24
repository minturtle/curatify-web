/**
 * 제목을 마크다운 헤딩으로 변환하는 유틸 함수
 * @author Minseok kim
 */

/**
 * 제목의 숫자 패턴에 따라 마크다운 헤딩 레벨을 결정하는 함수
 * 
 * @param title - 처리할 제목
 * @param defaultLevel - 기본 헤딩 레벨 (기본값: 1)
 * @returns 마크다운 헤딩 문자열
 * 
 * @example
 * processHeading("1 Attention") // "# 1 Attention"
 * processHeading("1.1 Background") // "## 1.1 Background"
 * processHeading("1.1.1 Introduction") // "### 1.1.1 Introduction"
 * processHeading("Reference") // "# Reference"
 */
export function processHeading(title: string, defaultLevel: number = 1): string {
  if (!title || typeof title !== 'string') {
    return `# ${title}`;
  }

  // 숫자 패턴 매칭 (1, 1.1, 1.1.1, 1.1.1.1 등)
  const numberPattern = /^(\d+(?:\.\d+)*)\s+(.+)$/;
  const match = title.match(numberPattern);

  if (match) {
    const [, numberPart, content] = match;
    
    // 점(.)의 개수로 헤딩 레벨 결정
    const level = numberPart.split('.').length;
    
    // 헤딩 레벨은 1-6까지만 유효
    const headingLevel = Math.min(Math.max(level, 1), 6);
    const hashes = '#'.repeat(headingLevel);
    
    return `${hashes} ${title}`;
  }

  // 숫자 패턴이 없는 경우 기본 레벨 사용
  const hashes = '#'.repeat(Math.min(Math.max(defaultLevel, 1), 6));
  return `${hashes} ${title}`;
}

/**
 * 제목 배열을 일괄 처리하는 함수
 * 
 * @param titles - 처리할 제목 배열
 * @param defaultLevel - 기본 헤딩 레벨 (기본값: 1)
 * @returns 처리된 마크다운 헤딩 배열
 */
export function processHeadings(titles: string[], defaultLevel: number = 1): string[] {
  return titles.map(title => processHeading(title, defaultLevel));
}
