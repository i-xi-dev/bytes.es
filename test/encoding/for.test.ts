import { Byte } from "../../src/index";
import { Base64Encoding } from "../../src/encoding/base64";

describe("ByteEncoding.for", (): void => {
  test("for(string)", (): void => {
    expect(Byte.Encoding.for("base64") instanceof Base64Encoding).toBe(true);

    expect(() => {
      Byte.Encoding.for("base32");
    }).toThrow("unknown encodingName");
  });
});
