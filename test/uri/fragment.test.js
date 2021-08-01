import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.fragment", () => {
  test("fragment", () => {
    const u0 = new Uri("http://example.com:8080/");
    const u0b = new Uri("Http://example.COM:8080/");
    const u1 = new Uri("http://example.com:80/hoge");
    const u2 = new Uri("https://example.com:80/hoge");
    const u3 = new Uri("file:///D:/hoge/index.txt");
    const u4 = new Uri("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = new Uri("data:,Hello%2C%20World!");

    expect(u0.fragment).toBe(null);
    expect(u0b.fragment).toBe(null);
    expect(u1.fragment).toBe(null);
    expect(u2.fragment).toBe(null);
    expect(u3.fragment).toBe(null);
    expect(u4.fragment).toBe(null);
    expect(u5.fragment).toBe(null);
    expect(u6.fragment).toBe(null);


    expect((new Uri("http://example.com:80/hoge#")).fragment).toBe("");
    expect((new Uri("http://example.com:80/hoge#f<o>o")).fragment).toBe("f<o>o");
    expect((new Uri("http://example.com:80/hoge#foo#5")).fragment).toBe("foo#5");
    expect((new Uri("http://example.com:80/hoge#foo#5=%3CA")).fragment).toBe("foo#5=<A");
    expect((new Uri("http://example.com:80/hoge#foo#5%3DA")).fragment).toBe("foo#5=A");
    expect((new Uri("http://example.com:80/hoge#%E3%81%82")).fragment).toBe("あ");
    expect((new Uri("http://example.com:80/hoge#%20!%22%3C%3E%60%3")).fragment).toBe(" !\"<>`%3");

  });

});
