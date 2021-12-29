import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.toPercent", () => {
  const bs0 = ByteSequence.allocate(0);
  const bs1 = ByteSequence.of(3,2,1,0,255,254,253,252);
  const bs3 = ByteSequence.of(0x20,0x21,0x22,0x23);

  it("toPercent()", () => {
    const s1 = bs0.toPercent();
    assert.strictEqual(s1.length, 0);

    const s11 = bs1.toPercent();
    assert.strictEqual(s11, "%03%02%01%00%FF%FE%FD%FC");

  });

  it("toPercent(PercentOptions)", () => {
    const s1 = bs0.toPercent({});
    assert.strictEqual(s1.length, 0);

    const s11 = bs1.toPercent({});
    assert.strictEqual(s11, "%03%02%01%00%FF%FE%FD%FC");

    const s3a = bs3.toPercent({spaceAsPlus:true});
    assert.strictEqual(s3a, "+%21%22%23");

    const s3b = bs3.toPercent({encodeSet:[]});
    assert.strictEqual(s3b, " !\"#");
  });

});
