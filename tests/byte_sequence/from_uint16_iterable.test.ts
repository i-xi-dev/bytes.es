import { assertStrictEquals, assertThrows, Platform } from "../deps.ts";
import { ByteOrder, ByteSequence } from "../../mod.ts";

Deno.test("ByteSequence.fromUint16Iterable(Array<number>, ByteOrder.BIG_ENDIAN)", () => {
  const a0 = [9, 8, 7, 6, 5, 4, 3, 2, 65535, 255];
  const bs0 = ByteSequence.fromUint16Iterable(a0, ByteOrder.BIG_ENDIAN);

  assertStrictEquals(bs0.byteLength, 20);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[16], 255);
  assertStrictEquals(bs0a[17], 255);
  assertStrictEquals(bs0a[18], 0);
  assertStrictEquals(bs0a[19], 255);

  const a1: number[] = [];
  const bs1 = ByteSequence.fromUint16Iterable(a1, ByteOrder.BIG_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint16Iterable(Array<number>, ByteOrder.LITTLE_ENDIAN)", () => {
  const a0 = [9, 8, 7, 6, 5, 4, 3, 2, 65535, 255];
  const bs0 = ByteSequence.fromUint16Iterable(a0, ByteOrder.LITTLE_ENDIAN);

  assertStrictEquals(bs0.byteLength, 20);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[16], 255);
  assertStrictEquals(bs0a[17], 255);
  assertStrictEquals(bs0a[18], 255);
  assertStrictEquals(bs0a[19], 0);

  const a1: number[] = [];
  const bs1 = ByteSequence.fromUint16Iterable(a1, ByteOrder.LITTLE_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint16Iterable(Array<number>, auto)", () => {
  const a0 = [9, 8, 7, 6, 5, 4, 3, 2, 65535, 255];
  const bs0 = ByteSequence.fromUint16Iterable(a0);

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
  const a1: number[] = [];
  const bs1 = ByteSequence.fromUint16Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint16Iterable(Uint16Array, ByteOrder.BIG_ENDIAN)", () => {
  const a0 = Uint16Array.of(9, 8, 7, 6, 5, 4, 3, 2, 65535, 255);
  const bs0 = ByteSequence.fromUint16Iterable(a0, ByteOrder.BIG_ENDIAN);

  assertStrictEquals(bs0.byteLength, 20);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[16], 255);
  assertStrictEquals(bs0a[17], 255);
  assertStrictEquals(bs0a[18], 0);
  assertStrictEquals(bs0a[19], 255);

  const a1 = Uint16Array.of();
  const bs1 = ByteSequence.fromUint16Iterable(a1, ByteOrder.BIG_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint16Iterable(Uint16Array, ByteOrder.LITTLE_ENDIAN)", () => {
  const a0 = Uint16Array.of(9, 8, 7, 6, 5, 4, 3, 2, 65535, 255);
  const bs0 = ByteSequence.fromUint16Iterable(a0, ByteOrder.LITTLE_ENDIAN);

  assertStrictEquals(bs0.byteLength, 20);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[16], 255);
  assertStrictEquals(bs0a[17], 255);
  assertStrictEquals(bs0a[18], 255);
  assertStrictEquals(bs0a[19], 0);

  const a1 = Uint16Array.of();
  const bs1 = ByteSequence.fromUint16Iterable(a1, ByteOrder.LITTLE_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint16Iterable(Uint16Array, auto)", () => {
  const a0 = Uint16Array.of(9, 8, 7, 6, 5, 4, 3, 2, 65535, 255);
  const bs0 = ByteSequence.fromUint16Iterable(a0);

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

  const a1 = Uint16Array.of();
  const bs1 = ByteSequence.fromUint16Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint16Iterable(Generator<number>, ByteOrder.BIG_ENDIAN)", () => {
  const a0 = (function* () {
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
  const bs0 = ByteSequence.fromUint16Iterable(a0, ByteOrder.BIG_ENDIAN);

  assertStrictEquals(bs0.byteLength, 20);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[16], 255);
  assertStrictEquals(bs0a[17], 255);
  assertStrictEquals(bs0a[18], 0);
  assertStrictEquals(bs0a[19], 255);

  const a1 = (function* () {
  })();
  const bs1 = ByteSequence.fromUint16Iterable(a1, ByteOrder.BIG_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint16Iterable(Generator<number>, ByteOrder.LITTLE_ENDIAN)", () => {
  const a0 = (function* () {
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
  const bs0 = ByteSequence.fromUint16Iterable(a0, ByteOrder.LITTLE_ENDIAN);

  assertStrictEquals(bs0.byteLength, 20);
  const bs0a = bs0.getView(Uint8Array);
  assertStrictEquals(bs0a[16], 255);
  assertStrictEquals(bs0a[17], 255);
  assertStrictEquals(bs0a[18], 255);
  assertStrictEquals(bs0a[19], 0);

  const a1 = (function* () {
  })();
  const bs1 = ByteSequence.fromUint16Iterable(a1, ByteOrder.LITTLE_ENDIAN);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint16Iterable(Generator<number>, auto)", () => {
  const a0 = (function* () {
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
  const bs0 = ByteSequence.fromUint16Iterable(a0);

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

  const a1 = (function* () {
  })();
  const bs1 = ByteSequence.fromUint16Iterable(a1);

  assertStrictEquals(bs1.byteLength, 0);
});

Deno.test("ByteSequence.fromUint16Iterable(any, auto)", () => {
  assertThrows(
    () => {
      ByteSequence.fromUint16Iterable(undefined as unknown as number[]);
    },
    TypeError,
    "source",
  );

  assertThrows(
    () => {
      ByteSequence.fromUint16Iterable(1 as unknown as number[]);
    },
    TypeError,
    "source",
  );

  assertThrows(
    () => {
      ByteSequence.fromUint16Iterable(["a"] as unknown as number[]);
    },
    RangeError,
    "source[*]",
  );
});
