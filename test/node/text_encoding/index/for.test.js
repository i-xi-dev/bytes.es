import assert from "node:assert";
import { TextEncoding } from "../../../../node.mjs";

describe("TextEncoding.for", () => {
  it("for(string)", async () => {
    assert.throws(() => {
      TextEncoding.for("utf7");
    }, {
      message: "name:utf7"
    });

  });

});
