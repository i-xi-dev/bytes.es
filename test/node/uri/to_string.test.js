import assert from "node:assert";
import { Uri } from "../../../node.mjs";

describe("Uri.prototype.toString", () => {
  it("toString()", () => {
    const u0 = new Uri("http://example.com:8080/");
    const u0b = new Uri("Http://example.COM:8080/");
    const u1 = new Uri("http://example.com:80/hoge");
    const u2 = new Uri("https://example.com:80/hoge");
    const u3 = new Uri("file:///D:/hoge/index.txt");
    const u4 = new Uri("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = new Uri("data:,Hello%2C%20World!");

    assert.strictEqual(u0.toString(), "http://example.com:8080/");
    assert.strictEqual(u0b.toString(), "http://example.com:8080/");
    assert.strictEqual(u1.toString(), "http://example.com/hoge");
    assert.strictEqual(u2.toString(), "https://example.com:80/hoge");
    assert.strictEqual(u3.toString(), "file:///D:/hoge/index.txt");
    assert.strictEqual(u4.toString(), "blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    assert.strictEqual(u5.toString(), "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    assert.strictEqual(u6.toString(), "data:,Hello%2C%20World!");

    assert.strictEqual((new Uri("http://example.com:80/hoge?")).toString(), "http://example.com/hoge?");
    assert.strictEqual((new Uri("http://example.com:80/hoge?foo")).toString(), "http://example.com/hoge?foo");
    assert.strictEqual((new Uri("http://example.com:80/hoge?foo=5")).toString(), "http://example.com/hoge?foo=5");
    assert.strictEqual((new Uri("http://example.com:80/hoge#")).toString(), "http://example.com/hoge#");
    assert.strictEqual((new Uri("http://example.com:80/hoge#f<o>o")).toString(), "http://example.com/hoge#f%3Co%3Eo");
    assert.strictEqual((new Uri("http://example.com:80/hoge#foo#5")).toString(), "http://example.com/hoge#foo#5");
    assert.strictEqual((new Uri("http://example.com/hoge")).toString(), "http://example.com/hoge");
    assert.strictEqual((new Uri("http://example.com/hoge/huga")).toString(), "http://example.com/hoge/huga");
    assert.strictEqual((new Uri("http://example.com/hoge/huga/")).toString(), "http://example.com/hoge/huga/");
    assert.strictEqual((new Uri("http://example.com/hoge/huga/../")).toString(), "http://example.com/hoge/");
    assert.strictEqual((new Uri("http://example.com/hoge/huga/./")).toString(), "http://example.com/hoge/huga/");

    assert.strictEqual((new Uri("http://example.com:80/hoge?fo o")).toString(), "http://example.com/hoge?fo%20o");

  });

});
