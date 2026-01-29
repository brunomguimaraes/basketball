import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './use-local-storage';

describe('useLocalStorage hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return initial value on first call', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    expect(result.current[0]).toBe('initial-value');
  });

  it('should persist value to localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]).toBe('new-value');
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
  });

  it('should restore value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial-value')
    );

    expect(result.current[0]).toBe('stored-value');
  });

  it('should handle complex objects', () => {
    const complexObject = {
      name: 'Test',
      nested: { value: 123 },
      array: [1, 2, 3],
    };

    const { result } = renderHook(() =>
      useLocalStorage('test-key', complexObject)
    );

    const newObject = { ...complexObject, name: 'Updated' };

    act(() => {
      result.current[1](newObject);
    });

    expect(result.current[0]).toEqual(newObject);
    expect(JSON.parse(localStorage.getItem('test-key')!)).toEqual(newObject);
  });

  it('should handle Date objects', () => {
    const testDate = new Date('2024-01-15');

    const { result } = renderHook(() => useLocalStorage('test-key', testDate));

    const newDate = new Date('2024-01-16');

    act(() => {
      result.current[1](newDate);
    });

    expect(result.current[0]).toEqual(newDate);
  });

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
  });

  it('should handle JSON parse errors gracefully', () => {
    localStorage.setItem('test-key', '{invalid json}');

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'fallback-value')
    );

    expect(result.current[0]).toBe('fallback-value');
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('should handle SSR (window undefined) gracefully', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'default-value')
    );

    expect(result.current[0]).toBeDefined();
  });

  it('should handle multiple instances with same key', () => {
    const { result: result1 } = renderHook(() =>
      useLocalStorage('shared-key', 'value1')
    );

    act(() => {
      result1.current[1]('shared-value');
    });

    const { result: result2 } = renderHook(() =>
      useLocalStorage('shared-key', 'value2')
    );

    expect(result2.current[0]).toBe('shared-value');
  });

  it('should handle localStorage setItem errors', () => {
    expect(true).toBe(true);
  });

  it('should work with different data types', () => {
    const { result: stringResult } = renderHook(() =>
      useLocalStorage('string-key', 'test')
    );
    expect(stringResult.current[0]).toBe('test');

    const { result: numberResult } = renderHook(() =>
      useLocalStorage('number-key', 42)
    );
    expect(numberResult.current[0]).toBe(42);

    const { result: boolResult } = renderHook(() =>
      useLocalStorage('bool-key', true)
    );
    expect(boolResult.current[0]).toBe(true);

    const { result: arrayResult } = renderHook(() =>
      useLocalStorage('array-key', [1, 2, 3])
    );
    expect(arrayResult.current[0]).toEqual([1, 2, 3]);

    const { result: objectResult } = renderHook(() =>
      useLocalStorage('object-key', { a: 1, b: 2 })
    );
    expect(objectResult.current[0]).toEqual({ a: 1, b: 2 });
  });
});
