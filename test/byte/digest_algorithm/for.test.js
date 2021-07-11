import { DigestAlgorithm } from "../../../dist/byte/index.js";

describe("DigestAlgorithm.for", () => {
  test("for(string)", () => {
    expect(typeof DigestAlgorithm.for("sha-256").compute).toBe("function");

    expect(typeof DigestAlgorithm.for("sha-256", {}).compute).toBe("function");

    expect(() => {
      DigestAlgorithm.for("md5");
    }).toThrow("unknown algorithmName");
  });
});
