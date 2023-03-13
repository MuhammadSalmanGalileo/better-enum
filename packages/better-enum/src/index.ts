type CombineTupleType<T extends Array<{ state: any }>> = T extends Array<
infer S
>
  ? S
  : never;

type ExtractStateType<T> = T extends { state: infer S } ? S : never;

type SelectState<CTT, ST extends ExtractStateType<CTT>> = CTT extends {
  state: ST;
}
  ? CTT
  : never;

type ExcludeState<CTT, ST extends ExtractStateType<CTT>> = CTT extends {
  state: ST;
}
  ? never
  : CTT;

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

export class BetterEnum<T extends { state: any }> {
  constructor(public state: T) {}

  case<CT extends ExtractStateType<T>>(
    key: CT,
    callback: (payload: Omit<SelectState<T, CT>, 'state'>, key: CT) => void
  ): BetterEnum<ExcludeState<T, CT>> | undefined;
  case(
    key: undefined,
    callback: (payload: Omit<T, 'state'>, key: ExtractStateType<T>) => void
  ): undefined;
  case<CT extends ExtractStateType<T>>(
    key: CT | undefined,
    callback: (
      payload: Omit<SelectState<T, CT>, 'state'>,
      key: CT | undefined
    ) => void,
  ): BetterEnum<ExcludeState<T, CT>> | undefined {
    if (key === undefined || this.state.state === key) {
      const { state: _state, ...payload } = this.state as SelectState<T, CT>;
      callback(payload, this.state.state as CT);
      return undefined;
    }
    return new BetterEnum<ExcludeState<T, CT>>(
      this.state as ExcludeState<T, CT>,
    );
  }
}

const dummyEnum = new BetterEnum<{ state: '1'; a: number }>({
  state: '1',
  a: 12,
}).case('1', (a, b) => {
  return `${a.a}${b}`;
});

export type CompleteBetterEnum = typeof dummyEnum;

export function betterEnumFactory<T extends Array<{ state: any }>>() {
  function call<
    MK extends ExtractStateType<CombineTupleType<T>>,
    MT extends SelectState<CombineTupleType<T>, MK>,
  >(state: MK, payload: Expand<Omit<MT, 'state'>>) {
    return new BetterEnum<MT>({ state, ...payload } as MT);
  }
  call.type = undefined as CombineTupleType<T> | undefined;
  return call;
}

export type InferEnum<T extends ReturnType<typeof betterEnumFactory>> =
  BetterEnum<NonNullable<T['type']>>;
