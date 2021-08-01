import { Uri } from "../../dist/uri.js";

describe("Uri", () => {
  const u0 = "http://example.com/";

  test("Uri(string)", () => {
    expect((new Uri(u0)).toString()).toBe(u0);
    expect((new Uri("http://example.com/?=")).toString()).toBe("http://example.com/?=");

    expect(() => {
      new Uri("");
    }).toThrow("uri");
    expect(() => {
      new Uri("1");
    }).toThrow("uri");
    expect(() => {
      new Uri("1.text");
    }).toThrow("uri");
    expect(() => {
      new Uri("./1.text");
    }).toThrow("uri");
    expect(() => {
      new Uri("http://");
    }).toThrow("uri");

    // XXX Node.jsだとnew URL(相対URL)がエラーになるので、相対URLのテストができない

  });

  test("Uri(URL)", () => {
    expect((new Uri(new URL(u0))).toString()).toBe(u0);

  });

});
