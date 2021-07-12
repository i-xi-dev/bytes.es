import { Uuid } from "../../dist/uuid.js";

describe("Uuid.nil", () => {
  test("nil()", () => {
    const u0 = Uuid.nil();

    expect(u0.toString()).toBe("00000000-0000-0000-0000-000000000000");

  });

});
