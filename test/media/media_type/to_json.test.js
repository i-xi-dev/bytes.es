import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.prototype.toJSON", () => {
  test("toJSON()", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.toJSON()).toBe("text/plain");

  });

});
