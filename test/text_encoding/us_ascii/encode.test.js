import { UsAscii } from "../../../dist/text_encoding/us_ascii.js";

describe("UsAscii.encode", () => {
  test("UsAscii(string)", () => {
    expect([...UsAscii.encode("")].join(",")).toBe("");
    expect([...UsAscii.encode("\u0000\u007F")].join(",")).toBe("0,127");

    expect(() => {
      UsAscii.encode("\u0080");
    }).toThrow("encode error");

  });

  test("UsAscii(string, Object)", () => {
    // fallback
    expect(() => {
      UsAscii.encode("\u0080", {fallback: "exception"});
    }).toThrow("encode error");
    expect([...UsAscii.encode("\u0080", {fallback: "replacement"})].join(",")).toBe("63");

  });

});
