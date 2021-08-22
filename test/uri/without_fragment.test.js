import assert from "node:assert";
import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.withoutFragment", () => {
  it("withoutFragment()", () => {
    const u1 = (new Uri("http://example.com:80/hoge?a=1#")).withoutFragment();
    assert.strictEqual(u1.fragment, null);
    assert.strictEqual(u1.toString(), "http://example.com/hoge?a=1");

    const u2 = (new Uri("http://example.com:80/hoge#f<o>o")).withoutFragment();
    assert.strictEqual(u2.fragment, null);
    assert.strictEqual(u2.toString(), "http://example.com/hoge");

    const u3 = (new Uri("http://example.com:80/hoge?a=1#foo#5")).withoutFragment();
    assert.strictEqual(u3.fragment, null);
    assert.strictEqual(u3.toString(), "http://example.com/hoge?a=1");

    const u4 = (new Uri("http://example.com:80/hoge#foo#5=%3CA")).withoutFragment();
    assert.strictEqual(u4.fragment, null);
    assert.strictEqual(u4.toString(), "http://example.com/hoge");

    const u5 = (new Uri("http://example.com:80/hoge#foo#5%3DA")).withoutFragment();
    assert.strictEqual(u5.fragment, null);
    assert.strictEqual(u5.toString(), "http://example.com/hoge");

    const u6 = (new Uri("urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6")).withoutFragment();
    assert.strictEqual(u6.fragment, null);
    assert.strictEqual(u6.toString(), "urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6");

    const u7 = (new Uri("data:,Hello%2C%20World!")).withoutFragment();
    assert.strictEqual(u7.fragment, null);
    assert.strictEqual(u7.toString(), "data:,Hello%2C%20World!");

  });

});
