import assert from "node:assert";
import { Uuid } from "../../dist/uuid.js";

describe("Uuid.nil", () => {
  it("nil()", () => {
    const u0 = Uuid.nil();

    assert.strictEqual(u0.toString(), "00000000-0000-0000-0000-000000000000");

  });

});
