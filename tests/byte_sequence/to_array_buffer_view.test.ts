import {
  assertNotStrictEquals,
  assertStrictEquals,
  assertThrows,
} from "../deps.ts";
import { ByteSequence } from "../../mod.ts";

Deno.test("ByteSequence.prototype.toArrayBufferView()", () => {
  const a1 = Uint8Array.of(3, 2, 1, 0);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toArrayBufferView<Uint8Array>();
  assertStrictEquals(c1 instanceof Uint8Array, true);
  assertStrictEquals([...c1].join(","), "3,2,1,0");
});

Deno.test("ByteSequence.prototype.toArrayBufferView(Uint8Array)", () => {
  const a1 = Uint8Array.of(3, 2, 1, 0);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toArrayBufferView(Uint8Array);
  assertStrictEquals(c1 instanceof Uint8Array, true);
  assertStrictEquals([...c1].join(","), "3,2,1,0");
});

Deno.test("ByteSequence.prototype.toArrayBufferView(BigInt64Array)", () => {
  const a1 = Uint8Array.of(3, 2, 1, 0, 255, 254, 253, 252);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toArrayBufferView(BigInt64Array);
  assertStrictEquals(c1 instanceof BigInt64Array, true);
  assertStrictEquals([...c1].join(","), "-216736835873734141");
});

Deno.test("ByteSequence.prototype.toArrayBufferView(*)", () => {
  const a1 = Uint8Array.of(3, 2, 1, 0, 255, 254, 253, 252);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  assertThrows(
    () => {
      bs1.toArrayBufferView(Blob as unknown as Uint8ArrayConstructor);
    },
    TypeError,
    "ctor",
  );
});

Deno.test("ByteSequence.prototype.toInt8Array()", () => {
  const a1 = Int8Array.of(3, 2, 1, 0);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toInt8Array();
  assertStrictEquals(c1 instanceof Int8Array, true);
  assertStrictEquals([...c1].join(","), "3,2,1,0");
  assertNotStrictEquals(a1, c1);

  // 返却値への操作は自身に影響しない
  c1[0] = 255;
  assertStrictEquals([...a1].join(","), "3,2,1,0");
  assertStrictEquals([...c1].join(","), "-1,2,1,0");
});

Deno.test("ByteSequence.prototype.toUint8Array()", () => {
  const a1 = Uint8Array.of(3, 2, 1, 0);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toUint8Array();
  assertStrictEquals(c1 instanceof Uint8Array, true);
  assertStrictEquals([...c1].join(","), "3,2,1,0");
  assertNotStrictEquals(a1, c1);

  // 返却値への操作は自身に影響しない
  c1[0] = 255;
  assertStrictEquals([...a1].join(","), "3,2,1,0");
  assertStrictEquals([...c1].join(","), "255,2,1,0");
});

Deno.test("ByteSequence.prototype.toUint8ClampedArray()", () => {
  const a1 = Uint8ClampedArray.of(3, 2, 1, 0);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toUint8ClampedArray();
  assertStrictEquals(c1 instanceof Uint8ClampedArray, true);
  assertStrictEquals([...c1].join(","), "3,2,1,0");
  assertNotStrictEquals(a1, c1);

  // 返却値への操作は自身に影響しない
  c1[0] = 255;
  assertStrictEquals([...a1].join(","), "3,2,1,0");
  assertStrictEquals([...c1].join(","), "255,2,1,0");
});

Deno.test("ByteSequence.prototype.toInt16Array()", () => {
  const a1 = Int16Array.of(3, 2, 1, 0);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toInt16Array();
  assertStrictEquals(c1 instanceof Int16Array, true);
  assertStrictEquals([...c1].join(","), "3,2,1,0");
  assertNotStrictEquals(a1, c1);

  // 返却値への操作は自身に影響しない
  c1[0] = 65535;
  assertStrictEquals([...a1].join(","), "3,2,1,0");
  assertStrictEquals([...c1].join(","), "-1,2,1,0");
});

Deno.test("ByteSequence.prototype.toUint16Array()", () => {
  const a1 = Uint16Array.of(3, 2, 1, 0);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toUint16Array();
  assertStrictEquals(c1 instanceof Uint16Array, true);
  assertStrictEquals([...c1].join(","), "3,2,1,0");
  assertNotStrictEquals(a1, c1);

  // 返却値への操作は自身に影響しない
  c1[0] = 65535;
  assertStrictEquals([...a1].join(","), "3,2,1,0");
  assertStrictEquals([...c1].join(","), "65535,2,1,0");
});

Deno.test("ByteSequence.prototype.toInt32Array()", () => {
  const a1 = Int32Array.of(3, 2, 1, 0);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toInt32Array();
  assertStrictEquals(c1 instanceof Int32Array, true);
  assertStrictEquals([...c1].join(","), "3,2,1,0");
  assertNotStrictEquals(a1, c1);

  // 返却値への操作は自身に影響しない
  c1[0] = 4294967295;
  assertStrictEquals([...a1].join(","), "3,2,1,0");
  assertStrictEquals([...c1].join(","), "-1,2,1,0");
});

Deno.test("ByteSequence.prototype.toUint32Array()", () => {
  const a1 = Uint32Array.of(3, 2, 1, 0);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toUint32Array();
  assertStrictEquals(c1 instanceof Uint32Array, true);
  assertStrictEquals([...c1].join(","), "3,2,1,0");
  assertNotStrictEquals(a1, c1);

  // 返却値への操作は自身に影響しない
  c1[0] = 4294967295;
  assertStrictEquals([...a1].join(","), "3,2,1,0");
  assertStrictEquals([...c1].join(","), "4294967295,2,1,0");
});

Deno.test("ByteSequence.prototype.toFloat32Array()", () => {
  const a1 = Float32Array.of(3, 2, 1, 0);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toFloat32Array();
  assertStrictEquals(c1 instanceof Float32Array, true);
  assertStrictEquals([...c1].join(","), "3,2,1,0");
  assertNotStrictEquals(a1, c1);

  // 返却値への操作は自身に影響しない
  c1[0] = 1.5;
  assertStrictEquals([...a1].join(","), "3,2,1,0");
  assertStrictEquals([...c1].join(","), "1.5,2,1,0");
});

Deno.test("ByteSequence.prototype.toFloat64Array()", () => {
  const a1 = Float64Array.of(3, 2, 1, 0);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toFloat64Array();
  assertStrictEquals(c1 instanceof Float64Array, true);
  assertStrictEquals([...c1].join(","), "3,2,1,0");
  assertNotStrictEquals(a1, c1);

  // 返却値への操作は自身に影響しない
  c1[0] = 1.5;
  assertStrictEquals([...a1].join(","), "3,2,1,0");
  assertStrictEquals([...c1].join(","), "1.5,2,1,0");
});

Deno.test("ByteSequence.prototype.toBigInt64Array()", () => {
  const a1 = BigInt64Array.of(3n, 2n, 1n, 0n);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toBigInt64Array();
  assertStrictEquals(c1 instanceof BigInt64Array, true);
  assertStrictEquals([...c1].join(","), "3,2,1,0");
  assertNotStrictEquals(a1, c1);

  // 返却値への操作は自身に影響しない
  c1[0] = 18446744073709551615n;
  assertStrictEquals([...a1].join(","), "3,2,1,0");
  assertStrictEquals([...c1].join(","), "-1,2,1,0");
});

Deno.test("ByteSequence.prototype.toBigUint64Array()", () => {
  const a1 = BigUint64Array.of(3n, 2n, 1n, 0n);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toBigUint64Array();
  assertStrictEquals(c1 instanceof BigUint64Array, true);
  assertStrictEquals([...c1].join(","), "3,2,1,0");
  assertNotStrictEquals(a1, c1);

  // 返却値への操作は自身に影響しない
  c1[0] = 18446744073709551615n;
  assertStrictEquals([...a1].join(","), "3,2,1,0");
  assertStrictEquals([...c1].join(","), "18446744073709551615,2,1,0");
});

Deno.test("ByteSequence.prototype.toDataView()", () => {
  const a1 = Uint8Array.of(3, 2, 1, 0, 255, 254, 253, 252);
  const bs1 = ByteSequence.fromArrayBufferView(a1);

  const c1 = bs1.toDataView();
  assertStrictEquals(c1 instanceof DataView, true);
  assertStrictEquals(c1.getUint8(0), 3);
});
