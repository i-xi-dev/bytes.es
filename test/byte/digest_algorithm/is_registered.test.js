import { DigestAlgorithm } from "../../../dist/byte/index.js";

describe("DigestAlgorithm.isRegistered", () => {
  test("isRegistered(string)", () => {
    expect(DigestAlgorithm.isRegistered("sha-256")).toBe(true);
    expect(DigestAlgorithm.isRegistered("hoge")).toBe(false);

  });
});
