import assert from "node:assert";
import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.parse", () => {
  it("parse(string)", () => {
    const bs0 = ByteSequence.parse("41424344");
    assert.strictEqual(bs0.toString(), "41424344");
    assert.strictEqual(ByteSequence.parse("").toString(), "");

    assert.throws(() => {
      ByteSequence.parse("あ");
    }, {
      message: "parse error"
    });

    assert.throws(() => {
      ByteSequence.parse("GG");
    }, {
      message: "parse error"
    });

  });

  it("parse(string, number)", () => {
    const bs0 = ByteSequence.parse("41424344", 16);
    assert.strictEqual(bs0.toString(), "41424344");

    const bs1 = ByteSequence.parse("065066067068", 10);
    assert.strictEqual(bs1.toString(), "41424344");

    const bs2 = ByteSequence.parse("101102103104", 8);
    assert.strictEqual(bs2.toString(), "41424344");

    const bs3 = ByteSequence.parse("01000001010000100100001101000100", 2);
    assert.strictEqual(bs3.toString(), "41424344");

  });

  it("parse(string, number, FormatOptions)", () => {
    const bs0 = ByteSequence.parse("0041004200430044", 16, {paddedLength:4, upperCase:true});
    assert.strictEqual(bs0.toString(), "41424344");

  });

});
