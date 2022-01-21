// TODO 何故importが使えないのか

const { webcrypto } = require("node:crypto");
globalThis.crypto = webcrypto;

const { Blob } = require("node:buffer");
globalThis.Blob = Blob;

class File extends Blob {
  name;
  constructor(fileBits, fileName, options) {
    super(fileBits, options);
    this.name = fileName;
  }
}
globalThis.File = File;

// globalThisがNodeのと違うのでimportしないと使えないもの
const { performance } = require("node:perf_hooks");
globalThis.performance = performance;

// NodeのglobalThis.AbortControllerを参照できないので、node-abort-controllerを使用
const { AbortController, AbortSignal } = require("node-abort-controller");
globalThis.AbortController = AbortController;
globalThis.AbortSignal = AbortSignal;
