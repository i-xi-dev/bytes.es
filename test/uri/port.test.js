import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.port", () => {
  test("port", () => {
    const a0 = new Uri("http://example.com/");
    const u0 = new Uri("http://example.com:8080/");
    const u0b = new Uri("Http://example.COM:8080/");
    const u1 = new Uri("http://example.com:80/hoge");
    const u2 = new Uri("https://example.com:80/hoge");
    const u3 = new Uri("file:///D:/hoge/index.txt");
    const u4 = new Uri("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = new Uri("data:,Hello%2C%20World!");

    expect(a0.port).toBe(80);
    expect(u0.port).toBe(8080);
    expect(u0b.port).toBe(8080);
    expect(u1.port).toBe(80);
    expect(u2.port).toBe(80);
    expect(u3.port).toBe(null);
    expect(u4.port).toBe(null);
    expect(u5.port).toBe(null);
    expect(u6.port).toBe(null);

    expect((new Uri("chrome://hoge")).port).toBe(null);
    expect((new Uri("tel:aaaa")).port).toBe(null);
    expect((new Uri("urn:ietf:rfc:2648")).port).toBe(null);
    expect((new Uri("geo:13.4125,103.8667")).port).toBe(null);

  });

});
