import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.toBase64", () => {
  const bs0 = ByteSequence.create(0);
  const bs1 = ByteSequence.of(3,2,1,0,255,254,253,252);

  it("toBase64()", () => {
    const s1 = bs0.toBase64();
    assert.strictEqual(s1.length, 0);

    const s11 = bs1.toBase64();
    assert.strictEqual(s11, "AwIBAP/+/fw=");

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  it("toBase64(ByteEncodingOptions)", () => {
    const s1 = bs0.toBase64({});
    assert.strictEqual(s1.length, 0);

    const s11 = bs1.toBase64({table:"rfc4648"});
    assert.strictEqual(s11, "AwIBAP/+/fw=");

    const s11b = bs1.toBase64({table:"rfc4648-url"});
    assert.strictEqual(s11b, "AwIBAP_-_fw=");

    const s11c = bs1.toBase64({table:"rfc4648",usePadding:false});
    assert.strictEqual(s11c, "AwIBAP/+/fw");

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
