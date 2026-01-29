import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

vi.stubEnv('NEXT_PUBLIC_BALLDONTLIE_API_KEY', 'test-api-key');
