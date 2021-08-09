import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.withoutQuery", () => {
  test("withoutQuery()", () => {
    const u1 = (new Uri("http://example.com:80/hoge?a=1#a")).withoutQuery();
    expect(u1.toString()).toBe("http://example.com/hoge#a");

    const u2 = (new Uri("http://example.com:80/hoge?a")).withoutQuery();
    expect(u2.toString()).toBe("http://example.com/hoge");

    const u6 = (new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6")).withoutQuery();
    expect(u6.toString()).toBe("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");

    const u7 = (new Uri("data:,Hello%2C%20World!")).withoutQuery();
    expect(u7.toString()).toBe("data:,Hello%2C%20World!");

  });

});
