import assert from "node:assert";
import { Uuid } from "../../../node.mjs";

describe("Uuid.prototype.toUrn", () => {
  it("toUrn()", () => {
    const u1c = Uuid.parse("D071CF39-F061-4E34-A462-BC65A425CAFB");
    assert.strictEqual(u1c.toUrn().toString(), "urn:uuid:d071cf39-f061-4e34-a462-bc65a425cafb");

  });

});
