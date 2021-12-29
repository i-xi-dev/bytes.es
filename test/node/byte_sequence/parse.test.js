import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.parse", () => {
  it("parse(string)", () => {
    const bs0 = ByteSequence.parse("41424344");
    assert.strictEqual(bs0.toString(), "41424344");
    assert.strictEqual(ByteSequence.parse("").toString(), "");

    assert.throws(() => {
      ByteSequence.parse("あ");
    }, {
      message: "parse error: あ"
    });

    assert.throws(() => {
      ByteSequence.parse("GG");
    }, {
      message: "parse error: GG"
    });

  });

  it("parse(string, {radix:number})", () => {
    const bs0 = ByteSequence.parse("41424344", {radix:16});
    assert.strictEqual(bs0.toString(), "41424344");

    const bs1 = ByteSequence.parse("065066067068", {radix:10});
    assert.strictEqual(bs1.toString(), "41424344");

    const bs2 = ByteSequence.parse("101102103104", {radix:8});
    assert.strictEqual(bs2.toString(), "41424344");

    const bs3 = ByteSequence.parse("01000001010000100100001101000100", {radix:2});
    assert.strictEqual(bs3.toString(), "41424344");

  });

  it("parse(string, FormatOptions)", () => {
    const bs0 = ByteSequence.parse("0041004200430044", {radix:16, paddedLength:4, upperCase:true});
    assert.strictEqual(bs0.toString(), "41424344");

  });

});
