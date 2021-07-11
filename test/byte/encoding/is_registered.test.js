import { ByteEncoding } from "../../../dist/byte/index.js";

describe("ByteEncoding.isRegistered", () => {
  test("isRegistered(string)", () => {
    expect(ByteEncoding.isRegistered("base64")).toBe(true);
    expect(ByteEncoding.isRegistered("hoge")).toBe(false);

  });
});
