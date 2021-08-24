import assert from "node:assert";
import { Resource } from "../../../node.mjs";

describe("Resource.prototype.toBlob", () => {
  it("toBlob()", async () => {
    const b1 = new Blob([ Uint8Array.of(255,0,1,127) ], { type: "text/plain" });

    const b11 = await Resource.fromBlob(b1);
    const b11b = b11.toBlob();
    const b11r = await b11b.arrayBuffer();
    assert.strictEqual([ ...new Uint8Array(b11r) ].join(","), "255,0,1,127");

  });

});
