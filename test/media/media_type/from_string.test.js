import { MediaType } from "../../../dist/media/media_type.js";

describe("MediaType.fromString", () => {
  test("fromString(string)", () => {
    expect(MediaType.fromString("text/plain").toString()).toBe("text/plain");
    expect(MediaType.fromString(" text/plain ").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain;").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ;").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; ").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset ").toString()).toBe("text/plain");
    expect(MediaType.fromString("text/plain ; charset=utf-8 ").toString()).toBe("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=UTF-8").toString()).toBe("text/plain;charset=UTF-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test").toString()).toBe("text/plain;charset=utf-8");
    expect(MediaType.fromString("text/plain ;charset=utf-8; test=test2").toString()).toBe("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2").toString()).toBe("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2").toString()).toBe("text/plain;test=test2");
    expect(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2").toString()).toBe("text/plain;charset=\" utf-8\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2").toString()).toBe("text/plain;charset=utf-8;test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2").toString()).toBe("text/plain;charset=utf-8;test=\"t\\\\est,2\"");
    expect(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2").toString()).toBe("text/plain;charset=\"ut\\\"f-8\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\\ ; test=test2").toString()).toBe("text/plain;charset=\"\\\\\";test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2").toString()).toBe("text/plain;charset=\" ; test=test2\"");
    expect(MediaType.fromString("text/plain ;charset=\" ; test=test2").toString()).toBe("text/plain;charset=\" ; test=test2\"");
    expect(MediaType.fromString("text/plain ;charset=\"\" ; test=test2").toString()).toBe("text/plain;charset=;test=test2");
    expect(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2').toString()).toBe("text/plain;charset=utf-16;test=test2");
    expect(MediaType.fromString("text/plain ;charset=\"\\").toString()).toBe("text/plain;charset=\"\\\\\"");
    expect(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a"').toString()).toBe("text/plain;charset=\"aa\\\\a\\\"a\"");
    expect(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1"').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    expect(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    expect(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    expect(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis").toString()).toBe("text/plain;charset=utf-8;test=test2");

    // expect(MediaType.fromString("text/plain,").toString()).toBe("text/plain");
    // expect(MediaType.fromString(" text/plain ,").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain;,").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ;,").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ; ,").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ; charset,").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ; charset ,").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ; charset=utf-8 ,").toString()).toBe("text/plain;charset=utf-8");
    // expect(MediaType.fromString("text/plain ;charset=UTF-8,").toString()).toBe("text/plain;charset=UTF-8");
    // expect(MediaType.fromString("text/plain ;charset=utf-8;test,").toString()).toBe("text/plain;charset=utf-8");
    // expect(MediaType.fromString("text/plain ;charset=utf-8; test=test2,").toString()).toBe("text/plain;charset=utf-8;test=test2");
    // expect(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2,").toString()).toBe("text/plain;charset=utf-8;test=test2");
    // expect(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2,").toString()).toBe("text/plain;test=test2");
    // expect(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2,").toString()).toBe("text/plain;charset=\" utf-8\";test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2,").toString()).toBe("text/plain;charset=utf-8;test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2,").toString()).toBe("text/plain;charset=utf-8;test=\"t\\\\est\"");
    // expect(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2,").toString()).toBe("text/plain;charset=\"ut\\\"f-8\";test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\\ ; test=test2,").toString()).toBe("text/plain;charset=\"\\\\\";test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2,").toString()).toBe("text/plain;charset=\" ; test=test2,\"");
    // expect(MediaType.fromString("text/plain ;charset=\" ; test=test2,").toString()).toBe("text/plain;charset=\" ; test=test2,\"");
    // expect(MediaType.fromString("text/plain ;charset=\"\" ; test=test2,").toString()).toBe("text/plain;charset=;test=test2");
    // expect(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2,').toString()).toBe("text/plain;charset=utf-16;test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\"\\,").toString()).toBe("text/plain;charset=\",\"");
    // expect(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a",').toString()).toBe("text/plain;charset=\"aa\\\\a\\\"a\"");
    // expect(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1",').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // expect(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a,').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // expect(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a,').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // expect(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis,").toString()).toBe("text/plain;charset=utf-8;test=test2");

    // expect(MediaType.fromString("text/plain,%3C").toString()).toBe("text/plain");
    // expect(MediaType.fromString(" text/plain ,%3C").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain;,%3C").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ;,%3C").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ; ,%3C").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ; charset,%3C").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ; charset ,%3C").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ; charset=utf-8 ,%3C").toString()).toBe("text/plain;charset=utf-8");
    // expect(MediaType.fromString("text/plain ;charset=UTF-8,%3C").toString()).toBe("text/plain;charset=UTF-8");
    // expect(MediaType.fromString("text/plain ;charset=utf-8;test,%3C").toString()).toBe("text/plain;charset=utf-8");
    // expect(MediaType.fromString("text/plain ;charset=utf-8; test=test2,%3C").toString()).toBe("text/plain;charset=utf-8;test=test2");
    // expect(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2,%3C").toString()).toBe("text/plain;charset=utf-8;test=test2");
    // expect(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2,%3C").toString()).toBe("text/plain;test=test2");
    // expect(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2,%3C").toString()).toBe("text/plain;charset=\" utf-8\";test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2,%3C").toString()).toBe("text/plain;charset=utf-8;test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2,%3C").toString()).toBe("text/plain;charset=utf-8;test=\"t\\\\est\"");
    // expect(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2,%3C").toString()).toBe("text/plain;charset=\"ut\\\"f-8\";test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\\ ; test=test2,%3C").toString()).toBe("text/plain;charset=\"\\\\\";test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2,%3C").toString()).toBe("text/plain;charset=\" ; test=test2,%3C\"");
    // expect(MediaType.fromString("text/plain ;charset=\" ; test=test2,%3C").toString()).toBe("text/plain;charset=\" ; test=test2,%3C\"");
    // expect(MediaType.fromString("text/plain ;charset=\"\" ; test=test2,%3C").toString()).toBe("text/plain;charset=;test=test2");
    // expect(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2,%3C').toString()).toBe("text/plain;charset=utf-16;test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\"\\,%3C").toString()).toBe("text/plain;charset=\",%3C\"");
    // expect(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a",%3C').toString()).toBe("text/plain;charset=\"aa\\\\a\\\"a\"");
    // expect(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1",%3C').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // expect(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a,%3C').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // expect(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a,%3C').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // expect(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis,%3C").toString()).toBe("text/plain;charset=utf-8;test=test2");

    // expect(MediaType.fromString("text/plain;base64,").toString()).toBe("text/plain");
    // expect(MediaType.fromString(" text/plain ;base64,").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain;;base64,").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ;;base64,").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ; ;base64,").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ; charset;base64,").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ; charset ;base64,").toString()).toBe("text/plain");
    // expect(MediaType.fromString("text/plain ; charset=utf-8 ;base64,").toString()).toBe("text/plain;charset=utf-8");
    // expect(MediaType.fromString("text/plain ;charset=UTF-8;base64,").toString()).toBe("text/plain;charset=UTF-8");
    // expect(MediaType.fromString("text/plain ;charset=utf-8;test;base64,").toString()).toBe("text/plain;charset=utf-8");
    // expect(MediaType.fromString("text/plain ;charset=utf-8; test=test2;base64,").toString()).toBe("text/plain;charset=utf-8;test=test2");
    // expect(MediaType.fromString("text/plain ;charset=utf-8 ; test=test2;base64,").toString()).toBe("text/plain;charset=utf-8;test=test2");
    // expect(MediaType.fromString("text/plain ;charset =utf-8 ; test=test2;base64,").toString()).toBe("text/plain;test=test2");
    // expect(MediaType.fromString("text/plain ;charset= utf-8 ; test=test2;base64,").toString()).toBe("text/plain;charset=\" utf-8\";test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\"utf-8\" ; test=test2;base64,").toString()).toBe("text/plain;charset=utf-8;test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\"ut\\f-8\" ; test=t\\est,2;base64,").toString()).toBe("text/plain;charset=utf-8;test=\"t\\\\est,2\"");
    // expect(MediaType.fromString("text/plain ;charset=\"ut\\\"f-8\" ; test=test2;base64,").toString()).toBe("text/plain;charset=\"ut\\\"f-8\";test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\\ ; test=test2;base64,").toString()).toBe("text/plain;charset=\"\\\\\";test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\"\\ ; test=test2;base64,").toString()).toBe("text/plain;charset=\" ; test=test2;base64,\"");
    // expect(MediaType.fromString("text/plain ;charset=\" ; test=test2;base64,").toString()).toBe("text/plain;charset=\" ; test=test2;base64,\"");
    // expect(MediaType.fromString("text/plain ;charset=\"\" ; test=test2;base64,").toString()).toBe("text/plain;charset=;test=test2");
    // expect(MediaType.fromString('text/plain ;charset="utf-16" utf-8 ; test=test2;base64,').toString()).toBe("text/plain;charset=utf-16;test=test2");
    // expect(MediaType.fromString("text/plain ;charset=\"\\;base64,").toString()).toBe("text/plain;charset=\";base64,\"");
    // expect(MediaType.fromString('text/plain ;charset="aa\\\\a\\"a";base64,').toString()).toBe("text/plain;charset=\"aa\\\\a\\\"a\"");
    // expect(MediaType.fromString('text/plain ;charset=a;x="http://example.com/x?a=1";base64,').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // expect(MediaType.fromString('text/plain ;x="http://example.com/x?a=1";charset=a;base64,').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // expect(MediaType.fromString('text/plain ; x="http://example.com/x?a=1" ;charset=a;base64,').toString()).toBe("text/plain;charset=a;x=\"http://example.com/x?a=1\"");
    // expect(MediaType.fromString("text/plain ;charset=utf-8;test=test2;charset=shift_jis;base64,").toString()).toBe("text/plain;charset=utf-8;test=test2");

    expect(() => {
      MediaType.fromString("text");
    }).toThrow("type name not found");

    expect(() => {
      MediaType.fromString("text/");
    }).toThrow("subtypeName");

    expect(() => {
      MediaType.fromString("/test");
    }).toThrow("type name not found");

    expect(() => {
      MediaType.fromString("/");
    }).toThrow("type name not found");

    expect(() => {
      MediaType.fromString("");
    }).toThrow("type name not found");

    expect(() => {
      MediaType.fromString("text/t/t");
    }).toThrow("subtypeName");

    expect(() => {
      MediaType.fromString("text/t,t");
    }).toThrow("subtypeName");

  });

});
