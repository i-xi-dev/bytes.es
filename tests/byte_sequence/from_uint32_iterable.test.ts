import { assertStrictEquals, assertThrows, Platform } from "../deps.ts";
import { ByteOrder, ByteSequence } from "../../mod.ts";

Deno.test("ByteSequence.fromUint32Iterable(Array<number>, ByteOrder.BIG_ENDIAN)", () => {
  const a0 = [9, 8, 7, 6, 5, 4, 3, 2, 253, 254, 0xFFFFFFFF, 255];
  const bs0 = ByteSequence.fromUint32Iterable(a0, ByteOrder.BIG_ENDIAN);

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

  const a1: number[] = [];
  const bs1 = ByteSequence.fromUint32Iterable(a1, ByteOrder.BIG_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint32Iterable(Array<number>, ByteOrder.LITTLE_ENDIAN)", () => {
  const a0 = [9, 8, 7, 6, 5, 4, 3, 2, 253, 254, 0xFFFFFFFF, 255];
  const bs0 = ByteSequence.fromUint32Iterable(a0, ByteOrder.LITTLE_ENDIAN);

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

  const a1: number[] = [];
  const bs1 = ByteSequence.fromUint32Iterable(a1, ByteOrder.LITTLE_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint32Iterable(Array<number>, auto)", () => {
  const a0 = [9, 8, 7, 6, 5, 4, 3, 2, 253, 254, 0xFFFFFFFF, 255];
  const bs0 = ByteSequence.fromUint32Iterable(a0);

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
  const a1: number[] = [];
  const bs1 = ByteSequence.fromUint32Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint32Iterable(Uint32Array, ByteOrder.BIG_ENDIAN)", () => {
  const a0 = Uint32Array.of(9, 8, 7, 6, 5, 4, 3, 2, 253, 254, 0xFFFFFFFF, 255);
  const bs0 = ByteSequence.fromUint32Iterable(a0, ByteOrder.BIG_ENDIAN);

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

  const a1 = Uint32Array.of();
  const bs1 = ByteSequence.fromUint32Iterable(a1, ByteOrder.BIG_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint32Iterable(Uint32Array, ByteOrder.LITTLE_ENDIAN)", () => {
  const a0 = Uint32Array.of(9, 8, 7, 6, 5, 4, 3, 2, 253, 254, 0xFFFFFFFF, 255);
  const bs0 = ByteSequence.fromUint32Iterable(a0, ByteOrder.LITTLE_ENDIAN);

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

  const a1 = Uint32Array.of();
  const bs1 = ByteSequence.fromUint32Iterable(a1, ByteOrder.LITTLE_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint32Iterable(Uint32Array, auto)", () => {
  const a0 = Uint32Array.of(9, 8, 7, 6, 5, 4, 3, 2, 253, 254, 0xFFFFFFFF, 255);
  const bs0 = ByteSequence.fromUint32Iterable(a0);

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

  const a1 = Uint32Array.of();
  const bs1 = ByteSequence.fromUint32Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint32Iterable(Generator<number>, ByteOrder.BIG_ENDIAN)", () => {
  const a0 = (function* () {
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

  const bs0 = ByteSequence.fromUint32Iterable(a0, ByteOrder.BIG_ENDIAN);

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

  const a1 = (function* () {
  })();
  const bs1 = ByteSequence.fromUint32Iterable(a1, ByteOrder.BIG_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint32Iterable(Generator<number>, ByteOrder.LITTLE_ENDIAN)", () => {
  const a0 = (function* () {
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
  const bs0 = ByteSequence.fromUint32Iterable(a0, ByteOrder.LITTLE_ENDIAN);

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

  const a1 = (function* () {
  })();
  const bs1 = ByteSequence.fromUint32Iterable(a1, ByteOrder.LITTLE_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint32Iterable(Generator<number>, auto)", () => {
  const a0 = (function* () {
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
  const bs0 = ByteSequence.fromUint32Iterable(a0);

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

  const a1 = (function* () {
  })();
  const bs1 = ByteSequence.fromUint32Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint32Iterable(any, auto)", () => {
  assertThrows(
    () => {
      ByteSequence.fromUint32Iterable(undefined as unknown as number[]);
    },
    TypeError,
    "source",
  );

  assertThrows(
    () => {
      ByteSequence.fromUint32Iterable(1 as unknown as number[]);
    },
    TypeError,
    "source",
  );

  assertThrows(
    () => {
      ByteSequence.fromUint32Iterable(["a"] as unknown as number[]);
    },
    RangeError,
    "source[*]",
  );
});
