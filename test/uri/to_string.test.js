import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.toString", () => {
  test("toString()", () => {
    const u0 = new Uri("http://example.com:8080/");
    const u0b = new Uri("Http://example.COM:8080/");
    const u1 = new Uri("http://example.com:80/hoge");
    const u2 = new Uri("https://example.com:80/hoge");
    const u3 = new Uri("file:///D:/hoge/index.txt");
    const u4 = new Uri("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = new Uri("data:,Hello%2C%20World!");

    expect(u0.toString()).toBe("http://example.com:8080/");
    expect(u0b.toString()).toBe("http://example.com:8080/");
    expect(u1.toString()).toBe("http://example.com/hoge");
    expect(u2.toString()).toBe("https://example.com:80/hoge");
    expect(u3.toString()).toBe("file:///D:/hoge/index.txt");
    expect(u4.toString()).toBe("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    expect(u5.toString()).toBe("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    expect(u6.toString()).toBe("data:,Hello%2C%20World!");

    expect((new Uri("http://example.com:80/hoge?")).toString()).toBe("http://example.com/hoge?");
    expect((new Uri("http://example.com:80/hoge?foo")).toString()).toBe("http://example.com/hoge?foo");
    expect((new Uri("http://example.com:80/hoge?foo=5")).toString()).toBe("http://example.com/hoge?foo=5");
    expect((new Uri("http://example.com:80/hoge#")).toString()).toBe("http://example.com/hoge#");
    expect((new Uri("http://example.com:80/hoge#f<o>o")).toString()).toBe("http://example.com/hoge#f%3Co%3Eo");
    expect((new Uri("http://example.com:80/hoge#foo#5")).toString()).toBe("http://example.com/hoge#foo#5");
    expect((new Uri("http://example.com/hoge")).toString()).toBe("http://example.com/hoge");
    expect((new Uri("http://example.com/hoge/huga")).toString()).toBe("http://example.com/hoge/huga");
    expect((new Uri("http://example.com/hoge/huga/")).toString()).toBe("http://example.com/hoge/huga/");
    expect((new Uri("http://example.com/hoge/huga/../")).toString()).toBe("http://example.com/hoge/");
    expect((new Uri("http://example.com/hoge/huga/./")).toString()).toBe("http://example.com/hoge/huga/");

    expect((new Uri("http://example.com:80/hoge?fo o")).toString()).toBe("http://example.com/hoge?fo%20o");

  });

});
