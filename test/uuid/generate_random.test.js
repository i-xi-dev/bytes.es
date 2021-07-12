import { Uuid } from "../../dist/uuid.js";

describe("Uuid.generateRandom", () => {
  test("generateRandom()", () => {
    const uuids = [];
    for (let i = 0; i < 100; i++) {
      const uuid = Uuid.generateRandom();
      expect(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid.toString())).toBe(true);

      uuids.push(uuid);
    };
    expect(uuids.length).toBe((new Set(uuids)).size);
  });

});
