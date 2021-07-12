import { Uuid } from "../../dist/uuid.js";

describe("Uuid.prototype.equals", () => {
  test("equals(string)", () => {
    const u1c = Uuid.parse("D071CF39-F061-4E34-A462-BC65A425CAFB");
    expect(u1c.equals("d071cf39-f061-4e34-a462-bc65a425cafb")).toBe(true);
    expect(u1c.equals("D071CF39-F061-4E34-A462-BC65A425CAFB")).toBe(true);
    expect(u1c.equals("urn:uuid:d071cf39-f061-4e34-a462-bc65a425cafb")).toBe(true);
    expect(u1c.equals("d071cf39-f061-4e34-a462-bc65a425cafc")).toBe(false);
    expect(u1c.equals("d071cf39+f061-4e34-a462-bc65a425cafb")).toBe(false);
    expect(u1c.equals("071cf39-f061-4e34-a462-bc65a425cafb")).toBe(false);
    expect(u1c.equals("ur;:uuid:d071cf39-f061-4e34-a462-bc65a425cafb")).toBe(false);

  });

  test("equals(Uuid)", () => {
    const u1c = Uuid.parse("D071CF39-F061-4E34-A462-BC65A425CAFB");
    expect(u1c.equals(u1c)).toBe(true);
    const u1c2 = Uuid.parse("D071CF39-F061-4E34-A462-BC65A425CAFB");
    expect(u1c.equals(u1c2)).toBe(true);

    const u2 = Uuid.parse("D071CF39-F061-4E34-A462-BC65A425CAFC");
    expect(u1c.equals(u2)).toBe(false);

  });

});
