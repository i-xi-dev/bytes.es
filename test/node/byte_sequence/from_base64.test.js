import assert from "node:assert";
import { ByteSequence } from "../../../node.mjs";

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

    const bs1 = ByteSequence.fromBase64("AwIBAP/+/fw=", {table:"rfc4648"});
    assert.strictEqual(bs1.toArray().join(","), "3,2,1,0,255,254,253,252");

    const bs1b = ByteSequence.fromBase64(" A wIBAP/+/fw ", {table:"rfc4648",forgiving:true});
    assert.strictEqual(bs1b.toArray().join(","), "3,2,1,0,255,254,253,252");

    const bs1c = ByteSequence.fromBase64("AwIBAP/+/fw", {table:"rfc4648",usePadding:false});
    assert.strictEqual(bs1c.toArray().join(","), "3,2,1,0,255,254,253,252");

    const bs2 = ByteSequence.fromBase64("AwIBAP_-_fw=", {table:"rfc4648-url"});
    assert.strictEqual(bs2.toArray().join(","), "3,2,1,0,255,254,253,252");

    const bs2b = ByteSequence.fromBase64(" A wIBAP_-_fw ", {table:"rfc4648-url",forgiving:true});
    assert.strictEqual(bs2b.toArray().join(","), "3,2,1,0,255,254,253,252");

    const bs2c = ByteSequence.fromBase64("AwIBAP_-_fw", {table:"rfc4648-url",usePadding:false});
    assert.strictEqual(bs2c.toArray().join(","), "3,2,1,0,255,254,253,252");

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
