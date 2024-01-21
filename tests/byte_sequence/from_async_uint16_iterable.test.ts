import { assertRejects, assertStrictEquals } from "../deps.ts";
import { ByteOrder, ByteSequence, Platform } from "../../mod.ts";

Deno.test("ByteSequence.fromAsyncUint16Iterable(AsyncGenerator<number>, ByteOrder.BIG_ENDIAN)", async () => {
  const a0 = (async function* () {
    yield 9;
    yield 8;
    yield 7;
    yield 6;
    yield 5;
    yield 4;
    yield 3;
    yield 2;
    yield 65535;
    yield 255;
  })();
  const bs0 = await ByteSequence.fromAsyncUint16Iterable(
    a0,
    ByteOrder.BIG_ENDIAN,
  );

  assertStrictEquals(bs0.byteLength, 20);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[16], 255);
  assertStrictEquals(bs0a[17], 255);
  assertStrictEquals(bs0a[18], 0);
  assertStrictEquals(bs0a[19], 255);

  const a1 = (async function* () {
  })();
  const bs1 = await ByteSequence.fromAsyncUint16Iterable(
    a1,
    ByteOrder.BIG_ENDIAN,
  );

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromAsyncUint16Iterable(AsyncGenerator<number>, ByteOrder.LITTLE_ENDIAN)", async () => {
  const a0 = (async function* () {
    yield 9;
    yield 8;
    yield 7;
    yield 6;
    yield 5;
    yield 4;
    yield 3;
    yield 2;
    yield 65535;
    yield 255;
  })();
  const bs0 = await ByteSequence.fromAsyncUint16Iterable(
    a0,
    ByteOrder.LITTLE_ENDIAN,
  );

  assertStrictEquals(bs0.byteLength, 20);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[16], 255);
  assertStrictEquals(bs0a[17], 255);
  assertStrictEquals(bs0a[18], 255);
  assertStrictEquals(bs0a[19], 0);

  const a1 = (async function* () {
  })();
  const bs1 = await ByteSequence.fromAsyncUint16Iterable(
    a1,
    ByteOrder.LITTLE_ENDIAN,
  );

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromAsyncUint16Iterable(AsyncGenerator<number>, auto)", async () => {
  const a0 = (async function* () {
    yield 9;
    yield 8;
    yield 7;
    yield 6;
    yield 5;
    yield 4;
    yield 3;
    yield 2;
    yield 65535;
    yield 255;
  })();
  const bs0 = await ByteSequence.fromAsyncUint16Iterable(a0);

  assertStrictEquals(bs0.byteLength, 20);
  const bs0a = bs0.getView(Uint8Array);
  if (Platform.BYTE_ORDER === ByteOrder.BIG_ENDIAN) {
    assertStrictEquals(bs0a[16], 255);
    assertStrictEquals(bs0a[17], 255);
    assertStrictEquals(bs0a[18], 0);
    assertStrictEquals(bs0a[19], 255);
  } else {
    assertStrictEquals(bs0a[16], 255);
    assertStrictEquals(bs0a[17], 255);
    assertStrictEquals(bs0a[18], 255);
    assertStrictEquals(bs0a[19], 0);
  }

  const a1 = (async function* () {
  })();
  const bs1 = await ByteSequence.fromAsyncUint16Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromAsyncUint16Iterable(any, auto)", () => {
  assertRejects(
    async () => {
      await ByteSequence.fromAsyncUint16Iterable(
        undefined as unknown as AsyncIterable<number>,
      );
    },
    TypeError,
    "source",
  );

  assertRejects(
    async () => {
      await ByteSequence.fromAsyncUint16Iterable(
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
      await ByteSequence.fromAsyncUint16Iterable(
        a1 as unknown as AsyncIterable<number>,
      );
    },
    RangeError,
    "source[*]",
  );
});
