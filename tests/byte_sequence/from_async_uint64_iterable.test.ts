import { assertRejects, assertStrictEquals, Platform } from "../deps.ts";
import { ByteOrder, ByteSequence } from "../../mod.ts";

Deno.test("ByteSequence.fromAsyncBigUint64Iterable(AsyncGenerator<bigint>, ByteOrder.BIG_ENDIAN)", async () => {
  const a0 = (async function* () {
    yield 253n;
    yield 254n;
    yield 0xFFFFFFFF_FFFFFFFFn;
    yield 255n;
  })();
  const bs0 = await ByteSequence.fromAsyncBigUint64Iterable(
    a0,
    ByteOrder.BIG_ENDIAN,
  );

  assertStrictEquals(bs0.byteLength, 32);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[16], 255);
  assertStrictEquals(bs0a[17], 255);
  assertStrictEquals(bs0a[18], 255);
  assertStrictEquals(bs0a[19], 255);
  assertStrictEquals(bs0a[20], 255);
  assertStrictEquals(bs0a[21], 255);
  assertStrictEquals(bs0a[22], 255);
  assertStrictEquals(bs0a[23], 255);
  assertStrictEquals(bs0a[24], 0);
  assertStrictEquals(bs0a[25], 0);
  assertStrictEquals(bs0a[26], 0);
  assertStrictEquals(bs0a[27], 0);
  assertStrictEquals(bs0a[28], 0);
  assertStrictEquals(bs0a[29], 0);
  assertStrictEquals(bs0a[30], 0);
  assertStrictEquals(bs0a[31], 255);

  const a1 = (async function* () {
  })();
  const bs1 = await ByteSequence.fromAsyncBigUint64Iterable(
    a1,
    ByteOrder.BIG_ENDIAN,
  );

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromAsyncBigUint64Iterable(AsyncGenerator<bigint>, ByteOrder.LITTLE_ENDIAN)", async () => {
  const a0 = (async function* () {
    yield 253n;
    yield 254n;
    yield 0xFFFFFFFF_FFFFFFFFn;
    yield 255n;
  })();
  const bs0 = await ByteSequence.fromAsyncBigUint64Iterable(
    a0,
    ByteOrder.LITTLE_ENDIAN,
  );

  assertStrictEquals(bs0.byteLength, 32);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[16], 255);
  assertStrictEquals(bs0a[17], 255);
  assertStrictEquals(bs0a[18], 255);
  assertStrictEquals(bs0a[19], 255);
  assertStrictEquals(bs0a[20], 255);
  assertStrictEquals(bs0a[21], 255);
  assertStrictEquals(bs0a[22], 255);
  assertStrictEquals(bs0a[23], 255);
  assertStrictEquals(bs0a[24], 255);
  assertStrictEquals(bs0a[25], 0);
  assertStrictEquals(bs0a[26], 0);
  assertStrictEquals(bs0a[27], 0);
  assertStrictEquals(bs0a[28], 0);
  assertStrictEquals(bs0a[29], 0);
  assertStrictEquals(bs0a[30], 0);
  assertStrictEquals(bs0a[31], 0);

  const a1 = (async function* () {
  })();
  const bs1 = await ByteSequence.fromAsyncBigUint64Iterable(
    a1,
    ByteOrder.LITTLE_ENDIAN,
  );

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromAsyncBigUint64Iterable(AsyncGenerator<bigint>, auto)", async () => {
  const a0 = (async function* () {
    yield 253n;
    yield 254n;
    yield 0xFFFFFFFF_FFFFFFFFn;
    yield 255n;
  })();
  const bs0 = await ByteSequence.fromAsyncBigUint64Iterable(a0);

  assertStrictEquals(bs0.byteLength, 32);
  const bs0a = bs0.getView(Uint8Array);
  if (Platform.BYTE_ORDER === ByteOrder.BIG_ENDIAN) {
    assertStrictEquals(bs0a[16], 255);
    assertStrictEquals(bs0a[17], 255);
    assertStrictEquals(bs0a[18], 255);
    assertStrictEquals(bs0a[19], 255);
    assertStrictEquals(bs0a[20], 255);
    assertStrictEquals(bs0a[21], 255);
    assertStrictEquals(bs0a[22], 255);
    assertStrictEquals(bs0a[23], 255);
    assertStrictEquals(bs0a[24], 0);
    assertStrictEquals(bs0a[25], 0);
    assertStrictEquals(bs0a[26], 0);
    assertStrictEquals(bs0a[27], 0);
    assertStrictEquals(bs0a[28], 0);
    assertStrictEquals(bs0a[29], 0);
    assertStrictEquals(bs0a[30], 0);
    assertStrictEquals(bs0a[31], 255);
  } else {
    assertStrictEquals(bs0a[16], 255);
    assertStrictEquals(bs0a[17], 255);
    assertStrictEquals(bs0a[18], 255);
    assertStrictEquals(bs0a[19], 255);
    assertStrictEquals(bs0a[20], 255);
    assertStrictEquals(bs0a[21], 255);
    assertStrictEquals(bs0a[22], 255);
    assertStrictEquals(bs0a[23], 255);
    assertStrictEquals(bs0a[24], 255);
    assertStrictEquals(bs0a[25], 0);
    assertStrictEquals(bs0a[26], 0);
    assertStrictEquals(bs0a[27], 0);
    assertStrictEquals(bs0a[28], 0);
    assertStrictEquals(bs0a[29], 0);
    assertStrictEquals(bs0a[30], 0);
    assertStrictEquals(bs0a[31], 0);
  }

  const a1 = (async function* () {
  })();
  const bs1 = await ByteSequence.fromAsyncBigUint64Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromAsyncBigUint64Iterable(any, auto)", () => {
  assertRejects(
    async () => {
      await ByteSequence.fromAsyncBigUint64Iterable(
        undefined as unknown as AsyncIterable<bigint>,
      );
    },
    TypeError,
    "source",
  );

  assertRejects(
    async () => {
      await ByteSequence.fromAsyncBigUint64Iterable(
        1 as unknown as AsyncIterable<bigint>,
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
      await ByteSequence.fromAsyncBigUint64Iterable(
        a1 as unknown as AsyncIterable<bigint>,
      );
    },
    RangeError,
    "source[*]",
  );
});
