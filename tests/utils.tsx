/**
 * 테스트 유틸리티 함수들
 * @author Minseok kim
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// 커스텀 렌더 함수를 위한 타입
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

// 커스텀 렌더 함수
function customRender(ui: ReactElement, options: CustomRenderOptions = {}) {
  const { wrapper: Wrapper, ...renderOptions } = options;

  if (Wrapper) {
    return render(ui, { wrapper: Wrapper, ...renderOptions });
  }

  return render(ui, renderOptions);
}

// 모든 테스트 유틸리티를 다시 export
export * from '@testing-library/react';
export { customRender as render };
