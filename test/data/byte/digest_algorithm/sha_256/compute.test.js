import { Format, Sha256 } from "../../../../../dist/data/byte/index.js";

describe("Sha256.compute", () => {
  test("compute(Uint8Array)", async () => {
    const digest = await Sha256.compute(Uint8Array.of());
    expect(Format.format(digest, 16)).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");

  });

});
