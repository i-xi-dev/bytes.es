import assert from "node:assert";
import { TextEncoding } from "../../../../node/index.mjs";

describe("TextEncoding.for", () => {
  it("for(string)", async () => {
    assert.throws(() => {
      TextEncoding.for("utf7");
    }, {
      message: "name:utf7"
    });

  });

});
