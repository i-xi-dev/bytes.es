import assert from "node:assert";
import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.fromString", () => {
  it("fromString(string)", () => {
    assert.strictEqual(MediaType.fromString("text/plain").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString(" text/plain ").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain;").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ;").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; ").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset ").toString(), "text/plain");
    assert.strictEqual(MediaType.fromString("text/plain ; charset=utf-8 ").toString(), "text/plain;charset=utf-8");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=UTF-8").toString(), "text/plain;charset=UTF-8");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test").toString(), "text/plain;charset=utf-8");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8; test=test2").toString(), "text/plain;charset=utf-8;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2").toString(), "text/plain;charset=utf-8;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2").toString(), "text/plain;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2").toString(), "text/plain;charset=\" utf-8\";test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2").toString(), "text/plain;charset=utf-8;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2").toString(), "text/plain;charset=utf-8;test=\"t\\\\est,2\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2").toString(), "text/plain;charset=\"ut\\\"f-8\";test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\\ ; test=test2").toString(), "text/plain;charset=\"\\\\\";test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2").toString(), "text/plain;charset=\" ; test=test2\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\" ; test=test2").toString(), "text/plain;charset=\" ; test=test2\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\" ; test=test2").toString(), "text/plain;charset=;test=test2");
    assert.strictEqual(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2').toString(), "text/plain;charset=utf-16;test=test2");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\").toString(), "text/plain;charset=\"\\\\\"");
    assert.strictEqual(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a"').toString(), "text/plain;charset=\"aa\\\\a\\\"a\"");
    assert.strictEqual(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1"').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    assert.strictEqual(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    assert.strictEqual(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis").toString(), "text/plain;charset=utf-8;test=test2");

    // assert.strictEqual(MediaType.fromString("text/plain,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString(" text/plain ,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain;,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ;,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ; ,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ; charset,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ; charset ,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ; charset=utf-8 ,").toString(), "text/plain;charset=utf-8");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=UTF-8,").toString(), "text/plain;charset=UTF-8");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test,").toString(), "text/plain;charset=utf-8");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8; test=test2,").toString(), "text/plain;charset=utf-8;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2,").toString(), "text/plain;charset=utf-8;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2,").toString(), "text/plain;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2,").toString(), "text/plain;charset=\" utf-8\";test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2,").toString(), "text/plain;charset=utf-8;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2,").toString(), "text/plain;charset=utf-8;test=\"t\\\\est\"");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2,").toString(), "text/plain;charset=\"ut\\\"f-8\";test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\\ ; test=test2,").toString(), "text/plain;charset=\"\\\\\";test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2,").toString(), "text/plain;charset=\" ; test=test2,\"");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\" ; test=test2,").toString(), "text/plain;charset=\" ; test=test2,\"");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\" ; test=test2,").toString(), "text/plain;charset=;test=test2");
    // assert.strictEqual(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2,').toString(), "text/plain;charset=utf-16;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\,").toString(), "text/plain;charset=\",\"");
    // assert.strictEqual(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a",').toString(), "text/plain;charset=\"aa\\\\a\\\"a\"");
    // assert.strictEqual(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1",').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // assert.strictEqual(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a,').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // assert.strictEqual(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a,').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis,").toString(), "text/plain;charset=utf-8;test=test2");

    // assert.strictEqual(MediaType.fromString("text/plain,%3C").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString(" text/plain ,%3C").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain;,%3C").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ;,%3C").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ; ,%3C").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ; charset,%3C").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ; charset ,%3C").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ; charset=utf-8 ,%3C").toString(), "text/plain;charset=utf-8");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=UTF-8,%3C").toString(), "text/plain;charset=UTF-8");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test,%3C").toString(), "text/plain;charset=utf-8");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8; test=test2,%3C").toString(), "text/plain;charset=utf-8;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2,%3C").toString(), "text/plain;charset=utf-8;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2,%3C").toString(), "text/plain;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2,%3C").toString(), "text/plain;charset=\" utf-8\";test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2,%3C").toString(), "text/plain;charset=utf-8;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2,%3C").toString(), "text/plain;charset=utf-8;test=\"t\\\\est\"");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2,%3C").toString(), "text/plain;charset=\"ut\\\"f-8\";test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\\ ; test=test2,%3C").toString(), "text/plain;charset=\"\\\\\";test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2,%3C").toString(), "text/plain;charset=\" ; test=test2,%3C\"");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\" ; test=test2,%3C").toString(), "text/plain;charset=\" ; test=test2,%3C\"");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\" ; test=test2,%3C").toString(), "text/plain;charset=;test=test2");
    // assert.strictEqual(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2,%3C').toString(), "text/plain;charset=utf-16;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\,%3C").toString(), "text/plain;charset=\",%3C\"");
    // assert.strictEqual(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a",%3C').toString(), "text/plain;charset=\"aa\\\\a\\\"a\"");
    // assert.strictEqual(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1",%3C').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // assert.strictEqual(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a,%3C').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // assert.strictEqual(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a,%3C').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis,%3C").toString(), "text/plain;charset=utf-8;test=test2");

    // assert.strictEqual(MediaType.fromString("text/plain;base64,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString(" text/plain ;base64,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain;;base64,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ;;base64,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ; ;base64,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ; charset;base64,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ; charset ;base64,").toString(), "text/plain");
    // assert.strictEqual(MediaType.fromString("text/plain ; charset=utf-8 ;base64,").toString(), "text/plain;charset=utf-8");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=UTF-8;base64,").toString(), "text/plain;charset=UTF-8");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test;base64,").toString(), "text/plain;charset=utf-8");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8; test=test2;base64,").toString(), "text/plain;charset=utf-8;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2;base64,").toString(), "text/plain;charset=utf-8;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2;base64,").toString(), "text/plain;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2;base64,").toString(), "text/plain;charset=\" utf-8\";test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2;base64,").toString(), "text/plain;charset=utf-8;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2;base64,").toString(), "text/plain;charset=utf-8;test=\"t\\\\est,2\"");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2;base64,").toString(), "text/plain;charset=\"ut\\\"f-8\";test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\\ ; test=test2;base64,").toString(), "text/plain;charset=\"\\\\\";test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2;base64,").toString(), "text/plain;charset=\" ; test=test2;base64,\"");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\" ; test=test2;base64,").toString(), "text/plain;charset=\" ; test=test2;base64,\"");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\" ; test=test2;base64,").toString(), "text/plain;charset=;test=test2");
    // assert.strictEqual(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2;base64,').toString(), "text/plain;charset=utf-16;test=test2");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=\"\\;base64,").toString(), "text/plain;charset=\";base64,\"");
    // assert.strictEqual(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a";base64,').toString(), "text/plain;charset=\"aa\\\\a\\\"a\"");
    // assert.strictEqual(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1";base64,').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // assert.strictEqual(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a;base64,').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // assert.strictEqual(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a;base64,').toString(), "text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // assert.strictEqual(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis;base64,").toString(), "text/plain;charset=utf-8;test=test2");

    assert.throws(() => {
      MediaType.fromString("text");
    }, {
      message: "type name not found"
    });

    assert.throws(() => {
      MediaType.fromString("text/");
    }, {
      message: "subtypeName"
    });

    assert.throws(() => {
      MediaType.fromString("/test");
    }, {
      message: "type name not found"
    });

    assert.throws(() => {
      MediaType.fromString("/");
    }, {
      message: "type name not found"
    });

    assert.throws(() => {
      MediaType.fromString("");
    }, {
      message: "type name not found"
    });

    assert.throws(() => {
      MediaType.fromString("text/t/t");
    }, {
      message: "subtypeName"
    });

    assert.throws(() => {
      MediaType.fromString("text/t,t");
    }, {
      message: "subtypeName"
    });

  });

});
