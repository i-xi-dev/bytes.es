import {
  assertStrictEquals,
  assertThrows,
} from "../deps.ts";
import { ByteSequence } from "../../mod.ts";

Deno.test("ByteSequence.fromUint8Iterable(Array<number>)", () => {
  const a0 = [9, 8, 7, 6, 5, 4, 3, 2, 0, 255];
  const bs0 = ByteSequence.fromUint8Iterable(a0);

  assertStrictEquals(bs0.byteLength, 10);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[8], 0);
  assertStrictEquals(bs0a[9], 255);

  const a1: number[] = [];
  const bs1 = ByteSequence.fromUint8Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint8Iterable(Uint8Array)", () => {
  const a0 = Uint8Array.of(9, 8, 7, 6, 5, 4, 3, 2, 0, 255);
  const bs0 = ByteSequence.fromUint8Iterable(a0);

  assertStrictEquals(bs0.byteLength, 10);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[8], 0);
  assertStrictEquals(bs0a[9], 255);

  const a1 = Uint8Array.of();
  const bs1 = ByteSequence.fromUint8Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint8Iterable(Uint8ClampedArray)", () => {
  const a0 = Uint8ClampedArray.of(9, 8, 7, 6, 5, 4, 3, 2, 0, 255);
  const bs0 = ByteSequence.fromUint8Iterable(a0);

  assertStrictEquals(bs0.byteLength, 10);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[8], 0);
  assertStrictEquals(bs0a[9], 255);

  const a1 = Uint8ClampedArray.of();
  const bs1 = ByteSequence.fromUint8Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint8Iterable(Generator<number>)", () => {
  const a0 = (function* () {
    yield 9;
    yield 8;
    yield 7;
    yield 6;
    yield 5;
    yield 4;
    yield 3;
    yield 2;
    yield 0;
    yield 255;
  })();
  const bs0 = ByteSequence.fromUint8Iterable(a0);

  assertStrictEquals(bs0.byteLength, 10);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[8], 0);
  assertStrictEquals(bs0a[9], 255);

  const a1 = Uint8ClampedArray.of();
  const bs1 = ByteSequence.fromUint8Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint8Iterable(any)", () => {
  assertThrows(
    () => {
      ByteSequence.fromUint8Iterable(undefined as unknown as number[]);
    },
    TypeError,
    "source",
  );

  assertThrows(
    () => {
      ByteSequence.fromUint8Iterable(1 as unknown as number[]);
    },
    TypeError,
    "source",
  );

  assertThrows(
    () => {
      ByteSequence.fromUint8Iterable(["a"] as unknown as number[]);
    },
    RangeError,
    "source[*]",
  );
});
