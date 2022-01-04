//

import { MediaType } from "@i-xi-dev/mimetype";

class ResourceMetadata {
  mediaType?: MediaType;
  fileName?: string;
  // 

  constructor(init?: {
    mediaType?: MediaType,
    fileName?: string,
  }) {
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
  ResourceMetadata,
};
