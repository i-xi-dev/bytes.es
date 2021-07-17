import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.fromPercentEncoded", () => {
  test("fromPercentEncoded(string)", () => {
    // const bs1 = ByteSequence.fromPercentEncoded("");
    // expect(bs1.count).toBe(0);

    // const bs2 = ByteSequence.fromPercentEncoded("%03");
    // expect(bs2.view()[0]).toBe(0x03);

    // // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

  test("fromPercentEncoded(string, ByteEncodingOptions)", () => {
    // const bs0 = ByteSequence.fromPercentEncoded("", {});
    // expect(bs0.count).toBe(0);

    // // 結果の妥当性はエンコーディングクラスのテストにて確認
  });

});
