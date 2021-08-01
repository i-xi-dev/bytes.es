import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.withoutFragment", () => {
  test("withoutFragment()", () => {
    const u1 = (new Uri("http://example.com:80/hoge?a=1#")).withoutFragment();
    expect(u1.fragment).toBe(null);
    expect(u1.toString()).toBe("http://example.com/hoge?a=1");

    const u2 = (new Uri("http://example.com:80/hoge#f<o>o")).withoutFragment();
    expect(u2.fragment).toBe(null);
    expect(u2.toString()).toBe("http://example.com/hoge");

    const u3 = (new Uri("http://example.com:80/hoge?a=1#foo#5")).withoutFragment();
    expect(u3.fragment).toBe(null);
    expect(u3.toString()).toBe("http://example.com/hoge?a=1");

    const u4 = (new Uri("http://example.com:80/hoge#foo#5=%3CA")).withoutFragment();
    expect(u4.fragment).toBe(null);
    expect(u4.toString()).toBe("http://example.com/hoge");

    const u5 = (new Uri("http://example.com:80/hoge#foo#5%3DA")).withoutFragment();
    expect(u5.fragment).toBe(null);
    expect(u5.toString()).toBe("http://example.com/hoge");

    const u6 = (new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6")).withoutFragment();
    expect(u6.fragment).toBe(null);
    expect(u6.toString()).toBe("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");

    const u7 = (new Uri("data:,Hello%2C%20World!")).withoutFragment();
    expect(u7.fragment).toBe(null);
    expect(u7.toString()).toBe("data:,Hello%2C%20World!");

  });

});
