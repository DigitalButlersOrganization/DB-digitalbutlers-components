/* eslint-disable no-unused-vars */

import { Accordions } from './index';

/* eslint-disable no-shadow */
export const PARAMS_KEY = '_accordion';

export enum PARAMS {
  IS_SINGLE = 'isSingle',
  IS_OPEN = 'isOpen',
  ACCORDION_ID = 'accordionId',
  ITEM_ID = 'itemId',
  ITEMS_IDS = 'itemsIds',
  SUMMARY_ELEMENT = 'summaryElement',
  DETAILS_ELEMENT = 'detailsElement',
}

export interface AccordionProperties {
  [PARAMS.IS_SINGLE]?: boolean
  [PARAMS.IS_OPEN]?: boolean
  [PARAMS.ACCORDION_ID]?: string
  [PARAMS.ITEM_ID]?: string
  [PARAMS.ITEMS_IDS]?: string[]
  [PARAMS.SUMMARY_ELEMENT]?: HTMLElement
  [PARAMS.DETAILS_ELEMENT]?: HTMLElement
}
export interface AccordionElement extends HTMLElement {
  [PARAMS_KEY]?: AccordionProperties
}

export type AccordionCallback = (self: Accordions) => void

export interface AccordionCallbacks {
  afterInit?: AccordionCallback,
  beforeInit?: AccordionCallback,
  toggle?: AccordionCallback,
  detailsTransitionEnd?: AccordionCallback
}

