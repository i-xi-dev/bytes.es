import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.view", () => {
  test("view()", () => {
    const b0 = new Uint8Array(0);
    const bs0 = ByteSequence.from(b0);
    const bs1 = ByteSequence.create(1000);

    expect(bs0.view().byteLength).toBe(0);
    expect(bs1.view().byteLength).toBe(1000);
    expect((bs1.view() instanceof Uint8Array)).toBe(true);

  });

  test("view(number)", () => {
    const bs1 = ByteSequence.create(1000);

    expect(bs1.view(0).byteLength).toBe(1000);
    expect(bs1.view(1).byteLength).toBe(999);
    expect(bs1.view(999).byteLength).toBe(1);
    expect(bs1.view(1000).byteLength).toBe(0);

    expect(() => {
      bs1.view(-1)
    }).toThrow("byteOffset");

    expect(() => {
      bs1.view(1001)
    }).toThrow("byteOffset");

    expect(() => {
      bs1.view(Number.NaN)
    }).toThrow("byteOffset");

    expect(() => {
      bs1.view(1.5)
    }).toThrow("byteOffset");

  });

  test("view(number, number)", () => {
    const bs1 = ByteSequence.create(1000);

    expect(bs1.view(0, 1).byteLength).toBe(1);
    expect(bs1.view(0, 1000).byteLength).toBe(1000);
    expect(bs1.view(999, 1).byteLength).toBe(1);
    expect(bs1.view(1000, 0).byteLength).toBe(0);
    expect(bs1.view(0, 0).byteLength).toBe(0);

    expect(() => {
      bs1.view(0, Number.NaN)
    }).toThrow("byteCount");

    expect(() => {
      bs1.view(0, 1.5)
    }).toThrow("byteCount");

    expect(() => {
      bs1.view(0, 1001)
    }).toThrow("byteCount");

    expect(() => {
      bs1.view(999, 2)
    }).toThrow("byteCount");

  });

  test("fromメソッドに渡したインスタンスとは異なるインスタンスが返る", () => {
    const b0 = new Uint8Array(0);
    const bs0 = ByteSequence.from(b0);
    expect(bs0.view()).not.toBe(b0);

  });

  test("返却値への操作は自身に影響する", () => {
    const bs1 = new ByteSequence(new ArrayBuffer(100));

    const x = bs1.view();
    expect(x[0]).toBe(0);

    x[0] = 255;
    expect(x[0]).toBe(255);
    expect(new Uint8Array(bs1.buffer)[0]).toBe(255);

    x[0] = 32;
    expect(x[0]).toBe(32);
    expect(new Uint8Array(bs1.buffer)[0]).toBe(32);

  });

});
