import assert from "node:assert";
import { DigestAlgorithm } from "../../../../../node.mjs";

describe("DigestAlgorithm.for", () => {

  it("for(string)", async () => {
    assert.throws(() => {
      DigestAlgorithm.for("SHA-25");
    }, {
      message: "name:SHA-25"
    });

  });

});
