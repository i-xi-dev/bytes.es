import assert from "node:assert";
import iconv from "iconv-lite";
import { TextEncoding } from "../../../../node/index.mjs";

describe("TextEncoding.register", () => {
  it("register(string, Object)", async () => {

    TextEncoding.register("EUC-JP", {
      name: "EUC-JP",
      decode(encoded) {
        return iconv.decode(Buffer.from(encoded), "EUC-JP");
      },
      encode(toEncode) {
        return iconv.encode(toEncode, "EUC-JP");
      },
    });
    const eucJp = TextEncoding.for("EUC-JP");

    assert.strictEqual(eucJp.decode(Uint8Array.of()), "");

    const e1 = eucJp.encode("あいうえお");
    assert.strictEqual([...e1].join(","), "164,162,164,164,164,166,164,168,164,170");
    assert.strictEqual(eucJp.decode(e1), "あいうえお");
    //assert.strictEqual(eucJp.decode(Uint8Array.of(164,162,164,164,164,166,164,168,164,170)), "あいうえお");

  });

});
