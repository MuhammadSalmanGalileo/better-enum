# better-enum

This library used to handle enum with payload that inspired by enum in rust;

# Installation

```
npm install @salmangalileo/better-enum
```

# Usage

to use this library you need to create the enum

```typescript
import { betterEnumFactory, InferEnum, CompleteBetterEnum } from "better-enum"
const FirstEnum = betterEnumFactory<[
  {
    key: '1';
    data: {
      a: string;
    }
  },
  {
    key: '2';
    data: {
      b: string;
    }
  },
  {
    key: 1;
    data: {
      a: number;
    }
  },
  {
    key: 2;
    data: {
      b: number;
    }
  },
]>();
type FirstEnumType = InferEnum<typeof FirstEnum>;
```

enum created with state `"1" | "2" | 1 | 2` with payload `{ a: string } | { b: string } | { a: number } | { b: number }` and to use the enum you can create the value like this

```typescript
const result = FirstEnum("1", { a: "one" });
```

without type on the variable it still remember the state that used and can only be checked with `"1"` as possible state. to make it general it need the type that infered from `FirstEnum` with `InferEnum<typeof FirstEnum>` to be like this.

```typescript
const result: FirstEnumType = FirstEnum("1", { a: "one" });
```

to handle the enum, you can use `case` method on result

```typescript
result
  .case('1', ({data}) => {
    aString = data.a;
  })
  ?.case('2', ({data}) => {
    bString = data.b;
  })
  ?.case(1, ({data}) => {
    aNumber = data.a;
  })
  ?.case(2, ({data}) => {
    bNumber = data.b;
  }) satisfies CompleteBetterEnum;
```

this will handle the result for all possible state. it suggested to use utility type `CompleteBetterEnum` to make sure all case has been handled. if you want to handle only some case and handle default for the rest you can use undefined key.

```typescript
result
  .case('2', () => {
    a = 'K2';
  })
  ?.case(undefined, ({key}) => {
    switch (key) {
      case '1':
        a = 'K1';
        break;
      default:
        expect(key).toBe('1');
    }
  }) satisfies CompleteBetterEnum;
```

or if you did not need the payload, you can use logical and

```
result
  .case('2', () => {
    a = 'K2';
  }) && (a = 'TheRest')
```

it can be done because `case` can return `BetterEnum<>` instance or undefined. it will return undefined if state in case match.
