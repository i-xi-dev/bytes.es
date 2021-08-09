import { Uuid } from "../../dist/uuid.js";

describe("Uuid.prototype.toUuidUrl", () => {
  test("toUuidUrl()", () => {
    const u1c = Uuid.parse("D071CF39-F061-4E34-A462-BC65A425CAFB");
    expect(u1c.toUuidUrl().toString()).toBe("urn:uuid:d071cf39-f061-4e34-a462-bc65a425cafb");

  });

});
