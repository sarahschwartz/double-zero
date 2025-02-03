import elements from '../../src/utils/testId.js';

import type { App } from 'vue';

declare module 'vue' {
  interface ComponentCustomProperties {
    $testId: typeof elements;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $testId: typeof elements;
  }
}

export default {
  install: (app: App) => {
    app.config.globalProperties.$testId = elements;
  },
};

export {};
