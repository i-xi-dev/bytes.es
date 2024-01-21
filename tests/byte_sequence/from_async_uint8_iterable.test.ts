import { assertRejects, assertStrictEquals } from "../deps.ts";
import { ByteSequence } from "../../mod.ts";

Deno.test("ByteSequence.fromAsyncUint8Iterable(AsyncGenerator<number>)", async () => {
  const a0 = (async function* () {
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
  const bs0 = await ByteSequence.fromAsyncUint8Iterable(a0);

  assertStrictEquals(bs0.byteLength, 10);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[8], 0);
  assertStrictEquals(bs0a[9], 255);

  const a1 = (async function* () {
  })();
  const bs1 = await ByteSequence.fromAsyncUint8Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromAsyncUint8Iterable(any)", () => {
  assertRejects(
    async () => {
      await ByteSequence.fromAsyncUint8Iterable(
        undefined as unknown as AsyncIterable<number>,
      );
    },
    TypeError,
    "source",
  );

  assertRejects(
    async () => {
      await ByteSequence.fromAsyncUint8Iterable(
        1 as unknown as AsyncIterable<number>,
      );
    },
    TypeError,
    "source",
  );

  const a1 = (async function* () {
    yield "a";
  })();
  assertRejects(
    async () => {
      await ByteSequence.fromAsyncUint8Iterable(
        a1 as unknown as AsyncIterable<number>,
      );
    },
    RangeError,
    "source[*]",
  );
});
