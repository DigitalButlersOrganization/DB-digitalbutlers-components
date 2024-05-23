import { SharePageLinks } from './index';

// eslint-disable-next-line no-unused-vars
export type SharePageCallback = (self: SharePageLinks) => void

export interface SharePageCallbacks {
  afterInit?: SharePageCallback,
}

