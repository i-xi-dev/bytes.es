import { ByteSequence } from "https://www.unpkg.com/@i-xi-dev/bytes@4.1.3/esm/mod.js";
// https://cdn.skypack.dev/@i-xi-dev/bytes@4.1.3

const i1 = document.getElementById("i1");
const a1 = document.getElementById("a1");
const o1 = document.getElementById("o1");

a1.addEventListener("click", async () => {
  //const tableLastChars = ip12.value.split("");
  // const options = {
  //   tableLastChars,
  //   noPadding: (ip11.checked !== true),
  //   paddingChar: "=",
  // };

  let bytes = ByteSequence.of();
  if (i1.type === "file") {
    const file = i1.files[0];
    if (file) {
      bytes = ByteSequence.from(new Uint8Array(await file.arrayBuffer()));
    }
  } else {
    bytes = ByteSequence.fromText(i1.value);
  }

  o1.value = bytes.format({ separator: " " });
  //const base64 = bs.toBase64Encoded(bytes, options);
  //o2.value = base64;
}, { passive: true });

document.querySelector("*.progress").hidden = true;
