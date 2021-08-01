import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.withFragment", () => {
  test("withFragment(string)", () => {
    const u1 = (new Uri("http://example.com:80/hoge#foo")).withFragment("a");
    expect(u1.fragment).toBe("a");
    expect(u1.toString()).toBe("http://example.com/hoge#a");

    const u2 = (new Uri("http://example.com:80/hoge#foo")).withFragment("#a");
    expect(u2.fragment).toBe("#a");
    expect(u2.toString()).toBe("http://example.com/hoge##a");

    const u3 = (new Uri("http://example.com:80/hoge#foo")).withFragment("a<2");
    expect(u3.fragment).toBe("a<2");
    expect(u3.toString()).toBe("http://example.com/hoge#a%3C2");

    const u4 = (new Uri("http://example.com:80/hoge#foo")).withFragment("");
    expect(u4.fragment).toBe("");
    expect(u4.toString()).toBe("http://example.com/hoge#");

    const u5 = (new Uri("http://example.com:80/hoge#foo")).withFragment("#h#o#g#e");
    expect(u5.fragment).toBe("#h#o#g#e");
    expect(u5.toString()).toBe("http://example.com/hoge##h#o#g#e");

    const u6 = (new Uri("http://example.com:80/hoge#foo")).withFragment("# h\"#<o>#g#`e");
    expect(u6.fragment).toBe("# h\"#<o>#g#`e");
    expect(u6.toString()).toBe("http://example.com/hoge##%20h%22#%3Co%3E#g#%60e");

    const u7 = (new Uri("http://example.com:80/hoge#foo")).withFragment("あ");
    expect(u7.fragment).toBe("あ");
    expect(u7.toString()).toBe("http://example.com/hoge#%E3%81%82");

  });

});
