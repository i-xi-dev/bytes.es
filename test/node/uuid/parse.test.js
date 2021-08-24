import assert from "node:assert";
import { Uuid } from "../../../node.mjs";

describe("Uuid.parse", () => {
  it("parse(string)", () => {
    const u0 = Uuid.parse("00000000-0000-0000-0000-000000000000");
    assert.strictEqual(u0.toString(), "00000000-0000-0000-0000-000000000000");

    const u1 = Uuid.parse("d071cf39-f061-4e34-a462-bc65a425cafb");
    assert.strictEqual(u1.toString(), "d071cf39-f061-4e34-a462-bc65a425cafb");

    const u1b = Uuid.parse("urn:uuid:d071cf39-f061-4e34-a462-bc65a425cafb");
    assert.strictEqual(u1b.toString(), "d071cf39-f061-4e34-a462-bc65a425cafb");

    const u1c = Uuid.parse("D071CF39-F061-4E34-A462-BC65A425CAFB");
    assert.strictEqual(u1c.toString(), "d071cf39-f061-4e34-a462-bc65a425cafb");

    const u1d = Uuid.parse("URN:UUID:D071CF39-F061-4E34-A462-BC65A425CAFB");
    assert.strictEqual(u1d.toString(), "d071cf39-f061-4e34-a462-bc65a425cafb");

    assert.throws(() => {
      Uuid.parse("")
    }, {
      message: "uuidString"
    });

    assert.throws(() => {
      Uuid.parse("d071cf39-f061-4e34-a462-bc65a425caf")
    }, {
      message: "uuidString"
    });

    assert.throws(() => {
      Uuid.parse("d071cf39-f061-4e34-a462-bc65a425cafbb")
    }, {
      message: "uuidString"
    });

  });

});
