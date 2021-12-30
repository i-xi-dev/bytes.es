import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.toSha256", () => {
  const bs0 = ByteSequence.allocate(0);

  it("toSha256()", async () => {
    const s1 = await bs0.toSha256();
    assert.strictEqual(s1.format(), "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855");

  });

});
