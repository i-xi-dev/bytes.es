import { assertStrictEquals, assertThrows, Platform } from "../deps.ts";
import { ByteOrder, ByteSequence } from "../../mod.ts";

Deno.test("ByteSequence.fromBigUint64Iterable(Array<bigint>, ByteOrder.BIG_ENDIAN)", () => {
  const a0 = [ 253n, 254n, 0xFFFFFFFF_FFFFFFFFn, 255n];
  const bs0 = ByteSequence.fromBigUint64Iterable(a0, ByteOrder.BIG_ENDIAN);

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

  const a1: bigint[] = [];
  const bs1 = ByteSequence.fromBigUint64Iterable(a1, ByteOrder.BIG_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromBigUint64Iterable(Array<bigint>, ByteOrder.LITTLE_ENDIAN)", () => {
  const a0 = [ 253n, 254n, 0xFFFFFFFF_FFFFFFFFn, 255n];
  const bs0 = ByteSequence.fromBigUint64Iterable(a0, ByteOrder.LITTLE_ENDIAN);

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

  const a1: bigint[] = [];
  const bs1 = ByteSequence.fromBigUint64Iterable(a1, ByteOrder.LITTLE_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromBigUint64Iterable(Array<bigint>, auto)", () => {
  const a0 = [ 253n, 254n, 0xFFFFFFFF_FFFFFFFFn, 255n];
  const bs0 = ByteSequence.fromBigUint64Iterable(a0);

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
  const a1: bigint[] = [];
  const bs1 = ByteSequence.fromBigUint64Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromBigUint64Iterable(BigUint64Array, ByteOrder.BIG_ENDIAN)", () => {
  const a0 =BigUint64Array.of(  253n, 254n, 0xFFFFFFFF_FFFFFFFFn, 255n);
  const bs0 = ByteSequence.fromBigUint64Iterable(a0, ByteOrder.BIG_ENDIAN);

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

  const a1 = BigUint64Array.of();
  const bs1 = ByteSequence.fromBigUint64Iterable(a1, ByteOrder.BIG_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromBigUint64Iterable(BigUint64Array, ByteOrder.LITTLE_ENDIAN)", () => {
  const a0 = BigUint64Array.of( 253n, 254n, 0xFFFFFFFF_FFFFFFFFn, 255n);
  const bs0 = ByteSequence.fromBigUint64Iterable(a0, ByteOrder.LITTLE_ENDIAN);

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

  const a1 = BigUint64Array.of();
  const bs1 = ByteSequence.fromBigUint64Iterable(a1, ByteOrder.LITTLE_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromBigUint64Iterable(BigUint64Array, auto)", () => {
  const a0 = [ 253n, 254n, 0xFFFFFFFF_FFFFFFFFn, 255n];
  const bs0 = ByteSequence.fromBigUint64Iterable(a0);

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
  const a1= BigUint64Array.of();
  const bs1 = ByteSequence.fromBigUint64Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromBigUint64Iterable(Generator<bigint>, ByteOrder.BIG_ENDIAN)", () => {
  const a0 = (function* () {
    yield 253n;
    yield 254n;
    yield 0xFFFFFFFF_FFFFFFFFn;
    yield 255n;
  })();

  const bs0 = ByteSequence.fromBigUint64Iterable(a0, ByteOrder.BIG_ENDIAN);

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

  const a1 = (function* () {
  })();
  const bs1 = ByteSequence.fromBigUint64Iterable(a1, ByteOrder.BIG_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromBigUint64Iterable(Generator<bigint>, ByteOrder.LITTLE_ENDIAN)", () => {
  const a0 = (function* () {
    yield 253n;
    yield 254n;
    yield 0xFFFFFFFF_FFFFFFFFn;
    yield 255n;
  })();
  const bs0 = ByteSequence.fromBigUint64Iterable(a0, ByteOrder.LITTLE_ENDIAN);

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

  const a1 = (function* () {
  })();
  const bs1 = ByteSequence.fromBigUint64Iterable(a1, ByteOrder.LITTLE_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromBigUint64Iterable(Generator<bigint>, auto)", () => {
  const a0 = (function* () {
    yield 253n;
    yield 254n;
    yield 0xFFFFFFFF_FFFFFFFFn;
    yield 255n;
  })();
  const bs0 = ByteSequence.fromBigUint64Iterable(a0);

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

  const a1 = (function* () {
  })();
  const bs1 = ByteSequence.fromBigUint64Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromBigUint64Iterable(any, auto)", () => {
  assertThrows(
    () => {
      ByteSequence.fromBigUint64Iterable(undefined as unknown as bigint[]);
    },
    TypeError,
    "source",
  );

  assertThrows(
    () => {
      ByteSequence.fromBigUint64Iterable(1 as unknown as bigint[]);
    },
    TypeError,
    "source",
  );

  assertThrows(
    () => {
      ByteSequence.fromBigUint64Iterable(["a"] as unknown as bigint[]);
    },
    RangeError,
    "source[*]",
  );
});
