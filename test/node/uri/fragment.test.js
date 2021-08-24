import assert from "node:assert";
import { Uri } from "../../../node.mjs";

describe("Uri.prototype.fragment", () => {
  it("fragment", () => {
    const u0 = new Uri("http://example.com:8080/");
    const u0b = new Uri("Http://example.COM:8080/");
    const u1 = new Uri("http://example.com:80/hoge");
    const u2 = new Uri("https://example.com:80/hoge");
    const u3 = new Uri("file:///D:/hoge/index.txt");
    const u4 = new Uri("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = new Uri("data:,Hello%2C%20World!");

    assert.strictEqual(u0.fragment, null);
    assert.strictEqual(u0b.fragment, null);
    assert.strictEqual(u1.fragment, null);
    assert.strictEqual(u2.fragment, null);
    assert.strictEqual(u3.fragment, null);
    assert.strictEqual(u4.fragment, null);
    assert.strictEqual(u5.fragment, null);
    assert.strictEqual(u6.fragment, null);


    assert.strictEqual((new Uri("http://example.com:80/hoge#")).fragment, "");
    assert.strictEqual((new Uri("http://example.com:80/hoge#f<o>o")).fragment, "f<o>o");
    assert.strictEqual((new Uri("http://example.com:80/hoge#foo#5")).fragment, "foo#5");
    assert.strictEqual((new Uri("http://example.com:80/hoge#foo#5=%3CA")).fragment, "foo#5=<A");
    assert.strictEqual((new Uri("http://example.com:80/hoge#foo#5%3DA")).fragment, "foo#5=A");
    assert.strictEqual((new Uri("http://example.com:80/hoge#%E3%81%82")).fragment, "あ");
    assert.strictEqual((new Uri("http://example.com:80/hoge#%20!%22%3C%3E%60%3")).fragment, " !\"<>`%3");

  });

});
