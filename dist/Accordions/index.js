"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const generateId = (length) => {
  let id = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let index = 0; index < length; index += 1) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
};
const INSTANCE_ID_LENGTH = 4;
const PARAMS_KEY = "_accordion";
const PARAMS = {
  IS_SINGLE: "isSingle",
  IS_OPEN: "isOpen",
  ACCORDION_ID: "accordionId",
  ITEM_ID: "itemId",
  ITEMS_IDS: "itemsIds",
  SUMMARY_ELEMENT: "summaryElement",
  DETAILS_ELEMENT: "detailsElement"
};
const DESTROYED_TYPES = {
  MANUAL: "manual",
  BREAKPOINT: "breakpoint"
};
const ATTRIBUTES_PREFIX = "data-accordion-";
const ATTRIBUTES = {
  IS_SINGLE: `${ATTRIBUTES_PREFIX}is-single`
};
const DEFAULTS = {
  openClass: "js--open",
  parentElement: document,
  accordionSelector: '[data-role="accordion"]',
  itemSelector: '[data-role="accordion-item"]',
  summarySelector: '[data-role="accordion-summary"]',
  detailsSelector: '[data-role="accordion-details"]',
  breakpoint: window.matchMedia("screen"),
  isSingle: false
};
const _Accordions = class {
  constructor(customParameters = {}) {
    __publicField(this, "updateInstanceId", () => {
      this.instanceId = _Accordions.generateInstanceId();
    });
    __publicField(this, "generateAccordionId", (accordionId) => `accordion-${this.instanceId}-${accordionId}`);
    __publicField(this, "generateItemId", (itemId) => `accordion-item-${this.instanceId}-${itemId}`);
    __publicField(this, "generateSummaryId", (itemId) => `accordion-summary-${this.instanceId}-${itemId}`);
    __publicField(this, "generateDetailsId", (itemId) => `accordion-details-${this.instanceId}-${itemId}`);
    __publicField(this, "getItemById", (itemId) => this.itemElements.find((itemElement) => itemElement[PARAMS_KEY][PARAMS.ITEM_ID] === itemId));
    __publicField(this, "getAccordionById", (accordionId) => this.elements.find((accordionElement) => accordionElement[PARAMS_KEY][PARAMS.ACCORDION_ID] === accordionId));
    __publicField(this, "initAccordions", () => {
      this.elements = [...this.parentElement.querySelectorAll(this.accordionSelector)];
      this.elements.forEach((accordionElement, accordionIndex) => {
        this.initAccordion(accordionElement, accordionIndex);
      });
    });
    __publicField(this, "initAccordion", (accordionElement, accordionId) => {
      if (accordionElement[PARAMS_KEY]) {
        return;
      }
      const parentItemElement = accordionElement.closest(this.itemSelector);
      const parentItemId = parentItemElement && parentItemElement[PARAMS_KEY][PARAMS.ITEM_ID];
      const isSingle = accordionElement.hasAttribute(ATTRIBUTES.IS_SINGLE) ? accordionElement.getAttribute(ATTRIBUTES.IS_SINGLE) === "true" : this.isSingle;
      accordionElement[PARAMS_KEY] = {};
      accordionElement[PARAMS_KEY][PARAMS.ACCORDION_ID] = String(accordionId);
      accordionElement[PARAMS_KEY][PARAMS.ITEMS_IDS] = [];
      accordionElement[PARAMS_KEY][PARAMS.IS_SINGLE] = isSingle;
      accordionElement.id = this.generateAccordionId(accordionId);
      const itemElements = [...accordionElement.children].filter((element) => element.matches(this.itemSelector));
      itemElements.forEach((itemElement, itemIndex) => {
        const itemId = `${accordionId}-${itemIndex}`;
        this.initItem({
          itemElement,
          itemId,
          accordionId,
          parentItemId
        });
        accordionElement[PARAMS_KEY][PARAMS.ITEMS_IDS].push(itemId);
      });
    });
    __publicField(this, "initItem", ({ itemElement, itemId, accordionId, parentItemId }) => {
      if (itemElement[PARAMS_KEY]) {
        return;
      }
      const summaryElement = itemElement.querySelector(this.summarySelector);
      const detailsElement = itemElement.querySelector(this.detailsSelector);
      const summaryId = this.generateSummaryId(itemId);
      const detailsId = this.generateDetailsId(itemId);
      itemElement.id = this.generateItemId(itemId);
      itemElement[PARAMS_KEY] = {};
      itemElement[PARAMS_KEY][PARAMS.ITEM_ID] = itemId;
      itemElement[PARAMS_KEY][PARAMS.ACCORDION_ID] = String(accordionId);
      itemElement[PARAMS_KEY][PARAMS.SUMMARY_ELEMENT] = summaryElement;
      itemElement[PARAMS_KEY][PARAMS.DETAILS_ELEMENT] = detailsElement;
      this.itemElements.push(itemElement);
      summaryElement.setAttribute("tabindex", 0);
      summaryElement.setAttribute("id", summaryId);
      summaryElement.setAttribute("aria-controls", detailsId);
      summaryElement[PARAMS_KEY] = {};
      summaryElement[PARAMS_KEY][PARAMS.ITEM_ID] = itemId;
      detailsElement.setAttribute("id", detailsId);
      detailsElement.setAttribute("aria-labelledby", summaryId);
      detailsElement[PARAMS_KEY] = {};
      detailsElement[PARAMS_KEY][PARAMS.ITEM_ID] = itemId;
      if (parentItemId) {
        detailsElement.addEventListener("transitionend", this.onDetailsTransitionEnd);
      }
      summaryElement.addEventListener("click", this.onSummaryClick);
    });
    __publicField(this, "destroyAccordion", (accordion) => {
      const accordionElement = typeof accordion === "string" ? this.getAccordionById(accordion) : accordion;
      if (!accordionElement[PARAMS_KEY]) {
        return;
      }
      const accordionItemsElements = this.itemElements.filter(
        (itemElement) => itemElement[PARAMS_KEY][PARAMS.ACCORDION_ID] === accordionElement[PARAMS_KEY][PARAMS.ACCORDION_ID]
      );
      accordionItemsElements.forEach((accordionItemElement) => {
        this.destroyItem(accordionItemElement);
      });
      this.elements = this.elements.filter(
        (element) => element[PARAMS_KEY][PARAMS.ACCORDION_ID] !== accordionElement[PARAMS_KEY][PARAMS.ACCORDION_ID]
      );
      delete accordionElement[PARAMS_KEY];
      accordionElement.removeAttribute("id");
    });
    __publicField(this, "destroyItem", (item) => {
      const itemElement = typeof item === "string" ? this.getItemById(item) : item;
      if (!itemElement[PARAMS_KEY]) {
        return;
      }
      const summaryElement = itemElement[PARAMS_KEY][PARAMS.SUMMARY_ELEMENT];
      const detailsElement = itemElement[PARAMS_KEY][PARAMS.DETAILS_ELEMENT];
      this.itemElements = this.itemElements.filter(
        (itemElement_) => itemElement_[PARAMS_KEY][PARAMS.ITEM_ID] !== itemElement[PARAMS_KEY][PARAMS.ITEM_ID]
      );
      delete itemElement[PARAMS_KEY];
      itemElement.removeAttribute("id");
      delete summaryElement[PARAMS_KEY];
      summaryElement.removeAttribute("id");
      summaryElement.removeAttribute("aria-controls");
      summaryElement.removeAttribute("aria-expanded");
      delete detailsElement[PARAMS_KEY];
      detailsElement.removeAttribute("id");
      detailsElement.removeAttribute("aria-labelledby");
      detailsElement.removeAttribute("inert");
      summaryElement.removeEventListener("click", this.onSummaryClick);
    });
    __publicField(this, "onSummaryClick", (event) => {
      if (!this.breakpoint.matches) {
        return;
      }
      const itemId = event.currentTarget[PARAMS_KEY][PARAMS.ITEM_ID];
      this.toggle(itemId);
    });
    __publicField(this, "onBreakpointChange", () => {
      if (this.breakpoint.matches) {
        if (this.isDestroyed && this.destroyedBy === DESTROYED_TYPES.BREAKPOINT) {
          this.init();
        }
      } else if (!this.isDestroyed) {
        this.destroy(DESTROYED_TYPES.BREAKPOINT);
      }
    });
    __publicField(this, "init", () => {
      this.updateInstanceId();
      this.initAccordions();
      this.isDestroyed = false;
      this.destroyedBy = void 0;
      this.breakpoint.addEventListener("change", this.onBreakpointChange);
      this.onBreakpointChange();
      this.closeAll();
    });
    __publicField(this, "destroy", (destroyedBy = DESTROYED_TYPES.MANUAL) => {
      this.elements.forEach((accordionElement) => {
        this.destroyAccordion(accordionElement);
      });
      this.isDestroyed = true;
      this.destroyedBy = destroyedBy;
    });
    __publicField(this, "open", (item) => {
      const itemElement = typeof item === "string" ? this.getItemById(item) : item;
      const accordionElement = this.getAccordionById(itemElement[PARAMS_KEY][PARAMS.ACCORDION_ID]);
      const detailsElement = itemElement[PARAMS_KEY][PARAMS.DETAILS_ELEMENT];
      const summaryElement = itemElement[PARAMS_KEY][PARAMS.SUMMARY_ELEMENT];
      if (accordionElement[PARAMS_KEY][PARAMS.IS_SINGLE]) {
        this.closeAccordion(accordionElement);
      }
      itemElement[PARAMS_KEY][PARAMS.IS_OPEN] = true;
      itemElement.classList.add(this.openClass);
      summaryElement.setAttribute("aria-expanded", "true");
      detailsElement.removeAttribute("inert");
    });
    __publicField(this, "close", (item) => {
      const itemElement = typeof item === "string" ? this.getItemById(item) : item;
      const detailsElement = itemElement[PARAMS_KEY][PARAMS.DETAILS_ELEMENT];
      const summaryElement = itemElement[PARAMS_KEY][PARAMS.SUMMARY_ELEMENT];
      if (!detailsElement) {
        return;
      }
      itemElement[PARAMS_KEY][PARAMS.IS_OPEN] = false;
      itemElement.classList.remove(this.openClass);
      summaryElement.setAttribute("aria-expanded", "false");
      detailsElement.setAttribute("inert", "");
    });
    __publicField(this, "toggle", (item) => {
      const itemElement = typeof item === "string" ? this.getItemById(item) : item;
      if (itemElement[PARAMS_KEY][PARAMS.IS_OPEN]) {
        this.close(itemElement);
      } else {
        this.open(itemElement);
      }
    });
    __publicField(this, "closeAccordion", (accordion) => {
      const accordionElement = typeof accordion === "string" ? this.getAccordionById(accordion) : accordion;
      const itemsIds = accordionElement[PARAMS_KEY][PARAMS.ITEMS_IDS];
      itemsIds.forEach((itemId) => {
        this.close(itemId);
      });
    });
    __publicField(this, "closeAll", () => {
      this.elements.forEach((accordion) => {
        this.closeAccordion(accordion);
      });
    });
    const parameters = {
      ...DEFAULTS,
      ...customParameters
    };
    this.instanceId = void 0;
    this.openClass = parameters.openClass;
    this.accordionSelector = parameters.accordionSelector;
    this.itemSelector = parameters.itemSelector;
    this.summarySelector = parameters.summarySelector;
    this.detailsSelector = parameters.detailsSelector;
    this.isSingle = parameters.isSingle;
    this.breakpoint = parameters.breakpoint;
    this.parentElement = parameters.parentElement;
    this.elements = [];
    this.itemElements = [];
    this.isDestroyed = true;
    this.destroyedBy = void 0;
  }
};
let Accordions = _Accordions;
__publicField(Accordions, "generateInstanceId", () => {
  const instanceId = generateId(INSTANCE_ID_LENGTH);
  return _Accordions.isInstanceIdUnique(instanceId) ? instanceId : _Accordions.generateInstanceId();
});
__publicField(Accordions, "isInstanceIdUnique", (instanceId) => !document.querySelector(`[id^="accordion-${instanceId}]"`));
exports.Accordions = Accordions;
