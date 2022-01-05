//

import { MediaType } from "@i-xi-dev/mimetype";

type ResourceMetadata = {
  mediaType?: MediaType,
  fileName?: string,
};

class ResourceMetadataStore<T extends object> {
  #store: WeakMap<T, ResourceMetadata>;

  constructor() {
    this.#store = new WeakMap();
    Object.freeze(this);
  }

  put(obj: T, metadata: ResourceMetadata): void {
    this.#store.set(obj, metadata);
  }

  getMediaType(obj: T): MediaType | null {
    const metadata = this.#store.get(obj);
    return (metadata?.mediaType instanceof MediaType) ? metadata.mediaType : null;
  }

  getBlobProperties(obj: T): BlobPropertyBag | undefined {
    const mediaType = this.getMediaType(obj);
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

  getFileProperties(obj: T): FilePropertyBag | undefined {
    const blobProperties = this.getBlobProperties(obj);
    const lastModified = undefined; // TODO
    if (blobProperties || lastModified) {

      return Object.assign({
        lastModified,
      }, blobProperties);
    }
    return undefined;
  }
}
Object.freeze(ResourceMetadataStore);

export {
  ResourceMetadataStore,
};
