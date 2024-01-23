import { ByteSequence } from "https://www.unpkg.com/@i-xi-dev/bytes@4.3.0/esm/mod.js";
// https://cdn.skypack.dev/@i-xi-dev/bytes@4.3.0

const i1 = document.getElementById("i1");
const a1 = document.getElementById("a1");
const o1 = document.getElementById("o1");
const o1_2 = document.getElementById("o1_2");

const a2_1 = document.getElementById("a2_1");
const o2_1 = document.getElementById("o2_1");
const a2_2 = document.getElementById("a2_2");
const o2_2 = document.getElementById("o2_2");
const a2_3 = document.getElementById("a2_3");
const o2_3 = document.getElementById("o2_3");
const a2_x1 = document.getElementById("a2_x1");
const o2_x1 = document.getElementById("o2_x1");
const a2_x2 = document.getElementById("a2_x2");
const o2_x2 = document.getElementById("o2_x2");
const a2_4 = document.getElementById("a2_4");
const o2_4 = document.getElementById("o2_4");
const a2_5 = document.getElementById("a2_5");
const o2_5 = document.getElementById("o2_5");
const a2_6 = document.getElementById("a2_6");
const o2_6 = document.getElementById("o2_6");
const a2_7 = document.getElementById("a2_7");
const o2_7a = document.getElementById("o2_7a");
const o2_7b = document.getElementById("o2_7b");
const a2_8 = document.getElementById("a2_8");
const o2_8 = document.getElementById("o2_8");

const ip11 = document.getElementById("ip11");
const ip12 = document.getElementById("ip12");
const ip21 = document.getElementById("ip21");
const ip22 = document.getElementById("ip22");

const store = new WeakMap();

a1.addEventListener("click", async () => {
  let bytes = ByteSequence.of();
  if (i1.type === "file") {
    const file = i1.files[0];
    if (file) {
      bytes = ByteSequence.from(new Uint8Array(await file.arrayBuffer()));
    }
  } else {
    bytes = ByteSequence.fromText(i1.value);
  }

  store.set(o1, bytes);
  o1.value = bytes.format({ separator: " " });
  o1_2.value = bytes.byteLength;
}, { passive: true });

a2_1.addEventListener("click", async () => {
  const bytes = store.get(o1);
  if (!bytes) {
    return;
  }

  o2_1.value = await bytes.toSha256Digest();
}, { passive: true });

a2_2.addEventListener("click", async () => {
  const bytes = store.get(o1);
  if (!bytes) {
    return;
  }

  o2_2.value = await bytes.toSha384Digest();
}, { passive: true });

a2_3.addEventListener("click", async () => {
  const bytes = store.get(o1);
  if (!bytes) {
    return;
  }

  o2_3.value = await bytes.toSha512Digest();
}, { passive: true });

a2_x1.addEventListener("click", async () => {
  const bytes = store.get(o1);
  if (!bytes) {
    return;
  }

  o2_x1.value = await bytes.toSha1Digest();
}, { passive: true });

a2_x2.addEventListener("click", async () => {
  const bytes = store.get(o1);
  if (!bytes) {
    return;
  }

  o2_x2.value = await bytes.toMd5Digest();
}, { passive: true });

a2_4.addEventListener("click", () => {
  const bytes = store.get(o1);
  if (!bytes) {
    return;
  }

  const tableLastChars = ip12.value.split("");
  const options = {
    tableLastChars,
    noPadding: (ip11.checked !== true),
    paddingChar: "=",
  };
  o2_4.value = bytes.toBase64Encoded(options);
}, { passive: true });

a2_5.addEventListener("click", () => {
  const bytes = store.get(o1);
  if (!bytes) {
    return;
  }

  let encodeSet;
  switch (ip21.value) {
    case "fragment":
      encodeSet = [0x20, 0x22, 0x3C, 0x3E, 0x60];
      break;
    case "query":
      encodeSet = [0x20, 0x22, 0x23, 0x3C, 0x3E];
      break;
    case "special-query":
      encodeSet = [0x20, 0x22, 0x23, 0x27, 0x3C, 0x3E];
      break;
    case "path":
      encodeSet = [0x20, 0x22, 0x23, 0x3C, 0x3E, 0x3F, 0x60, 0x7B, 0x7D];
      break;
    case "userinfo":
      encodeSet = [
        0x20,
        0x22,
        0x23,
        0x2F,
        0x3A,
        0x3B,
        0x3C,
        0x3D,
        0x3E,
        0x3F,
        0x40,
        0x5B,
        0x5C,
        0x5D,
        0x5E,
        0x60,
        0x7B,
        0x7C,
        0x7D,
      ];
      break;
    case "component":
      encodeSet = [
        0x20,
        0x22,
        0x23,
        0x24,
        0x26,
        0x2B,
        0x2C,
        0x2F,
        0x3A,
        0x3B,
        0x3C,
        0x3D,
        0x3E,
        0x3F,
        0x40,
        0x5B,
        0x5C,
        0x5D,
        0x5E,
        0x60,
        0x7B,
        0x7C,
        0x7D,
      ];
      break;
    case "form-urlencoded":
      encodeSet = [
        0x20,
        0x21,
        0x22,
        0x23,
        0x24,
        0x26,
        0x27,
        0x28,
        0x29,
        0x2B,
        0x2C,
        0x2F,
        0x3A,
        0x3B,
        0x3C,
        0x3D,
        0x3E,
        0x3F,
        0x40,
        0x5B,
        0x5C,
        0x5D,
        0x5E,
        0x60,
        0x7B,
        0x7C,
        0x7D,
        0x7E,
      ];
      break;
    default:
      encodeSet = [];
      break;
  }
  const options = {
    encodeSet,
    spaceAsPlus: ip22.checked === true,
  };
  o2_5.value = bytes.toPercentEncoded(options);
}, { passive: true });

a2_6.addEventListener("click", () => {
  const bytes = store.get(o1);
  if (!bytes) {
    return;
  }

  o2_6.value = bytes.toText();
}, { passive: true });

a2_7.addEventListener("click", () => {
  const bytes = store.get(o1);
  if (!bytes) {
    return;
  }

  const url = bytes.toDataURL({ type: "text/plain; charset=utf-8" });
  o2_7a.value = url.toString();
  o2_7b.src = url.toString();
}, { passive: true });

a2_8.addEventListener("click", () => {
  const bytes = store.get(o1);
  if (!bytes) {
    return;
  }

  const blob = bytes.toBlob({ type: "text/plain; charset=utf-8" });
  o2_8.src = URL.createObjectURL(blob);
}, { passive: true });

document.querySelector("*.progress").hidden = true;
