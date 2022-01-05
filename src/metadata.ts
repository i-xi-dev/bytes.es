//

import { MediaType } from "@i-xi-dev/mimetype";

type ResourceMetadata = {
  mediaType?: MediaType,
  fileName?: string,
};

/**
 * A store for storing metadata of resources.
 * The store has a weak reference to the resources.
 * 
 * @typeParam T - The type of the resources.
 */
interface ResourceMetadataStore<T extends object> {
  /**
   * Retruns the `MediaType` of the specified resource.
   * 
   * @param resource - A resource.
   * @returns If the `MediaType` is stored in the store, the `MediaType`; Otherwise, `null`.
   */
  getMediaType(resource: T): MediaType | null;

  /**
   * Retruns the [`BlobPropertyBag`](https://w3c.github.io/FileAPI/#dfn-BlobPropertyBag) of the specified resource.
   * 
   * `BlobPropertyBag.endings` is not implemented.
   * 
   * @param resource - A resource.
   * @returns If the `MediaType` is stored in the store, the `BlobPropertyBag`; Otherwise, `undefined`.
   */
  getBlobProperties(resource: T): BlobPropertyBag | undefined;

  /**
   * Retruns the [`FilePropertyBag`](https://w3c.github.io/FileAPI/#dfn-FilePropertyBag) of the specified resource.
   * 
   * `FilePropertyBag.lastModified` is not implemented.
   * 
   * @param resource - A resource.
   * @returns If the `MediaType` is stored in the store, the `FilePropertyBag`; Otherwise, `undefined`.
   */
  getFileProperties(resource: T): FilePropertyBag | undefined;
}

class MetadataMap<T extends object> implements ResourceMetadataStore<T> {
  #store: WeakMap<T, ResourceMetadata>;

  constructor() {
    this.#store = new WeakMap();
    Object.freeze(this);
  }

  put(resource: T, metadata: ResourceMetadata): void {
    this.#store.set(resource, metadata);
  }

  getMediaType(resource: T): MediaType | null {
    const metadata = this.#store.get(resource);
    return (metadata?.mediaType instanceof MediaType) ? metadata.mediaType : null;
  }

  getBlobProperties(resource: T): BlobPropertyBag | undefined {
    const mediaType = this.getMediaType(resource);
    const type: string | undefined = (mediaType) ? mediaType.toString() : undefined;
    const endings = undefined; // TODO
    if (type || endings) {
      return {
        type,
        endings,
      };
    }
    return undefined;
  }

  getFileProperties(resource: T): FilePropertyBag | undefined {
    const blobProperties = this.getBlobProperties(resource);
    const lastModified = undefined; // TODO
    if (blobProperties || lastModified) {

      return Object.assign({
        lastModified,
      }, blobProperties);
    }
    return undefined;
  }
}
Object.freeze(MetadataMap);

export {
  type ResourceMetadata,
  type ResourceMetadataStore,
  MetadataMap,
};
