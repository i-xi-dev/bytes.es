import { ByteSequence } from "../../dist/byte_sequence.js";

describe("ByteSequence.prototype.asText", () => {
  test("asText()", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.from(Uint8Array.of(49,227,129,130,51,194,169));

    expect(bs0.asText()).toBe("");
    expect(bs1.asText()).toBe("1あ3\u{A9}");

  });

  test("asText(string)", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.from(Uint8Array.of(49,227,129,130,51,194,169));

    expect(bs0.asText("UTF-8")).toBe("");
    expect(bs1.asText("utf-8")).toBe("1あ3\u{A9}");

    expect(() => {
      bs0.asText("UTF-7");
    }).toThrow("encodingName not found");

  });

  test("asText(string, Object)", () => {
    const bs0 = ByteSequence.create(0);
    const bs1 = ByteSequence.from(Uint8Array.of(49,227,129,130,51,194,169));
    const bs2 = ByteSequence.from(Uint8Array.of(239,187,191,49,227,129,130,51,194,169));

    expect(bs0.asText("utf-8", { removeBom: true })).toBe("");
    expect(bs1.asText("UTF-8", { removeBom: true })).toBe("1あ3\u{A9}");
    expect(bs2.asText("UTF-8", { removeBom: true })).toBe("1あ3\u{A9}");

  });

});
