var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { C as CLASSES } from "../assets/f962fdbe.js";
const PREFIX = "js--";
const CUSTOM_CLASSES = {
  BUTTON: `${PREFIX}pagination-button`,
  CURRENT: `${PREFIX}pagination-current`,
  EMPTY_PLACE: `${PREFIX}pagination-empty-place`
};
class Pagination {
  constructor(component = '[data-pagination="wrapper"]', { paginationWrapperSelector = '[data-pagination="container"]', dynamicElementSelector = '.w-dyn-item[role="listitem"]', previousButtonInner = "Prev", nextButtonInner = "Next", itemsPerPage, hiddenButtons = {
    min: 6
  } }) {
    __publicField(this, "component");
    __publicField(this, "paginationWrapperSelector");
    __publicField(this, "paginationWrapper");
    __publicField(this, "dynamicElementSelector");
    __publicField(this, "dynamicElements");
    __publicField(this, "previousButtonInner");
    __publicField(this, "nextButtonInner");
    __publicField(this, "itemsPerPage");
    __publicField(this, "url");
    __publicField(this, "currentPage");
    __publicField(this, "totalPages");
    __publicField(this, "buttons");
    __publicField(this, "prevButton");
    __publicField(this, "nextButton");
    __publicField(this, "emptyMapInner");
    __publicField(this, "buttonsMap");
    __publicField(this, "dynamicItemSelector");
    __publicField(this, "hiddenButtons");
    __publicField(this, "init", () => {
      var _a;
      const queryPage = this.url.searchParams.get("page");
      this.currentPage = queryPage ? +queryPage : 1;
      this.paginationWrapper = (_a = this.component.querySelector(this.paginationWrapperSelector)) != null ? _a : void 0;
      if (this.paginationWrapper) {
        this.initVariables();
        this.paginationWrapper.addEventListener("click", this.clickHandler);
      }
    });
    __publicField(this, "initVariables", () => {
      this.dynamicElements = Array.from(this.component.querySelectorAll(this.dynamicElementSelector));
      this.totalPages = Math.ceil(this.dynamicElements.length / this.itemsPerPage);
      this.createButtonsMap();
      this.addCustomButtons();
      this.goToCurrent();
    });
    __publicField(this, "createButtonsMap", () => {
      const result = [];
      const pages = new Array(this.totalPages).fill("").map((_element, index) => index + 1);
      const isButtonVisible = (value) => value === 1 || value === this.totalPages || value >= this.currentPage - 1 && value <= this.currentPage + 1;
      pages.forEach((element, index) => {
        const mapItem = {
          page: element,
          current: index + 1 === this.currentPage
        };
        if (isButtonVisible(element) || this.buttons.length < this.hiddenButtons.min) {
          result.push({
            ...mapItem,
            visible: true
          });
        } else if (isButtonVisible(pages[index + 1]) && isButtonVisible(pages[index - 1])) {
          result.push({
            ...mapItem,
            visible: true
          });
        } else {
          result.push({
            ...mapItem,
            visible: false
          });
        }
      });
      this.buttonsMap = result;
    });
    __publicField(this, "addCustomButtons", () => {
      if (this.totalPages > 1) {
        this.paginationWrapper.classList.remove(CLASSES.UNACTIVE);
        this.addButton({
          label: "Prev page",
          content: this.previousButtonInner
        });
        this.buttonsMap.forEach(({ page }) => {
          this.addButton({
            label: `Page ${page}`,
            content: page
          });
        });
        this.addButton({
          label: "Next page",
          content: this.nextButtonInner
        });
      } else {
        this.paginationWrapper.classList.add(CLASSES.UNACTIVE);
      }
      this.createButtonsMap();
      this.updateButtonsAttrs();
      this.addRelLinks();
    });
    __publicField(this, "addButton", ({ content, label }) => {
      const button = document.createElement("button");
      button.innerHTML = content;
      button.classList.add(CUSTOM_CLASSES.BUTTON);
      button.setAttribute("aria-label", label);
      button.setAttribute("type", "button");
      if (label === "Prev page") {
        this.prevButton = button;
      } else if (label === "Next page") {
        this.nextButton = button;
      } else {
        this.buttons.push(button);
      }
      this.paginationWrapper.append(button);
    });
    __publicField(this, "updateButtonsAttrs", () => {
      if (this.currentPage === 1) {
        this.makeDisable(this.prevButton);
      } else {
        this.makeEnable(this.prevButton);
      }
      if (this.currentPage === this.totalPages) {
        this.makeDisable(this.nextButton);
      } else {
        this.makeEnable(this.nextButton);
      }
      this.buttons.forEach((button, index) => {
        const buttonMapItem = this.buttonsMap[index];
        if (index + 1 === this.currentPage) {
          button.classList.add(CUSTOM_CLASSES.CURRENT);
        } else {
          button.classList.remove(CUSTOM_CLASSES.CURRENT);
        }
        if (!buttonMapItem.visible || buttonMapItem.current) {
          this.makeDisable(button);
        } else {
          this.makeEnable(button);
        }
        if (buttonMapItem.visible) {
          button.classList.remove(CUSTOM_CLASSES.EMPTY_PLACE);
          button.textContent = buttonMapItem.page;
        } else {
          button.classList.add(CUSTOM_CLASSES.EMPTY_PLACE);
          button.textContent = this.emptyMapInner;
        }
        if (buttonMapItem.current) {
          button.classList.add(CUSTOM_CLASSES.CURRENT);
        } else {
          button.classList.remove(CUSTOM_CLASSES.CURRENT);
        }
      });
    });
    __publicField(this, "makeDisable", (button) => {
      if (button) {
        button.setAttribute("disabled", "true");
        button.setAttribute("tabindex", "-1");
      }
    });
    __publicField(this, "makeEnable", (button) => {
      if (button) {
        button.removeAttribute("disabled");
        button.setAttribute("tabindex", "0");
      }
    });
    __publicField(this, "update", () => {
      this.paginationWrapper.innerHTML = "";
      this.buttons = [];
      this.currentPage = 1;
      this.initVariables();
    });
    __publicField(this, "goToCurrent", () => {
      this.dynamicElements.forEach((item, index) => {
        const isActive = Math.ceil((index + 1) / this.itemsPerPage) === this.currentPage;
        if (isActive) {
          item.removeAttribute("style");
          item.removeAttribute("inert");
        } else {
          item.style.display = "none";
          item.setAttribute("inert", "true");
        }
      });
      this.addPageParam();
      this.addRelLinks();
    });
    __publicField(this, "addPageParam", () => {
      this.url = new URL(window.location.href);
      this.url.searchParams.set("page", this.currentPage.toString());
      window.history.pushState({}, "", this.url.href);
    });
    __publicField(this, "clickHandler", (event) => {
      const targetButton = event.target.closest(".js--pagination-button");
      if (targetButton && targetButton.getAttribute("disabled") !== "true") {
        const targetPage = targetButton.getAttribute("aria-label");
        if (targetPage === "Prev page") {
          this.currentPage -= 1;
        } else if (targetPage === "Next page") {
          this.currentPage += 1;
        } else {
          this.currentPage = +targetPage.split(" ")[1];
        }
        this.goToCurrent();
        this.createButtonsMap();
        this.updateButtonsAttrs();
      }
    });
    __publicField(this, "addRelLinks", () => {
      const links = document.head.querySelectorAll('link[rel="prev"], link[rel="next"]');
      links.forEach((link) => link.remove());
      if (this.currentPage > 1) {
        const link = document.createElement("link");
        link.setAttribute("rel", "prev");
        link.setAttribute("href", `${this.url.origin + this.url.pathname}?page=${this.currentPage - 1}`);
        document.head.append(link);
      }
      if (this.currentPage < this.totalPages) {
        const link = document.createElement("link");
        link.setAttribute("rel", "next");
        link.setAttribute("href", `${this.url.origin + this.url.pathname}?page=${this.currentPage + 1}`);
        document.head.append(link);
      }
    });
    this.component = typeof component === "string" ? document.querySelector(component) : component;
    this.paginationWrapperSelector = paginationWrapperSelector;
    this.paginationWrapper = void 0;
    this.dynamicElementSelector = dynamicElementSelector;
    this.dynamicElements = [];
    this.previousButtonInner = previousButtonInner;
    this.nextButtonInner = nextButtonInner;
    this.itemsPerPage = itemsPerPage;
    this.url = new URL(window.location.href);
    this.currentPage = 1;
    this.totalPages = 1;
    this.buttons = [];
    this.prevButton = void 0;
    this.nextButton = void 0;
    this.buttonsMap = [];
    this.emptyMapInner = "...";
    this.hiddenButtons = hiddenButtons;
    this.init();
  }
}
export {
  Pagination
};
