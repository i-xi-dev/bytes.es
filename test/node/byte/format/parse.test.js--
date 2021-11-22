import assert from "node:assert";
import { Format } from "../../../../dist/byte/index.js";

describe("Format.parse", () => {
  it("parse(string)", () => {
    const parsed10 = Format.parse("", 16);
    assert.strictEqual(parsed10.length, 0);
    const parsed11 = Format.parse("00", 16);
    assert.strictEqual(parsed11.length, 1);
    assert.strictEqual(parsed11[0], 0);
    const parsed12 = Format.parse("00ff01", 16);
    assert.strictEqual(parsed12.length, 3);
    assert.strictEqual(parsed12[0], 0);
    assert.strictEqual(parsed12[1], 255);
    assert.strictEqual(parsed12[2], 1);

    const parsed21 = Format.parse("000", 10);
    assert.strictEqual(parsed21.length, 1);
    assert.strictEqual(parsed21[0], 0);
    const parsed22 = Format.parse("000255001", 10);
    assert.strictEqual(parsed22.length, 3);
    assert.strictEqual(parsed22[0], 0);
    assert.strictEqual(parsed22[1], 255);
    assert.strictEqual(parsed22[2], 1);

    const parsed21b = Format.parse("00000000", 2);
    assert.strictEqual(parsed21b.length, 1);
    assert.strictEqual(parsed21b[0], 0);
    const parsed22b = Format.parse("000000001111111100000001", 2);
    assert.strictEqual(parsed22b.length, 3);
    assert.strictEqual(parsed22b[0], 0);
    assert.strictEqual(parsed22b[1], 255);
    assert.strictEqual(parsed22b[2], 1);

    const parsed21c = Format.parse("000", 8);
    assert.strictEqual(parsed21c.length, 1);
    assert.strictEqual(parsed21c[0], 0);
    const parsed22c = Format.parse("000377001", 8);
    assert.strictEqual(parsed22c.length, 3);
    assert.strictEqual(parsed22c[0], 0);
    assert.strictEqual(parsed22c[1], 255);
    assert.strictEqual(parsed22c[2], 1);

    const parsed31 = Format.parse("000", 16, {paddedLength:3});
    assert.strictEqual(parsed31.length, 1);
    assert.strictEqual(parsed31[0], 0);
    const parsed32 = Format.parse("0000ff001", 16, {paddedLength:3});
    assert.strictEqual(parsed32.length, 3);
    assert.strictEqual(parsed32[0], 0);
    assert.strictEqual(parsed32[1], 255);
    assert.strictEqual(parsed32[2], 1);

    const parsed41 = Format.parse("00", 16, {upperCase:true});
    assert.strictEqual(parsed41.length, 1);
    assert.strictEqual(parsed41[0], 0);
    const parsed42 = Format.parse("00FF01", 16, {upperCase:true});
    assert.strictEqual(parsed42.length, 3);
    assert.strictEqual(parsed42[0], 0);
    assert.strictEqual(parsed42[1], 255);
    assert.strictEqual(parsed42[2], 1);

    const parsed51 = Format.parse("-00", 16, {prefix:"-"});
    assert.strictEqual(parsed51.length, 1);
    assert.strictEqual(parsed51[0], 0);
    const parsed52 = Format.parse("-00-ff-01", 16, {prefix:"-"});
    assert.strictEqual(parsed52.length, 3);
    assert.strictEqual(parsed52[0], 0);
    assert.strictEqual(parsed52[1], 255);
    assert.strictEqual(parsed52[2], 1);

    const parsed61 = Format.parse("00-", 16, {suffix:"-"});
    assert.strictEqual(parsed61.length, 1);
    assert.strictEqual(parsed61[0], 0);
    const parsed62 = Format.parse("00-ff-01-", 16, {suffix:"-"});
    assert.strictEqual(parsed62.length, 3);
    assert.strictEqual(parsed62[0], 0);
    assert.strictEqual(parsed62[1], 255);
    assert.strictEqual(parsed62[2], 1);

    const parsed71 = Format.parse("-000-", 16, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    assert.strictEqual(parsed71.length, 1);
    assert.strictEqual(parsed71[0], 0);
    const parsed72 = Format.parse("-000--0FF--001-", 16, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    assert.strictEqual(parsed72.length, 3);
    assert.strictEqual(parsed72[0], 0);
    assert.strictEqual(parsed72[1], 255);
    assert.strictEqual(parsed72[2], 1);

    const parsed81 = Format.parse("-000-", 10, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    assert.strictEqual(parsed81.length, 1);
    assert.strictEqual(parsed81[0], 0);
    const parsed82 = Format.parse("-000--255--001-", 10, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    assert.strictEqual(parsed82.length, 3);
    assert.strictEqual(parsed82[0], 0);
    assert.strictEqual(parsed82[1], 255);
    assert.strictEqual(parsed82[2], 1);

  });

  it("DataError", () => {
    assert.throws(() => {
      Format.parse("a", 16);
    }, {
      message: "parse error"
    });
    assert.throws(() => {
      Format.parse("000", 16);
    }, {
      message: "parse error"
    });
  });

  it("InvalidCharacterError - upperCase", () => {
    assert.throws(() => {
      Format.parse("ff", 16, {upperCase:true});
    }, {
      message: "parse error"
    });
    assert.throws(() => {
      Format.parse("FF", 16, {upperCase:false});
    }, {
      message: "parse error"
    });
  });

  it("InvalidCharacterError - caseInsensitive", () => {
    assert.strictEqual(Format.parse("ff", 16, {upperCase:true,caseInsensitive:true}).join(","), "255");
    assert.strictEqual(Format.parse("FF", 16, {upperCase:false,caseInsensitive:true}).join(","), "255");
  });

  it("InvalidCharacterError - prefix", () => {
    assert.throws(() => {
      Format.parse("#00", 16, {prefix:"-"});
    }, {
      message: "unprefixed"
    });
    assert.throws(() => {
      Format.parse("000", 16, {prefix:"-"});
    }, {
      message: "unprefixed"
    });
  });

  it("InvalidCharacterError - suffix", () => {
    assert.throws(() => {
      Format.parse("00#", 16, {suffix:"-"});
    }, {
      message: "unsuffixed"
    });
    assert.throws(() => {
      Format.parse("000", 16, {suffix:"-"});
    }, {
      message: "unsuffixed"
    });
  });
});
