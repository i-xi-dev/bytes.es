import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.fromText", () => {
  it("fromText(string)", () => {
    const bs0 = ByteSequence.fromText("");
    const bs1 = ByteSequence.fromText("1あ3\u{A9}");

    assert.strictEqual(bs0.toArray().join(","), "");
    assert.strictEqual(bs1.toArray().join(","), "49,227,129,130,51,194,169");

  });

  it("fromText(string, string)", () => {
    const bs0 = ByteSequence.fromText("", "utf-8");
    const bs1 = ByteSequence.fromText("1あ3\u{A9}", "utf-8");

    assert.strictEqual(bs0.toArray().join(","), "");
    assert.strictEqual(bs1.toArray().join(","), "49,227,129,130,51,194,169");

    assert.throws(() => {
      ByteSequence.fromText("", "utf-7");
    }, {
      message: "name:utf-7"
    });

  });

  it("fromText(string, string, Object)", () => {
    const bs1 = ByteSequence.fromText("1あ3\u{A9}", "utf-8", { addBom: true });
    assert.strictEqual(bs1.toArray().join(","), "239,187,191,49,227,129,130,51,194,169");

    const bs1b = ByteSequence.fromText("\u{FEFF}1あ3\u{A9}", "utf-8", { addBom: true });
    assert.strictEqual(bs1b.toArray().join(","), "239,187,191,49,227,129,130,51,194,169");

  });


});
