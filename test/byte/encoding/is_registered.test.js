import { Byte } from "../../../dist/byte/index.js";

describe("ByteEncoding.isRegistered", () => {
  test("isRegistered(string)", () => {
    expect(Byte.Encoding.isRegistered("base64")).toBe(true);
    expect(Byte.Encoding.isRegistered("hoge")).toBe(false);

  });
});
