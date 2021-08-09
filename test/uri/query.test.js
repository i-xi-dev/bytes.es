import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.query", () => {
  test("query", () => {
    const u0 = new Uri("http://example.com:8080/");
    const u0b = new Uri("Http://example.COM:8080/");
    const u1 = new Uri("http://example.com:80/hoge");
    const u2 = new Uri("https://example.com:80/hoge");
    const u3 = new Uri("file:///D:/hoge/index.txt");
    const u4 = new Uri("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = new Uri("data:,Hello%2C%20World!");

    expect(u0.query).toBe(null);
    expect(u0b.query).toBe(null);
    expect(u1.query).toBe(null);
    expect(u2.query).toBe(null);
    expect(u3.query).toBe(null);
    expect(u4.query).toBe(null);
    expect(u5.query).toBe(null);
    expect(u6.query).toBe(null);

    expect((new Uri("chrome://hoge")).query).toBe(null);
    expect((new Uri("tel:aaaa")).query).toBe(null);
    expect((new Uri("urn:ietf:rfc:2648")).query).toBe(null);
    expect((new Uri("geo:13.4125,103.8667")).query).toBe(null);

    expect(JSON.stringify([...(new Uri("http://example.com:80/hoge?")).query])).toBe("[]");
    expect(JSON.stringify([...(new Uri("http://example.com:80/hoge?=")).query])).toBe('[["",""]]');
    expect(JSON.stringify([...(new Uri("http://example.com:80/hoge?=&=")).query])).toBe('[["",""],["",""]]');
    expect(JSON.stringify([...(new Uri("http://example.com:80/hoge?foo")).query])).toBe('[["foo",""]]');
    expect(JSON.stringify([...(new Uri("http://example.com:80/hoge?foo=5")).query])).toBe('[["foo","5"]]');
    expect(JSON.stringify([...(new Uri("http://example.com:80/hoge?foo=5#bar")).query])).toBe('[["foo","5"]]');
    expect(JSON.stringify([...(new Uri("http://example.com:80/hoge?foo=5%3D6")).query])).toBe('[["foo","5=6"]]');
    expect(JSON.stringify([...(new Uri("http://example.com:80/hoge?foo=5%3D6&bar=a")).query])).toBe('[["foo","5=6"],["bar","a"]]');
    expect(JSON.stringify([...(new Uri("http://example.com:80/hoge?foo=%E3%81%82")).query])).toBe('[["foo","あ"]]');

  });

});
