import assert from "node:assert";
import { Format } from "../../../dist/byte/index.js";

describe("Format.format", () => {
  it("format(Uint8Array)", () => {
    const formatted10 = Format.format(Uint8Array.of(), 16);
    assert.strictEqual(formatted10, "");
    const formatted11 = Format.format(Uint8Array.of(0), 16);
    assert.strictEqual(formatted11, "00");
    const formatted12 = Format.format(Uint8Array.of(0,255,1), 16);
    assert.strictEqual(formatted12, "00ff01");

    const formatted21 = Format.format(Uint8Array.of(0), 10);
    assert.strictEqual(formatted21, "000");
    const formatted22 = Format.format(Uint8Array.of(0,255,1), 10);
    assert.strictEqual(formatted22, "000255001");

    const formatted21b = Format.format(Uint8Array.of(0), 2);
    assert.strictEqual(formatted21b, "00000000");
    const formatted22b = Format.format(Uint8Array.of(0,255,1), 2);
    assert.strictEqual(formatted22b, "000000001111111100000001");

    const formatted21c = Format.format(Uint8Array.of(0), 8);
    assert.strictEqual(formatted21c, "000");
    const formatted22c = Format.format(Uint8Array.of(0,255,1), 8);
    assert.strictEqual(formatted22c, "000377001");

    const formatted31 = Format.format(Uint8Array.of(0), 16, {paddedLength:3});
    assert.strictEqual(formatted31, "000");
    const formatted32 = Format.format(Uint8Array.of(0,255,1), 16, {paddedLength:3});
    assert.strictEqual(formatted32, "0000ff001");

    const formatted41 = Format.format(Uint8Array.of(0), 16, {upperCase:true});
    assert.strictEqual(formatted41, "00");
    const formatted42 = Format.format(Uint8Array.of(0,255,1), 16, {upperCase:true});
    assert.strictEqual(formatted42, "00FF01");

    const formatted51 = Format.format(Uint8Array.of(0), 16, {prefix:"-"});
    assert.strictEqual(formatted51, "-00");
    const formatted52 = Format.format(Uint8Array.of(0,255,1), 16, {prefix:"-"});
    assert.strictEqual(formatted52, "-00-ff-01");

    const formatted61 = Format.format(Uint8Array.of(0), 16, {suffix:"-"});
    assert.strictEqual(formatted61, "00-");
    const formatted62 = Format.format(Uint8Array.of(0,255,1), 16, {suffix:"-"});
    assert.strictEqual(formatted62, "00-ff-01-");

    const formatted71 = Format.format(Uint8Array.of(0), 16, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    assert.strictEqual(formatted71, "-000-");
    const formatted72 = Format.format(Uint8Array.of(0,255,1), 16, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    assert.strictEqual(formatted72, "-000--0FF--001-");

    const formatted81 = Format.format(Uint8Array.of(0), 10, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    assert.strictEqual(formatted81, "-000-");
    const formatted82 = Format.format(Uint8Array.of(0,255,1), 10, {paddedLength:3,upperCase:true,prefix:"-",suffix:"-"});
    assert.strictEqual(formatted82, "-000--255--001-");

  });
});
