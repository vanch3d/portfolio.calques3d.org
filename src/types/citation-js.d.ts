declare module "@citation-js/core" {
  export const plugins: {
    config: {
      get(name: "@csl"): {
        styles: {
          add(name: string, xml: string): void;
        };
      };
    };
  };

  export class Cite {
    constructor(data: unknown);
    format(
      type: string,
      options?: Record<string, unknown>,
    ): string;
  }
}

declare module "@citation-js/plugin-csl" {}
