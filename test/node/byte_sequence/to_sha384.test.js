import assert from "node:assert";
import { ByteSequence } from "../../../node/index.mjs";

describe("ByteSequence.prototype.toSha384", () => {
  const bs0 = ByteSequence.allocate(0);

  it("toSha384()", async () => {
    const s1 = await bs0.toSha384();
    assert.strictEqual(s1.format(), "38B060A751AC96384CD9327EB1B1E36A21FDB71114BE07434C0CC7BF63F6E1DA274EDEBFE76F65FBD51AD2F14898B95B");

  });

});
