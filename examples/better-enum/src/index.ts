import {
  betterEnumFactory,
  CompleteBetterEnum,
  InferEnum,
} from "@salmangalileo/better-enum";

const firstEnum = betterEnumFactory<
  [
    {
      state: "1";
      a: string;
      b: number;
    },
    {
      state: "2";
      c: string;
      d: number;
    },
    {
      state: "3";
      a: string;
      c: number;
    },
    {
      state: "4";
      b: string;
      d: number;
    }
  ]
>();

type FirstEnum = InferEnum<typeof firstEnum>;

const testFirstEnum: FirstEnum = firstEnum("1", {
  a: "string",
  b: 12,
});

// @ts-ignore
const result =
  (testFirstEnum
    .case("1", (payload) => {
      console.log(payload);
    })
    ?.case("2", (payload) => {
      console.log(payload);
    })
    ?.case("3", (payload) => {
      console.log(payload);
    })
    ?.case("4", (payload) => {
      console.log(payload);
    }) satisfies CompleteBetterEnum) ?? true;

// @ts-ignore
const result2 =
  (testFirstEnum
    .case("1", (payload) => {
      console.log(payload);
    })
    ?.case("2", (payload) => {
      console.log(payload);
    })
    ?.case(undefined, (payload) => {
      console.log(payload);
    }) satisfies CompleteBetterEnum) ?? true;

switch (testFirstEnum.state.state) {
  case "1":
    console.log(testFirstEnum.state.a, testFirstEnum.state.b);
    break;
  case "2":
    console.log(testFirstEnum.state.c, testFirstEnum.state.d);
    break;
  default:
    console.log(testFirstEnum);
}
