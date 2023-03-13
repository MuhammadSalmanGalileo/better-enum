import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { betterEnumFactory } from '../src/index';

import type { InferEnum, CompleteBetterEnum } from '../src/index';

afterEach(() => {
  jest.clearAllMocks();
});

describe('Better Enum', () => {
  it('should run correct case for every state', () => {
    const TestEnum = betterEnumFactory<
    [
      {
        state: '1';
        a: string;
      },
      {
        state: '2';
        b: string;
      },
      {
        state: 1;
        a: number;
      },
      {
        state: 2;
        b: number;
      },
    ]
    >();
    type TestEnumType = InferEnum<typeof TestEnum>;
    const results = [] as TestEnumType[];
    results.push(TestEnum('1', { a: 'Satu' }));
    results.push(TestEnum('2', { b: 'Dua' }));
    results.push(TestEnum(1, { a: 1 }));
    results.push(TestEnum(2, { b: 2 }));
    let aString = '';
    let bString = '';
    let aNumber = 0;
    let bNumber = 0;
    for (const result of results) {
      result
        .case('1', (p) => {
          aString = p.a;
        })
        ?.case('2', (p) => {
          bString = p.b;
        })
        ?.case(1, (p) => {
          aNumber = p.a;
        })
        ?.case(2, (p) => {
          bNumber = p.b;
        }) satisfies CompleteBetterEnum;
    }
    expect(aString).toBe('Satu');
    expect(bString).toBe('Dua');
    expect(aNumber).toBe(1);
    expect(bNumber).toBe(2);
  });

  it('should capture the rest if key undefined', () => {
    const TestEnum = betterEnumFactory<
    [
      {
        state: '1';
        a: string;
      },
      {
        state: '2';
        b: string;
      },
      {
        state: 1;
        a: number;
      },
      {
        state: 2;
        b: number;
      },
    ]
    >();
    type TestEnumType = InferEnum<typeof TestEnum>;
    const result: TestEnumType = TestEnum('1', { a: 'test' });
    let a = '';
    result
      .case('2', () => {
        a = 'K2';
      })
      ?.case(undefined, (_, k) => {
        switch (k) {
          case '1':
            a = 'K1';
            break;
          default:
            expect(k).toBe('1');
        }
      });
    expect(a).toBe('K1');
  });

  it('should return instance of BetterEnum if not captured', () => {
    const TestEnum = betterEnumFactory<
    [
      {
        state: '1';
        a: string;
      },
      {
        state: '2';
        b: string;
      },
      {
        state: 1;
        a: number;
      },
      {
        state: 2;
        b: number;
      },
    ]
    >();
    type TestEnumType = InferEnum<typeof TestEnum>;
    const result: TestEnumType = TestEnum('1', { a: 'test' });
    let a = '';
    result.case('2', console.log) && (a = 'TheRest');
    expect(a).toBe('TheRest');
  });
});
