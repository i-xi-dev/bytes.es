import assert from "node:assert";
import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.fromBinaryString", () => {
  it("fromBinaryString(string)", () => {
    const binStr = "ABCD";
    const bsbs = ByteSequence.fromBinaryString(binStr);

    const bsa = bsbs.toArray();

    assert.strictEqual(bsa[0], 65);
    assert.strictEqual(bsa[1], 66);
    assert.strictEqual(bsa[2], 67);
    assert.strictEqual(bsa[3], 68);

    assert.strictEqual(ByteSequence.fromBinaryString("").count, 0);

    assert.throws(() => {
      ByteSequence.fromBinaryString("あ");
    }, {
      message: "binaryString"
    });

    assert.throws(() => {
      ByteSequence.fromBinaryString("\u0100");
    }, {
      message: "binaryString"
    });

  });

});
