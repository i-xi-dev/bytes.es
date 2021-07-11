import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.toEncoded", () => {
  const bs0 = ByteSequence.create(0);

  test("toEncoded(string)", () => {
    const s1 = bs0.toEncoded("BASE64");
    expect(s1.length).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認

    expect(() => {
      bs0.toEncoded("hoge");
    }).toThrow("unknown encodingName");

  });

  test("toEncoded(string, ByteEncodingOptions)", () => {
    const s1 = bs0.toEncoded("BASE64", {});
    expect(s1.length).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
