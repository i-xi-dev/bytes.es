import { Byte } from "../../../dist/byte/index.js";

describe("DigestAlgorithm.isRegistered", () => {
  test("isRegistered(string)", () => {
    expect(Byte.DigestAlgorithm.isRegistered("sha-256")).toBe(true);
    expect(Byte.DigestAlgorithm.isRegistered("hoge")).toBe(false);

  });
});
