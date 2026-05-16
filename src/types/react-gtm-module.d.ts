declare module 'react-gtm-module' {
  interface TagManagerArgs {
    gtmId: string;
    dataLayer?: Record<string, unknown>;
    dataLayerName?: string;
    auth?: string;
    preview?: string;
  }

  const TagManager: {
    initialize(args: TagManagerArgs): void;
    dataLayer(args: {
      dataLayer: Record<string, unknown>;
      dataLayerName?: string;
    }): void;
  };

  export default TagManager;
}
