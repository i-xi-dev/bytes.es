import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.host", () => {
  test("host", () => {
    const u0 = new Uri("http://example.com:8080/");
    const u0b = new Uri("Http://example.COM:8080/");
    const u1 = new Uri("http://example.com:80/hoge");
    const u2 = new Uri("https://example.com:80/hoge");
    const u3 = new Uri("file:///D:/hoge/index.txt");
    const u4 = new Uri("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = new Uri("data:,Hello%2C%20World!");

    expect(u0.host).toBe("example.com");
    expect(u0b.host).toBe("example.com");
    expect(u1.host).toBe("example.com");
    expect(u2.host).toBe("example.com");
    expect(u3.host).toBe(null);
    expect(u4.host).toBe(null);
    expect(u5.host).toBe(null);
    expect(u6.host).toBe(null);
    expect((new Uri("http://127.0.0.1:8080/")).host).toBe("127.0.0.1");
    expect((new Uri("http://127.0.0.1.:8080/")).host).toBe("127.0.0.1");
    expect((new Uri("http://127:8080/")).host).toBe("0.0.0.127");
    expect((new Uri("http://127.0.0:8080/")).host).toBe("127.0.0.0");
    expect((new Uri("http://127.0:8080/")).host).toBe("127.0.0.0");
    expect((new Uri("http://0x7F.0.0.1:8080/")).host).toBe("127.0.0.1");
    expect((new Uri("http://0x7F000001:8080/")).host).toBe("127.0.0.1");
    expect((new Uri("http://2130706433:8080/")).host).toBe("127.0.0.1");
    expect((new Uri("http://0177.000.000.001:8080/")).host).toBe("127.0.0.1");
    expect((new Uri("http://0177.0X.000.0x1:8080/")).host).toBe("127.0.0.1");
    expect((new Uri("http://[::1]:8080/")).host).toBe("[::1]");

    expect((new Uri("chrome://hoge")).host).toBe("hoge");
    expect((new Uri("tel:aaaa")).host).toBe(null);
    expect((new Uri("urn:ietf:rfc:2648")).host).toBe(null);
    expect((new Uri("geo:13.4125,103.8667")).host).toBe(null);
    expect((new Uri("http://ドメイン名例.JP:8080/")).host).toBe("xn--eckwd4c7cu47r2wf.jp");

  });

});
