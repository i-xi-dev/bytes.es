import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.fromText", () => {
  test("fromText(string)", () => {
    const bs0 = ByteSequence.fromText("");
    const bs1 = ByteSequence.fromText("1あ3\u{A9}");

    expect(bs0.toArray().join(",")).toBe("");
    expect(bs1.toArray().join(",")).toBe("49,227,129,130,51,194,169");

  });

  test("fromText(string, string)", () => {
    const bs0 = ByteSequence.fromText("", "utf-8");
    const bs1 = ByteSequence.fromText("1あ3\u{A9}", "utf-8");

    expect(bs0.toArray().join(",")).toBe("");
    expect(bs1.toArray().join(",")).toBe("49,227,129,130,51,194,169");

    expect(() => {
      ByteSequence.fromText("", "utf-7");
    }).toThrow("name:utf-7");

  });

  test("fromText(string, string, Object)", () => {
    const bs1 = ByteSequence.fromText("1あ3\u{A9}", "utf-8", { addBom: true });
    expect(bs1.toArray().join(",")).toBe("239,187,191,49,227,129,130,51,194,169");

    const bs1b = ByteSequence.fromText("\u{FEFF}1あ3\u{A9}", "utf-8", { addBom: true });
    expect(bs1b.toArray().join(",")).toBe("239,187,191,49,227,129,130,51,194,169");

  });


});
