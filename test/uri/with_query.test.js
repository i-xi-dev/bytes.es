import { Uri } from "../../dist/uri.js";

describe("Uri.prototype.withQuery", () => {
  test("withFragment(Array)", () => {
    const u0 = (new Uri("http://example.com:80/hoge?a=1")).withQuery([]);
    expect(JSON.stringify(u0.query)).toBe('[]');
    expect(u0.toString()).toBe("http://example.com/hoge?");

    const u1 = (new Uri("http://example.com:80/hoge?a=1")).withQuery([["b","2"]]);
    expect(JSON.stringify(u1.query)).toBe('[["b","2"]]');
    expect(u1.toString()).toBe("http://example.com/hoge?b=2");

    const u2 = (new Uri("http://example.com:80/hoge#foo")).withQuery([["b","3"],["c","1"]]);
    expect(JSON.stringify(u2.query)).toBe('[["b","3"],["c","1"]]');
    expect(u2.toString()).toBe("http://example.com/hoge?b=3&c=1#foo");

    const u3 = (new Uri("http://example.com:80/hoge#foo")).withQuery([["b","3"],["b","1"]]);
    expect(JSON.stringify(u3.query)).toBe('[["b","3"],["b","1"]]');
    expect(u3.toString()).toBe("http://example.com/hoge?b=3&b=1#foo");

    const u4 = (new Uri("http://example.com:80/hoge")).withQuery([["b","2=4"]]);
    expect(JSON.stringify(u4.query)).toBe('[["b","2=4"]]');
    expect(u4.toString()).toBe("http://example.com/hoge?b=2%3D4");

    const u5 = (new Uri("http://example.com:80/hoge")).withQuery([["b",""]]);
    expect(JSON.stringify(u5.query)).toBe('[["b",""]]');
    expect(u5.toString()).toBe("http://example.com/hoge?b=");

    const u6 = (new Uri("http://example.com:80/hoge")).withQuery([["b","あ"]]);
    expect(JSON.stringify(u6.query)).toBe('[["b","あ"]]');
    expect(u6.toString()).toBe("http://example.com/hoge?b=%E3%81%82");

    const u7 = (new Uri("http://example.com:80/hoge?a=1")).withQuery([["",""]]);
    expect(JSON.stringify(u7.query)).toBe('[["",""]]');
    expect(u7.toString()).toBe("http://example.com/hoge?=");

  });

});
