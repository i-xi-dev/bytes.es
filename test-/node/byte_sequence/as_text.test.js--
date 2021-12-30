import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.asText", () => {
  it("asText()", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.from(Uint8Array.of(49,227,129,130,51,194,169));

    assert.strictEqual(bs0.asText(), "");
    assert.strictEqual(bs1.asText(), "1あ3\u{A9}");

  });

  it("asText(string)", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.from(Uint8Array.of(49,227,129,130,51,194,169));

    assert.strictEqual(bs0.asText("UTF-8"), "");
    assert.strictEqual(bs1.asText("utf-8"), "1あ3\u{A9}");

    assert.throws(() => {
      bs0.asText("UTF-7");
    }, {
      message: "name:UTF-7"
    });

  });

  it("asText(string, Object)", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.from(Uint8Array.of(49,227,129,130,51,194,169));
    const bs2 = ByteSequence.from(Uint8Array.of(239,187,191,49,227,129,130,51,194,169));

    assert.strictEqual(bs0.asText("utf-8", { removeBom: true }), "");
    assert.strictEqual(bs1.asText("UTF-8", { removeBom: true }), "1あ3\u{A9}");
    assert.strictEqual(bs2.asText("UTF-8", { removeBom: true }), "1あ3\u{A9}");

  });

});
