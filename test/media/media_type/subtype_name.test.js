import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.prototype.subtypeName", () => {
  test("subtypeName", () => {
    const i0 = MediaType.fromString("text/plain");
    expect(i0.subtypeName).toBe("plain");

    const i0b = MediaType.fromString("text/PLAIN");
    expect(i0b.subtypeName).toBe("plain");

  });

});
