import { Utf8 } from "../../../../dist/data/text_encoding/utf_8.js";

describe("Utf8.encode", () => {
  test("encode(string)", () => {
    expect([...Utf8.encode("")].join(",")).toBe("");
    expect([...Utf8.encode("1あ3\u{A9}\n\u{2000B}abc\na")].join(",")).toBe("49,227,129,130,51,194,169,10,240,160,128,139,97,98,99,10,97");
    expect([...Utf8.encode("\uFEFF\u0031\u0033")].join(",")).toBe("239,187,191,49,51");
    expect([...Utf8.encode("1あ3\u{A9}")].join(",")).toBe("49,227,129,130,51,194,169");
    //expect([...Utf8.encode("1\uFFFD\uFFFD3")].join(",")).toBe("49,130,160,51");

    expect([...Utf8.encode("\uFEFF1あ3\u{A9}")].join(",")).toBe("239,187,191,49,227,129,130,51,194,169");

  });

  test("encode(string, Object)", () => {
    // addBom
    expect([...Utf8.encode("1あ3\u{A9}", {addBom:true})].join(",")).toBe("239,187,191,49,227,129,130,51,194,169");
    expect([...Utf8.encode("\uFEFF1あ3\u{A9}", {addBom:true})].join(",")).toBe("239,187,191,49,227,129,130,51,194,169");

  });

});
