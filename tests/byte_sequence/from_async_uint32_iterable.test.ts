import { assertRejects, assertStrictEquals, Platform } from "../deps.ts";
import { ByteOrder, ByteSequence } from "../../mod.ts";

Deno.test("ByteSequence.fromAsyncUint32Iterable(AsyncGenerator<number>, ByteOrder.BIG_ENDIAN)", async () => {
  const a0 = (async function* () {
    yield 9;
    yield 8;
    yield 7;
    yield 6;
    yield 5;
    yield 4;
    yield 3;
    yield 2;
    yield 253;
    yield 254;
    yield 0xFFFFFFFF;
    yield 255;
  })();
  const bs0 = await ByteSequence.fromAsyncUint32Iterable(
    a0,
    ByteOrder.BIG_ENDIAN,
  );

  assertStrictEquals(bs0.byteLength, 48);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[40], 255);
  assertStrictEquals(bs0a[41], 255);
  assertStrictEquals(bs0a[42], 255);
  assertStrictEquals(bs0a[43], 255);
  assertStrictEquals(bs0a[44], 0);
  assertStrictEquals(bs0a[45], 0);
  assertStrictEquals(bs0a[46], 0);
  assertStrictEquals(bs0a[47], 255);

  const a1 = (async function* () {
  })();
  const bs1 = await ByteSequence.fromAsyncUint32Iterable(
    a1,
    ByteOrder.BIG_ENDIAN,
  );

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromAsyncUint32Iterable(AsyncGenerator<number>, ByteOrder.LITTLE_ENDIAN)", async () => {
  const a0 = (async function* () {
    yield 9;
    yield 8;
    yield 7;
    yield 6;
    yield 5;
    yield 4;
    yield 3;
    yield 2;
    yield 253;
    yield 254;
    yield 0xFFFFFFFF;
    yield 255;
  })();
  const bs0 = await ByteSequence.fromAsyncUint32Iterable(
    a0,
    ByteOrder.LITTLE_ENDIAN,
  );

  assertStrictEquals(bs0.byteLength, 48);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[40], 255);
  assertStrictEquals(bs0a[41], 255);
  assertStrictEquals(bs0a[42], 255);
  assertStrictEquals(bs0a[43], 255);
  assertStrictEquals(bs0a[44], 255);
  assertStrictEquals(bs0a[45], 0);
  assertStrictEquals(bs0a[46], 0);
  assertStrictEquals(bs0a[47], 0);

  const a1 = (async function* () {
  })();
  const bs1 = await ByteSequence.fromAsyncUint32Iterable(
    a1,
    ByteOrder.LITTLE_ENDIAN,
  );

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromAsyncUint32Iterable(AsyncGenerator<number>, auto)", async () => {
  const a0 = (async function* () {
    yield 9;
    yield 8;
    yield 7;
    yield 6;
    yield 5;
    yield 4;
    yield 3;
    yield 2;
    yield 253;
    yield 254;
    yield 0xFFFFFFFF;
    yield 255;
  })();
  const bs0 = await ByteSequence.fromAsyncUint32Iterable(a0);

  assertStrictEquals(bs0.byteLength, 48);
  const bs0a = bs0.getView(Uint8Array);
  if (Platform.BYTE_ORDER === ByteOrder.BIG_ENDIAN) {
    assertStrictEquals(bs0a[40], 255);
    assertStrictEquals(bs0a[41], 255);
    assertStrictEquals(bs0a[42], 255);
    assertStrictEquals(bs0a[43], 255);
    assertStrictEquals(bs0a[44], 0);
    assertStrictEquals(bs0a[45], 0);
    assertStrictEquals(bs0a[46], 0);
    assertStrictEquals(bs0a[47], 255);
  } else {
    assertStrictEquals(bs0a[40], 255);
    assertStrictEquals(bs0a[41], 255);
    assertStrictEquals(bs0a[42], 255);
    assertStrictEquals(bs0a[43], 255);
    assertStrictEquals(bs0a[44], 255);
    assertStrictEquals(bs0a[45], 0);
    assertStrictEquals(bs0a[46], 0);
    assertStrictEquals(bs0a[47], 0);
  }

  const a1 = (async function* () {
  })();
  const bs1 = await ByteSequence.fromAsyncUint32Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromAsyncUint32Iterable(any, auto)", () => {
  assertRejects(
    async () => {
      await ByteSequence.fromAsyncUint32Iterable(
        undefined as unknown as AsyncIterable<number>,
      );
    },
    TypeError,
    "source",
  );

  assertRejects(
    async () => {
      await ByteSequence.fromAsyncUint32Iterable(
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
      await ByteSequence.fromAsyncUint32Iterable(
        a1 as unknown as AsyncIterable<number>,
      );
    },
    RangeError,
    "source[*]",
  );
});
