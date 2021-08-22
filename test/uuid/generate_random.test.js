import assert from "node:assert";
import { Uuid } from "../../dist/uuid.js";

describe("Uuid.generateRandom", () => {
  it("generateRandom()", () => {
    const uuids = [];
    for (let i = 0; i < 100; i++) {
      const uuid = Uuid.generateRandom();
      assert.strictEqual(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid.toString()), true);

      uuids.push(uuid);
    };
    assert.strictEqual(uuids.length, (new Set(uuids)).size);
  });

});
