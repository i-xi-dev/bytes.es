import { build, emptyDir } from "https://deno.land/x/dnt@0.29.0/mod.ts";

await emptyDir("./npm");

await build({
  compilerOptions: {
    lib: ["esnext", "dom"],
  },
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: "dev",
    customDev: [{
      package: {
        name: "encoding-japanese",
        version: "^2.0.0",
      },
      globalNames: [],
    }, {
      package: {
        name: "@types/encoding-japanese",
        version: "^2.0.0",
      },
      globalNames: [],
    }],
  },
  scriptModule: false,
  rootTestDir: "./tests",
  package: {
    name: "@i-xi-dev/bytes",
    version: "4.0.2-alpha2",
    description:
      "A JavaScript byte array library for the browser, Deno and Node.js",
    license: "MIT",
    author: "i-xi-dev",
    homepage: "https://github.com/i-xi-dev/bytes.es#readme",
    keywords: [
      "base64",
      "base64url",
      "blob",
      "byte",
      "bytes",
      "dataurl",
      "integrity",
      "sha256",
      "sha384",
      "sha512",
      "utf-8",
      "browser",
      "deno",
      "nodejs",
      "zero-dependency",
    ],
    repository: {
      type: "git",
      url: "git+https://github.com/i-xi-dev/bytes.es.git",
    },
    bugs: {
      url: "https://github.com/i-xi-dev/bytes.es/issues",
    },
    publishConfig: {
      access: "public",
    },
    files: [
      "esm",
      "types",
    ],
  },
  importMap: "./import_map.json",
  mappings: {
    "https://cdn.skypack.dev/encoding-japanese@2.0.0?dts": {
      name: "encoding-japanese",
      version: "^2.0.0",
    },
  },
});

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
