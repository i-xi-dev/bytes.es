import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.fromBase64", () => {
  it("fromBase64(string)", () => {
    const bs0 = ByteSequence.fromBase64("");
    assert.strictEqual(bs0.count, 0);

    const bs1 = ByteSequence.fromBase64("AwIBAP/+/fw=");
    assert.strictEqual(bs1.toArray().join(","), "3,2,1,0,255,254,253,252");

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  it("fromBase64(string, ByteEncodingOptions)", () => {
    const bs0 = ByteSequence.fromBase64("", {});
    assert.strictEqual(bs0.count, 0);

    const bs1 = ByteSequence.fromBase64("AwIBAP/+/fw=", {});
    assert.strictEqual(bs1.toArray().join(","), "3,2,1,0,255,254,253,252");

    const bs1b = ByteSequence.fromBase64(" A wIBAP/+/fw ", {});
    assert.strictEqual(bs1b.toArray().join(","), "3,2,1,0,255,254,253,252");

    const bs1c = ByteSequence.fromBase64("AwIBAP/+/fw", {padEnd:false});
    assert.strictEqual(bs1c.toArray().join(","), "3,2,1,0,255,254,253,252");

    const rfc4648urlTable = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "-", "_" ];

    const bs2 = ByteSequence.fromBase64("AwIBAP_-_fw=", {table:rfc4648urlTable});
    assert.strictEqual(bs2.toArray().join(","), "3,2,1,0,255,254,253,252");

    const bs2b = ByteSequence.fromBase64(" A wIBAP_-_fw ", {table:rfc4648urlTable});
    assert.strictEqual(bs2b.toArray().join(","), "3,2,1,0,255,254,253,252");

    const bs2c = ByteSequence.fromBase64("AwIBAP_-_fw", {table:rfc4648urlTable,padEnd:false});
    assert.strictEqual(bs2c.toArray().join(","), "3,2,1,0,255,254,253,252");

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
