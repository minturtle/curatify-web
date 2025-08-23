/**
 * 테스트 환경 설정 파일
 * @author Minseok kim
 */

import 'reflect-metadata';
import '@testing-library/jest-dom';
import { beforeEach, afterEach } from 'vitest';

// 전역 테스트 설정
beforeEach(() => {
  // 각 테스트 전에 실행될 코드
});

afterEach(() => {
  // 각 테스트 후에 실행될 코드
  // cleanup은 @testing-library/react에서 자동으로 처리됨
});
