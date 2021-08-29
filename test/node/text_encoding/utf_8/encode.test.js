import assert from "node:assert";
import { TextEncoding } from "../../../../node.mjs";
const Utf8 = TextEncoding.for("UTF-8");

describe("Utf8.encode", () => {
  it("encode(string)", () => {
    assert.strictEqual([...Utf8.encode("")].join(","), "");
    assert.strictEqual([...Utf8.encode("1あ3\u{A9}\n\u{2000B}abc\na")].join(","), "49,227,129,130,51,194,169,10,240,160,128,139,97,98,99,10,97");
    assert.strictEqual([...Utf8.encode("\uFEFF\u0031\u0033")].join(","), "239,187,191,49,51");
    assert.strictEqual([...Utf8.encode("1あ3\u{A9}")].join(","), "49,227,129,130,51,194,169");
    //assert.strictEqual([...Utf8.encode("1\uFFFD\uFFFD3")].join(","), "49,130,160,51");

    assert.strictEqual([...Utf8.encode("\uFEFF1あ3\u{A9}")].join(","), "239,187,191,49,227,129,130,51,194,169");

  });

  it("encode(string, Object)", () => {
    // addBom
    assert.strictEqual([...Utf8.encode("1あ3\u{A9}", {addBom:true})].join(","), "239,187,191,49,227,129,130,51,194,169");
    assert.strictEqual([...Utf8.encode("\uFEFF1あ3\u{A9}", {addBom:true})].join(","), "239,187,191,49,227,129,130,51,194,169");

  });

});
