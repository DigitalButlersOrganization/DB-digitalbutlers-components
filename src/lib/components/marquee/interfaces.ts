import { Marquee } from './index';

// eslint-disable-next-line no-unused-vars
export type MarqueeCallback = (self: Marquee) => void

export interface MarqueeCallbacks {
  afterInit?: MarqueeCallback,
  beforeInit?: MarqueeCallback,
  disable?: MarqueeCallback,
  update?: MarqueeCallback
}

