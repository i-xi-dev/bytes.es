import assert from "node:assert";
import { Uri } from "../../../node.mjs";

describe("Uri.prototype.origin", () => {
  it("origin", () => {
    const u0 = new Uri("http://example.com:8080/");
    const u0b = new Uri("Http://example.COM:8080/");
    const u1 = new Uri("http://example.com:80/hoge");
    const u2 = new Uri("https://example.com:80/hoge");
    const u3 = new Uri("file:///D:/hoge/index.txt");
    const u4 = new Uri("blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f");
    const u5 = new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");
    const u6 = new Uri("data:,Hello%2C%20World!");

    assert.strictEqual(u0.origin, "http://example.com:8080");
    assert.strictEqual(u0b.origin, "http://example.com:8080");
    assert.strictEqual(u1.origin, "http://example.com");
    assert.strictEqual(u2.origin, "https://example.com:80");
    assert.strictEqual(u3.origin, null);
    assert.strictEqual(u4.origin, "https://whatwg.org");
    assert.strictEqual(u5.origin, null);
    assert.strictEqual(u6.origin, null);

    assert.strictEqual((new Uri("chrome://hoge")).origin, null);
    assert.strictEqual((new Uri("tel:aaaa")).origin, null);
    assert.strictEqual((new Uri("urn:ietf:rfc:2648")).origin, null);
    assert.strictEqual((new Uri("geo:13.4125,103.8667")).origin, null);

  });

});
