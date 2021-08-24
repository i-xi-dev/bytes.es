import assert from "node:assert";
import { Uri } from "../../../node.mjs";

describe("Uri.prototype.withFragment", () => {
  it("withFragment(string)", () => {
    const u1 = (new Uri("http://example.com:80/hoge#foo")).withFragment("a");
    assert.strictEqual(u1.fragment, "a");
    assert.strictEqual(u1.toString(), "http://example.com/hoge#a");

    const u2 = (new Uri("http://example.com:80/hoge#foo")).withFragment("#a");
    assert.strictEqual(u2.fragment, "#a");
    assert.strictEqual(u2.toString(), "http://example.com/hoge##a");

    const u3 = (new Uri("http://example.com:80/hoge#foo")).withFragment("a<2");
    assert.strictEqual(u3.fragment, "a<2");
    assert.strictEqual(u3.toString(), "http://example.com/hoge#a%3C2");

    const u4 = (new Uri("http://example.com:80/hoge#foo")).withFragment("");
    assert.strictEqual(u4.fragment, "");
    assert.strictEqual(u4.toString(), "http://example.com/hoge#");

    const u5 = (new Uri("http://example.com:80/hoge#foo")).withFragment("#h#o#g#e");
    assert.strictEqual(u5.fragment, "#h#o#g#e");
    assert.strictEqual(u5.toString(), "http://example.com/hoge##h#o#g#e");

    const u6 = (new Uri("http://example.com:80/hoge#foo")).withFragment("# h\"#<o>#g#`e");
    assert.strictEqual(u6.fragment, "# h\"#<o>#g#`e");
    assert.strictEqual(u6.toString(), "http://example.com/hoge##%20h%22#%3Co%3E#g#%60e");

    const u7 = (new Uri("http://example.com:80/hoge#foo")).withFragment("あ");
    assert.strictEqual(u7.fragment, "あ");
    assert.strictEqual(u7.toString(), "http://example.com/hoge#%E3%81%82");

  });

});
