import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.origin", () => {
  test("origin", () => {
    const u0 = new Uri("http://example.com:8080/");
    const u0b = new Uri("Http://example.COM:8080/");
    const u1 = new Uri("http://example.com:80/hoge");
    const u2 = new Uri("https://example.com:80/hoge");
    const u3 = new Uri("file:///D:/hoge/index.txt");
    const u4 = new Uri("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = new Uri("data:,Hello%2C%20World!");

    expect(u0.origin).toBe("http://example.com:8080");
    expect(u0b.origin).toBe("http://example.com:8080");
    expect(u1.origin).toBe("http://example.com");
    expect(u2.origin).toBe("https://example.com:80");
    expect(u3.origin).toBe(null);
    expect(u4.origin).toBe("https://whatwg.org");
    expect(u5.origin).toBe(null);
    expect(u6.origin).toBe(null);

    expect((new Uri("chrome://hoge")).origin).toBe(null);
    expect((new Uri("tel:aaaa")).origin).toBe(null);
    expect((new Uri("urn:ietf:rfc:2648")).origin).toBe(null);
    expect((new Uri("geo:13.4125,103.8667")).origin).toBe(null);

  });

});
