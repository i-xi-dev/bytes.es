import assert from "node:assert";
import { Uuid } from "../../../node.mjs";

describe("Uuid.prototype.equals", () => {
  it("equals(string)", () => {
    const u1c = Uuid.parse("D071CF39-F061-4E34-A462-BC65A425CAFB");
    assert.strictEqual(u1c.equals("d071cf39-f061-4e34-a462-bc65a425cafb"), true);
    assert.strictEqual(u1c.equals("D071CF39-F061-4E34-A462-BC65A425CAFB"), true);
    assert.strictEqual(u1c.equals("urn:uuid:d071cf39-f061-4e34-a462-bc65a425cafb"), true);
    assert.strictEqual(u1c.equals("d071cf39-f061-4e34-a462-bc65a425cafc"), false);
    assert.strictEqual(u1c.equals("d071cf39+f061-4e34-a462-bc65a425cafb"), false);
    assert.strictEqual(u1c.equals("071cf39-f061-4e34-a462-bc65a425cafb"), false);
    assert.strictEqual(u1c.equals("ur;:uuid:d071cf39-f061-4e34-a462-bc65a425cafb"), false);

  });

  it("equals(Uuid)", () => {
    const u1c = Uuid.parse("D071CF39-F061-4E34-A462-BC65A425CAFB");
    assert.strictEqual(u1c.equals(u1c), true);
    const u1c2 = Uuid.parse("D071CF39-F061-4E34-A462-BC65A425CAFB");
    assert.strictEqual(u1c.equals(u1c2), true);

    const u2 = Uuid.parse("D071CF39-F061-4E34-A462-BC65A425CAFC");
    assert.strictEqual(u1c.equals(u2), false);

    const u3 = Uuid.nil();
    assert.strictEqual(u3.equals(u3), true);
    assert.strictEqual(Uuid.nil().equals(u3), true);
    assert.strictEqual(u3.equals(Uuid.nil()), true);

  });

});
