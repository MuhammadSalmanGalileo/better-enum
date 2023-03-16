type CombineTupleType<T extends Array<{ key: any; data: any }>> =
  T extends Array<infer S> ? S : never;

type ExtractStateType<T> = T extends { key: infer S } ? S : never;

type SelectState<CTT, ST extends ExtractStateType<CTT>> = CTT extends {
  key: ST;
}
  ? CTT
  : never;

type ExcludeState<CTT, ST extends ExtractStateType<CTT>> = CTT extends {
  key: ST;
}
  ? never
  : CTT;

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export type InferEnum<T extends ReturnType<typeof betterEnumFactory>> =
  NonNullable<T['type']>;

type ExtractDataType<T> = T extends { data: infer P } ? P : never;

export class BetterEnum<T extends { key: any; data: any }> {
  constructor(public state: T) {}

  case(key: undefined, callback: (state: T) => void): undefined;
  case<CT extends ExtractStateType<T>>(
    key: CT,
    callback: (state: SelectState<T, CT>) => void
  ): BetterEnum<ExcludeState<T, CT>> | undefined;
  case<CT extends ExtractStateType<T>>(
    key: CT | undefined,
    callback: (state: SelectState<T, CT>) => void,
  ): BetterEnum<ExcludeState<T, CT>> | undefined {
    if (key === undefined || this.state.key === key) {
      callback(this.state as SelectState<T, CT>);
      return undefined;
    }
    return new BetterEnum(this.state as ExcludeState<T, CT>);
  }
}

export function betterEnumFactory<T extends Array<{ key: any; data: any }>>() {
  function call<
    MT extends CombineTupleType<T>,
    MK extends ExtractStateType<MT>,
  >(key: MK, data: Expand<ExtractDataType<SelectState<MT, MK>>>) {
    return new BetterEnum({ key, data } as MT);
  }
  call.type = undefined as BetterEnum<CombineTupleType<T>> | undefined;
  return call;
}

const dummyEnum = new BetterEnum<{ key: '1'; data: { a: number } }>({
  key: '1',
  data: { a: 12 },
}).case('1', (a) => {
  return `${a.data.a}${a.key}`;
});

export type CompleteBetterEnum = typeof dummyEnum;
