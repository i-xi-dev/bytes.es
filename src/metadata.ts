//

import { MediaType } from "@i-xi-dev/mimetype";

type ResourceMetadataInit = {
  mediaType?: MediaType,
  fileName?: string,
};

class ResourceMetadata {
  mediaType?: MediaType;
  fileName?: string;
  // 

  constructor(init: ResourceMetadataInit = {}) {
    this.mediaType = init?.mediaType;
    this.fileName = init?.fileName;
  }


  toBlobProperties(): BlobPropertyBag {
    return {
      type: (this.mediaType instanceof MediaType) ? this.mediaType.toString() : undefined,
      // endings  not implemented
    };
  }

  toFileProperties(): FilePropertyBag {
    const blobProperties = this.toBlobProperties();
    return Object.assign({
      // lastModified  not implemented
    }, blobProperties);
  }
}

export {
  type ResourceMetadataInit,
  ResourceMetadata,
};
