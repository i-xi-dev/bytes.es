import assert from "node:assert";
import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.withoutQuery", () => {
  it("withoutQuery()", () => {
    const u1 = (new Uri("http://example.com:80/hoge?a=1#a")).withoutQuery();
    assert.strictEqual(u1.toString(), "http://example.com/hoge#a");

    const u2 = (new Uri("http://example.com:80/hoge?a")).withoutQuery();
    assert.strictEqual(u2.toString(), "http://example.com/hoge");

    const u6 = (new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6")).withoutQuery();
    assert.strictEqual(u6.toString(), "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");

    const u7 = (new Uri("data:,Hello%2C%20World!")).withoutQuery();
    assert.strictEqual(u7.toString(), "data:,Hello%2C%20World!");

  });

});
