import { createComponent, Types } from '@iwsdk/core';

export const Experience = createComponent('Experience', {
  guided: { type: Types.Boolean, default: false },
  tourStep: { type: Types.Int8, default: 0 },
  activeDemo: { type: Types.Int8, default: 0 },
  demoElapsed: { type: Types.Float32, default: 0 },
  completed: { type: Types.Boolean, default: false },
});
