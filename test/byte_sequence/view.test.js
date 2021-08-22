import assert from "node:assert";
import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.view", () => {
  it("view()", () => {
    const b0 = new Uint8Array(0);
    const bs0 = ByteSequence.from(b0);
    const bs1 = ByteSequence.create(1000);

    assert.strictEqual(bs0.view().byteLength, 0);
    assert.strictEqual(bs1.view().byteLength, 1000);
    assert.strictEqual((bs1.view() instanceof Uint8Array), true);

  });

  it("view(number)", () => {
    const bs1 = ByteSequence.create(1000);

    assert.strictEqual(bs1.view(0).byteLength, 1000);
    assert.strictEqual(bs1.view(1).byteLength, 999);
    assert.strictEqual(bs1.view(999).byteLength, 1);
    assert.strictEqual(bs1.view(1000).byteLength, 0);

    assert.throws(() => {
      bs1.view(-1)
    }, {
      message: "byteOffset"
    });

    assert.throws(() => {
      bs1.view(1001)
    }, {
      message: "byteOffset"
    });

    assert.throws(() => {
      bs1.view(Number.NaN)
    }, {
      message: "byteOffset"
    });

    assert.throws(() => {
      bs1.view(1.5)
    }, {
      message: "byteOffset"
    });

  });

  it("view(number, number)", () => {
    const bs1 = ByteSequence.create(1000);

    assert.strictEqual(bs1.view(0, 1).byteLength, 1);
    assert.strictEqual(bs1.view(0, 1000).byteLength, 1000);
    assert.strictEqual(bs1.view(999, 1).byteLength, 1);
    assert.strictEqual(bs1.view(1000, 0).byteLength, 0);
    assert.strictEqual(bs1.view(0, 0).byteLength, 0);

    assert.throws(() => {
      bs1.view(0, Number.NaN)
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      bs1.view(0, 1.5)
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      bs1.view(0, 1001)
    }, {
      message: "byteCount"
    });

    assert.throws(() => {
      bs1.view(999, 2)
    }, {
      message: "byteCount"
    });

  });

  it("fromメソッドに渡したインスタンスとは異なるインスタンスが返る", () => {
    const b0 = new Uint8Array(0);
    const bs0 = ByteSequence.from(b0);
    assert.notStrictEqual(bs0.view(), b0);

  });

  it("返却値への操作は自身に影響する", () => {
    const bs1 = new ByteSequence(new ArrayBuffer(100));

    const x = bs1.view();
    assert.strictEqual(x[0], 0);

    x[0] = 255;
    assert.strictEqual(x[0], 255);
    assert.strictEqual(new Uint8Array(bs1.buffer)[0], 255);

    x[0] = 32;
    assert.strictEqual(x[0], 32);
    assert.strictEqual(new Uint8Array(bs1.buffer)[0], 32);

  });

});
