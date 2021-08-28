//

/**
 * ProgressEvent for non-browser enviorments
 * 
 * Implements the {@link https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent ProgressEvent} interface.
 */
class _ProgressEvent extends Event implements ProgressEvent<EventTarget> {
  /**
   * 進捗状況を計測可能か否か
   */
  #lengthComputable: boolean;

  /**
   * 実行済の実行量
   */
  #loaded: number;

  /**
   * 合計の実行量
   */
  #total: number;

  /**
   * @param type イベント型名
   * @param init EventInit
   */
  constructor(type: string, init?: ProgressEventInit) {
    super(type, init);

    this.#lengthComputable = (init && (typeof init.lengthComputable === "boolean")) ? init.lengthComputable : false;
    this.#loaded = (init && (typeof init.loaded === "number") && Number.isSafeInteger(init.loaded) && (init.loaded >= 0)) ? init.loaded : 0;
    this.#total = (init && (typeof init.total === "number") && Number.isSafeInteger(init.total) && (init.total >= 0)) ? init.total : 0;
  }

  /**
   * 進捗状況を計測可能か否か
   */
  get lengthComputable(): boolean {
    return this.#lengthComputable;
  }

  /**
   * 実行済の実行量
   */
  get loaded(): number {
    return this.#loaded;
  }

  /**
   * 合計の実行量
   */
  get total(): number {
    return this.#total;
  }
}
const pe = (globalThis.ProgressEvent) ? globalThis.ProgressEvent : _ProgressEvent;

export {
  pe as ProgressEvent,
};
