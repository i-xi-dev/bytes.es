import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.fromEncoded", () => {
  test("fromEncoded(string, string)", () => {
    const bs0 = ByteSequence.fromEncoded("", "BASE64");
    expect(bs0.count).toBe(0);

    const bs1 = ByteSequence.fromEncoded("", "PERCENT");
    expect(bs1.count).toBe(0);

    expect(() => {
      ByteSequence.fromEncoded("", "hoge");
    }).toThrow("unknown encodingName");

    const bs2 = ByteSequence.fromEncoded("%03", "PERCENT");
    expect(bs2.view()[0]).toBe(0x03);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  test("fromEncoded(string, string, ByteEncodingOptions)", () => {
    const bs0 = ByteSequence.fromEncoded("", "BASE64", {});
    expect(bs0.count).toBe(0);

    // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
