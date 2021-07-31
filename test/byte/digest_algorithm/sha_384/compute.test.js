import { Format, DigestAlgorithm } from "../../../../dist/byte/index.js";

describe("Sha384.compute", () => {
  const sha384 = DigestAlgorithm.for("SHA-384");

  test("compute(Uint8Array)", async () => {
    const digest = await sha384.compute(Uint8Array.of());
    expect(Format.format(digest, 16)).toBe("38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b");

  });

});
