import { Byte } from "../../../dist/byte/index.js";
import { Base64Encoding } from "../../../dist/byte/encoding/base64.js";

describe("ByteEncoding.for", () => {
  test("for(string)", () => {
    expect(Byte.Encoding.for("base64") instanceof Base64Encoding).toBe(true);

    expect(() => {
      Byte.Encoding.for("base32");
    }).toThrow("unknown encodingName");
  });
});
