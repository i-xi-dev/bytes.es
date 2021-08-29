import assert from "node:assert";
import { Uri } from "../../../dist/uri.js";

describe("Uri", () => {
  const u0 = "http://example.com/";

  it("Uri(string)", () => {
    assert.strictEqual((new Uri(u0)).toString(), u0);
    assert.strictEqual((new Uri("http://example.com/?=")).toString(), "http://example.com/?=");

    assert.throws(() => {
      new Uri("");
    }, {
      message: "uri",
    });
    assert.throws(() => {
      new Uri("1");
    }, {
      message: "uri",
    });
    assert.throws(() => {
      new Uri("1.text");
    }, {
      message: "uri",
    });
    assert.throws(() => {
      new Uri("./1.text");
    }, {
      message: "uri",
    });
    assert.throws(() => {
      new Uri("http://");
    }, {
      message: "uri",
    });

    // XXX Node.jsだとnew URL(相対URL)がエラーになるので、相対URLのテストができない

  });

  it("Uri(URL)", () => {
    assert.strictEqual((new Uri(new URL(u0))).toString(), u0);

  });

});
