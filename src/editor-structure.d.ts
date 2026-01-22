declare module 'editor-structure/rte-package/src/editor.js' {
  export class RTE {
    constructor(container: HTMLElement | string, config?: any);
    getContent(): string;
    setContent(content: string): void;
    destroy(): void;
  }
}

declare module 'editor-structure/rte-package/src/styles/main.css' {}
declare module 'editor-structure/rte-package/src/styles/components.css' {}
