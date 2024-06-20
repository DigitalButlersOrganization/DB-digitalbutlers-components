var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { g as getRandomId } from "../assets/7d6eccdb.js";
const PARAMS_KEY = "_accordion";
var PARAMS;
(function(PARAMS2) {
  PARAMS2["IS_SINGLE"] = "isSingle";
  PARAMS2["IS_OPEN"] = "isOpen";
  PARAMS2["ACCORDION_ID"] = "accordionId";
  PARAMS2["ITEM_ID"] = "itemId";
  PARAMS2["ITEMS_IDS"] = "itemsIds";
  PARAMS2["SUMMARY_ELEMENT"] = "summaryElement";
  PARAMS2["DETAILS_ELEMENT"] = "detailsElement";
})(PARAMS || (PARAMS = {}));
const index = "";
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
  isSingle: false,
  on: {}
};
const _Accordions = class {
  constructor(customParameters = {}) {
    __publicField(this, "instanceId");
    __publicField(this, "openClass");
    __publicField(this, "accordionSelector");
    __publicField(this, "itemSelector");
    __publicField(this, "summarySelector");
    __publicField(this, "detailsSelector");
    __publicField(this, "isSingle");
    __publicField(this, "breakpoint");
    __publicField(this, "parentElement");
    __publicField(this, "elements");
    __publicField(this, "itemElements");
    __publicField(this, "isDestroyed");
    __publicField(this, "destroyedBy");
    __publicField(this, "on");
    __publicField(this, "updateInstanceId", () => {
      this.instanceId = _Accordions.generateInstanceId();
    });
    __publicField(this, "generateAccordionId", (accordionId) => `accordion-${this.instanceId}-${accordionId}`);
    __publicField(this, "generateItemId", (itemId) => `accordion-item-${this.instanceId}-${itemId}`);
    __publicField(this, "generateSummaryId", (itemId) => `accordion-summary-${this.instanceId}-${itemId}`);
    __publicField(this, "generateDetailsId", (itemId) => `accordion-details-${this.instanceId}-${itemId}`);
    __publicField(this, "getItemById", (itemId) => this.itemElements.find((itemElement) => {
      var _a;
      return ((_a = itemElement[PARAMS_KEY]) == null ? void 0 : _a[PARAMS.ITEM_ID]) === itemId;
    }));
    __publicField(this, "getAccordionById", (accordionId) => this.elements.find((accordionElement) => {
      var _a;
      return ((_a = accordionElement[PARAMS_KEY]) == null ? void 0 : _a[PARAMS.ACCORDION_ID]) === accordionId;
    }));
    __publicField(this, "initAccordions", () => {
      this.elements = Array.from(this.parentElement.querySelectorAll(this.accordionSelector));
      this.elements.forEach((accordionElement, accordionIndex) => {
        this.initAccordion(accordionElement, accordionIndex);
      });
    });
    __publicField(this, "initAccordion", (accordionElement, accordionId) => {
      var _a;
      if (accordionElement[PARAMS_KEY]) {
        return;
      }
      const parentItemElement = (_a = accordionElement.closest(this.itemSelector)) != null ? _a : void 0;
      if (parentItemElement && !parentItemElement[PARAMS_KEY]) {
        parentItemElement[PARAMS_KEY] = {};
      }
      const parentItemId = parentItemElement && parentItemElement[PARAMS_KEY][PARAMS.ITEM_ID];
      const isSingle = accordionElement.hasAttribute(ATTRIBUTES.IS_SINGLE) ? accordionElement.getAttribute(ATTRIBUTES.IS_SINGLE) === "true" : this.isSingle;
      accordionElement[PARAMS_KEY] = {};
      accordionElement[PARAMS_KEY][PARAMS.ACCORDION_ID] = String(accordionId);
      accordionElement[PARAMS_KEY][PARAMS.ITEMS_IDS] = [];
      accordionElement[PARAMS_KEY][PARAMS.IS_SINGLE] = isSingle;
      accordionElement.id = this.generateAccordionId(accordionId);
      const accordionChildren = Array.from(accordionElement.children);
      const itemElements = accordionChildren.filter((element) => element.matches(this.itemSelector));
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
      var _a, _b;
      if (itemElement[PARAMS_KEY]) {
        return;
      }
      const summaryElement = (_a = itemElement.querySelector(this.summarySelector)) != null ? _a : void 0;
      const detailsElement = (_b = itemElement.querySelector(this.detailsSelector)) != null ? _b : void 0;
      const summaryId = this.generateSummaryId(itemId);
      const detailsId = this.generateDetailsId(itemId);
      itemElement.id = this.generateItemId(itemId);
      itemElement[PARAMS_KEY] = {};
      itemElement[PARAMS_KEY][PARAMS.ITEM_ID] = itemId;
      itemElement[PARAMS_KEY][PARAMS.ACCORDION_ID] = String(accordionId);
      itemElement[PARAMS_KEY][PARAMS.SUMMARY_ELEMENT] = summaryElement;
      itemElement[PARAMS_KEY][PARAMS.DETAILS_ELEMENT] = detailsElement;
      this.itemElements.push(itemElement);
      summaryElement.setAttribute("tabindex", "0");
      summaryElement.setAttribute("id", summaryId);
      summaryElement.setAttribute("aria-controls", detailsId);
      summaryElement[PARAMS_KEY] = {};
      summaryElement[PARAMS_KEY][PARAMS.ITEM_ID] = itemId;
      detailsElement.setAttribute("id", detailsId);
      detailsElement.setAttribute("aria-labelledby", summaryId);
      detailsElement[PARAMS_KEY] = {};
      detailsElement[PARAMS_KEY][PARAMS.ITEM_ID] = itemId;
      if (parentItemId && this.on.detailsTransitionEnd) {
        detailsElement.addEventListener("transitionend", () => {
          this.on.detailsTransitionEnd(this);
        });
      }
      summaryElement.addEventListener("click", this.onSummaryClick);
    });
    __publicField(this, "destroyAccordion", (accordion) => {
      const accordionElement = typeof accordion === "string" ? this.getAccordionById(accordion) : accordion;
      if (!accordionElement || !accordionElement[PARAMS_KEY]) {
        return;
      }
      const accordionItemsElements = this.itemElements.filter((itemElement) => {
        if (!itemElement[PARAMS_KEY] || !accordionElement[PARAMS_KEY]) {
          return false;
        }
        return itemElement[PARAMS_KEY][PARAMS.ACCORDION_ID] === accordionElement[PARAMS_KEY][PARAMS.ACCORDION_ID];
      });
      accordionItemsElements.forEach((accordionItemElement) => {
        this.destroyItem(accordionItemElement);
      });
      this.elements = this.elements.filter((element) => {
        if (!element[PARAMS_KEY] || !accordionElement[PARAMS_KEY]) {
          return false;
        }
        return element[PARAMS_KEY][PARAMS.ACCORDION_ID] !== accordionElement[PARAMS_KEY][PARAMS.ACCORDION_ID];
      });
      delete accordionElement[PARAMS_KEY];
      accordionElement.removeAttribute("id");
    });
    __publicField(this, "destroyItem", (item) => {
      var _a, _b;
      const itemElement = typeof item === "string" ? this.getItemById(item) : item;
      if (!itemElement || !itemElement[PARAMS_KEY]) {
        return;
      }
      const summaryElement = (_a = itemElement[PARAMS_KEY][PARAMS.SUMMARY_ELEMENT]) != null ? _a : void 0;
      const detailsElement = (_b = itemElement[PARAMS_KEY][PARAMS.DETAILS_ELEMENT]) != null ? _b : void 0;
      this.itemElements = this.itemElements.filter((itemElement_) => {
        if (!itemElement_[PARAMS_KEY] || !itemElement[PARAMS_KEY]) {
          return false;
        }
        return itemElement_[PARAMS_KEY][PARAMS.ITEM_ID] !== itemElement[PARAMS_KEY][PARAMS.ITEM_ID];
      });
      delete itemElement[PARAMS_KEY];
      itemElement.removeAttribute("id");
      if (summaryElement) {
        if (summaryElement[PARAMS_KEY]) {
          delete summaryElement[PARAMS_KEY];
        }
        summaryElement.removeAttribute("id");
        summaryElement.removeAttribute("aria-controls");
        summaryElement.removeAttribute("aria-expanded");
      }
      delete detailsElement[PARAMS_KEY];
      detailsElement.removeAttribute("id");
      detailsElement.removeAttribute("aria-labelledby");
      detailsElement.removeAttribute("inert");
      summaryElement.removeEventListener("click", this.onSummaryClick);
    });
    __publicField(this, "onSummaryClick", (event) => {
      var _a;
      if (!this.breakpoint.matches) {
        return;
      }
      const itemId = (_a = event.currentTarget[PARAMS_KEY]) == null ? void 0 : _a[PARAMS.ITEM_ID];
      if (itemId) {
        this.toggle(itemId);
      }
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
      if (this.on.beforeInit) {
        this.on.beforeInit(this);
      }
      this.updateInstanceId();
      this.initAccordions();
      this.isDestroyed = false;
      this.destroyedBy = void 0;
      this.breakpoint.addEventListener("change", this.onBreakpointChange);
      this.onBreakpointChange();
      this.closeAll();
      if (this.on.afterInit) {
        this.on.afterInit(this);
      }
    });
    __publicField(this, "destroy", (destroyedBy = DESTROYED_TYPES.MANUAL) => {
      this.elements.forEach((accordionElement) => {
        this.destroyAccordion(accordionElement);
      });
      this.isDestroyed = true;
      this.destroyedBy = destroyedBy;
    });
    __publicField(this, "open", (item) => {
      var _a, _b, _c;
      const itemElement = typeof item === "string" ? this.getItemById(item) : item;
      if (!itemElement || !itemElement[PARAMS_KEY]) {
        return;
      }
      const idClosed = !itemElement ? false : !itemElement.classList.contains(this.openClass);
      if (idClosed) {
        const accordionElement = this.getAccordionById((_b = (_a = itemElement[PARAMS_KEY]) == null ? void 0 : _a[PARAMS.ACCORDION_ID]) != null ? _b : "");
        const detailsElement = itemElement[PARAMS_KEY][PARAMS.DETAILS_ELEMENT];
        const summaryElement = itemElement[PARAMS_KEY][PARAMS.SUMMARY_ELEMENT];
        if ((_c = accordionElement == null ? void 0 : accordionElement[PARAMS_KEY]) == null ? void 0 : _c[PARAMS.IS_SINGLE]) {
          this.closeAccordion(accordionElement);
        }
        itemElement[PARAMS_KEY][PARAMS.IS_OPEN] = true;
        itemElement.classList.add(this.openClass);
        summaryElement == null ? void 0 : summaryElement.setAttribute("aria-expanded", "true");
        detailsElement == null ? void 0 : detailsElement.removeAttribute("inert");
        if (this.on.open) {
          this.on.open(this);
        }
        if (this.on.toggle) {
          this.on.toggle(this);
        }
      }
    });
    __publicField(this, "close", (item) => {
      var _a, _b;
      const itemElement = typeof item === "string" ? this.getItemById(item) : item;
      if (itemElement && !itemElement[PARAMS_KEY]) {
        itemElement[PARAMS_KEY] = {};
      }
      const isOpened = itemElement == null ? void 0 : itemElement.classList.contains(this.openClass);
      if (isOpened) {
        const detailsElement = (_a = itemElement == null ? void 0 : itemElement[PARAMS_KEY]) == null ? void 0 : _a[PARAMS.DETAILS_ELEMENT];
        const summaryElement = (_b = itemElement == null ? void 0 : itemElement[PARAMS_KEY]) == null ? void 0 : _b[PARAMS.SUMMARY_ELEMENT];
        if (!detailsElement) {
          return;
        }
        itemElement[PARAMS_KEY][PARAMS.IS_OPEN] = false;
        itemElement.classList.remove(this.openClass);
        summaryElement == null ? void 0 : summaryElement.setAttribute("aria-expanded", "false");
        detailsElement.setAttribute("inert", "");
        if (this.on.close) {
          this.on.close(this);
        }
        if (this.on.toggle) {
          this.on.toggle(this);
        }
      }
    });
    __publicField(this, "toggle", (item) => {
      const itemElement = typeof item === "string" ? this.getItemById(item) : item;
      if (itemElement && !itemElement[PARAMS_KEY]) {
        itemElement[PARAMS_KEY] = {};
      }
      if (!itemElement) {
        return;
      }
      if (itemElement[PARAMS_KEY][PARAMS.IS_OPEN]) {
        this.close(itemElement);
      } else {
        this.open(itemElement);
      }
    });
    __publicField(this, "closeAccordion", (accordion) => {
      var _a;
      const accordionElement = typeof accordion === "string" ? this.getAccordionById(accordion) : accordion;
      if (!accordionElement) {
        return;
      }
      if (!accordionElement[PARAMS_KEY]) {
        accordionElement[PARAMS_KEY] = {};
      }
      const itemsIds = (_a = accordionElement[PARAMS_KEY][PARAMS.ITEMS_IDS]) != null ? _a : [];
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
    this.on = parameters.on;
    this.init();
  }
};
let Accordions = _Accordions;
__publicField(Accordions, "generateInstanceId", () => {
  const instanceId = getRandomId();
  return _Accordions.isInstanceIdUnique(instanceId) ? instanceId : _Accordions.generateInstanceId();
});
__publicField(Accordions, "isInstanceIdUnique", (instanceId) => !document.querySelector(`[id^="accordion-${instanceId}]"`));
export {
  Accordions
};
