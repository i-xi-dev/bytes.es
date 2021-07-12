import { Uuid } from "../../dist/uuid.js";

describe("Uuid.parse", () => {
  test("parse(string)", () => {
    const u0 = Uuid.parse("00000000-0000-0000-0000-000000000000");
    expect(u0.toString()).toBe("00000000-0000-0000-0000-000000000000");

    const u1 = Uuid.parse("d071cf39-f061-4e34-a462-bc65a425cafb");
    expect(u1.toString()).toBe("d071cf39-f061-4e34-a462-bc65a425cafb");

    const u1b = Uuid.parse("urn:uuid:d071cf39-f061-4e34-a462-bc65a425cafb");
    expect(u1b.toString()).toBe("d071cf39-f061-4e34-a462-bc65a425cafb");

    const u1c = Uuid.parse("D071CF39-F061-4E34-A462-BC65A425CAFB");
    expect(u1c.toString()).toBe("d071cf39-f061-4e34-a462-bc65a425cafb");

    const u1d = Uuid.parse("URN:UUID:D071CF39-F061-4E34-A462-BC65A425CAFB");
    expect(u1d.toString()).toBe("d071cf39-f061-4e34-a462-bc65a425cafb");

    expect(() => {
      Uuid.parse("")
    }).toThrow("uuidString");

    expect(() => {
      Uuid.parse("d071cf39-f061-4e34-a462-bc65a425caf")
    }).toThrow("uuidString");

    expect(() => {
      Uuid.parse("d071cf39-f061-4e34-a462-bc65a425cafbb")
    }).toThrow("uuidString");

  });

});
