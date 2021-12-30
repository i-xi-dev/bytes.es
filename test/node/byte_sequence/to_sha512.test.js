import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.toSha512", () => {
  const bs0 = ByteSequence.allocate(0);

  it("toSha512()", async () => {
    const s1 = await bs0.toSha512();
    assert.strictEqual(s1.format(), "CF83E1357EEFB8BDF1542850D66D8007D620E4050B5715DC83F4A921D36CE9CE47D0D13C5D85F2B0FF8318D2877EEC2F63B931BD47417A81A538327AF927DA3E");

  });

});
