import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.toJSON", () => {
  test("toJSON()", () => {
    const u0 = new Uri("http://example.com:8080/");

    expect(u0.toJSON()).toBe("http://example.com:8080/");

  });

});
