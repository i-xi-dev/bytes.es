import assert from "node:assert";
import { Uri } from "../../../node.mjs";

describe("Uri.prototype.toJSON", () => {
  it("toJSON()", () => {
    const u0 = new Uri("http://example.com:8080/");

    assert.strictEqual(u0.toJSON(), "http://example.com:8080/");

  });

});
