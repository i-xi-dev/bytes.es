import assert from "node:assert";
import { Uuid } from "../../dist/uuid.js";

describe("Uuid.prototype.toJSON", () => {
  it("toJSON()", () => {
    const u1c = Uuid.parse("D071CF39-F061-4E34-A462-BC65A425CAFB");
    assert.strictEqual(u1c.toJSON(), "d071cf39-f061-4e34-a462-bc65a425cafb");

  });

});
