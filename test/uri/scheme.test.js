import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.scheme", () => {
  test("scheme", () => {
    const u0 = new Uri("http://example.com:8080/");
    const u0b = new Uri("Http://example.COM:8080/");
    const u1 = new Uri("http://example.com:80/hoge");
    const u2 = new Uri("https://example.com:80/hoge");
    const u3 = new Uri("file:///D:/hoge/index.txt");
    const u4 = new Uri("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = new Uri("data:,Hello%2C%20World!");

    expect(u0.scheme).toBe("http");
    expect(u0b.scheme).toBe("http");
    expect(u1.scheme).toBe("http");
    expect(u2.scheme).toBe("https");
    expect(u3.scheme).toBe("file");
    expect(u4.scheme).toBe("blob");
    expect(u5.scheme).toBe("urn");
    expect(u6.scheme).toBe("data");

    expect((new Uri("chrome://hoge")).scheme).toBe("chrome");
    expect((new Uri("tel:aaaa")).scheme).toBe("tel");
    expect((new Uri("urn:ietf:rfc:2648")).scheme).toBe("urn");
    expect((new Uri("geo:13.4125,103.8667")).scheme).toBe("geo");

  });

});
