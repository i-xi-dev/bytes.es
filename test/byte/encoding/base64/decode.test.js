import assert from "node:assert";
import { webcrypto as crypto } from "node:crypto";
import { Base64 } from "../../../../dist/byte/index.js";

describe("Base64.decode", () => {
  it("decode(string)", () => {
    const decoded11 = Base64.decode("");
    assert.strictEqual(JSON.stringify([...decoded11]), "[]");
    const decoded12 = Base64.decode("AwIBAP/+/fw=");
    assert.strictEqual(JSON.stringify([...decoded12]), "[3,2,1,0,255,254,253,252]");

    assert.throws(() => {
      Base64.decode("あ");
    }, {
      message: "decode error (1)",
    });
    assert.throws(() => {
      Base64.decode("AwIBAP_-_fw=");
    }, {
      message: "decode error (1)",
    });
    assert.throws(() => {
      Base64.decode("AwIBAP/+/fw");
    }, {
      message: "decode error (2)",
    });
    assert.throws(() => {
      Base64.decode("=AwIBAP/+/fw");
    }, {
      message: "decode error (1)",
    });
    assert.throws(() => {
      Base64.decode("=");
    }, {
      message: "decode error (1)",
    });
    assert.throws(() => {
      Base64.decode("AwIBAP/+/fw,");
    }, {
      message: "decode error (1)",
    });

  });

  it("decode(string, Object)", () => {
    const decoded22 = Base64.decode("AwIBAP_-_fw=", {_62ndChar:"-", _63rdChar:"_"});
    assert.strictEqual(JSON.stringify([...decoded22]), "[3,2,1,0,255,254,253,252]");

    const decoded32 = Base64.decode("AwIBAP/+/fw", {usePadding:false});
    assert.strictEqual(JSON.stringify([...decoded32]), "[3,2,1,0,255,254,253,252]");

    const decoded42 = Base64.decode("AwIBAP_-_fw", {_62ndChar:"-", _63rdChar:"_", usePadding:false});
    assert.strictEqual(JSON.stringify([...decoded42]), "[3,2,1,0,255,254,253,252]");

    assert.strictEqual(Buffer.from("AwIBAP/+/fw=", "base64").toJSON().data.join(","), "3,2,1,0,255,254,253,252");

    const r1 = crypto.getRandomValues(new Uint8Array(256));
    const r2 = crypto.getRandomValues(new Uint8Array(255));
    const r3 = crypto.getRandomValues(new Uint8Array(254));
    const r4 = crypto.getRandomValues(new Uint8Array(253));
    const r5 = crypto.getRandomValues(new Uint8Array(252));
    const r6 = crypto.getRandomValues(new Uint8Array(251));
    const r7 = crypto.getRandomValues(new Uint8Array(250));
    const r8 = crypto.getRandomValues(new Uint8Array(249));
    const r9 = crypto.getRandomValues(new Uint8Array(248));

    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r1).toString('base64'))).join(","), Array.from(r1).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r2).toString('base64'))).join(","), Array.from(r2).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r3).toString('base64'))).join(","), Array.from(r3).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r4).toString('base64'))).join(","), Array.from(r4).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r5).toString('base64'))).join(","), Array.from(r5).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r6).toString('base64'))).join(","), Array.from(r6).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r7).toString('base64'))).join(","), Array.from(r7).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r8).toString('base64'))).join(","), Array.from(r8).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r9).toString('base64'))).join(","), Array.from(r9).join(","));

    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r1).toString('base64').replace(/=*$/, ""), {usePadding:false})).join(","), Array.from(r1).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r2).toString('base64').replace(/=*$/, ""), {usePadding:false})).join(","), Array.from(r2).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r3).toString('base64').replace(/=*$/, ""), {usePadding:false})).join(","), Array.from(r3).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r4).toString('base64').replace(/=*$/, ""), {usePadding:false})).join(","), Array.from(r4).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r5).toString('base64').replace(/=*$/, ""), {usePadding:false})).join(","), Array.from(r5).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r6).toString('base64').replace(/=*$/, ""), {usePadding:false})).join(","), Array.from(r6).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r7).toString('base64').replace(/=*$/, ""), {usePadding:false})).join(","), Array.from(r7).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r8).toString('base64').replace(/=*$/, ""), {usePadding:false})).join(","), Array.from(r8).join(","));
    assert.strictEqual(Array.from(Base64.decode(Buffer.from(r9).toString('base64').replace(/=*$/, ""), {usePadding:false})).join(","), Array.from(r9).join(","));

    assert.throws(() => {
      Base64.decode("AwIBAP/+/fw=", {usePadding:false});
    }, {
      message: "decode error (1)",
    });

    const decoded52 = Base64.decode("AwIBAP/+/fw=", { forgiving: true });
    assert.strictEqual(JSON.stringify([...decoded52]), "[3,2,1,0,255,254,253,252]");
    const decoded53 = Base64.decode("AwIBAP/+/fw=", { forgiving: false });
    assert.strictEqual(JSON.stringify([...decoded53]), "[3,2,1,0,255,254,253,252]");
    const decoded54 = Base64.decode(" AwIB AP/+/fw= ", { forgiving: true });
    assert.strictEqual(JSON.stringify([...decoded54]), "[3,2,1,0,255,254,253,252]");
    const decoded55 = Base64.decode("AwIBAP/+/fw", { forgiving: true });
    assert.strictEqual(JSON.stringify([...decoded55]), "[3,2,1,0,255,254,253,252]");

    assert.throws(() => {
      Base64.decode("AwIあAP/+/fw", { forgiving: true });
    }, {
      message: "decode error (1)",
    });
    assert.throws(() => {
      Base64.decode("AAAAA", { forgiving: true });
    }, {
      message: "forgiving decode error",
    });

  });
});
