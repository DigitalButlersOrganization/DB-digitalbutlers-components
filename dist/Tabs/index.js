"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var _tabpanelsListSelector, _tabbuttonsListSelector, _deletableTabs, _autoplay, _autoplayTimeout, _listenersAdded, _equalHeight, _destroyed, _inited, _defaultRoles, _defaultSelectors;
Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
const CLASSES = {
  ACTIVE: "js--active",
  UNACTIVE: "js--unactive",
  VISIBLE: "js--visible"
};
const CUSTOM_CLASSES = {
  TAB: "js--tab",
  PANEL: "js--panel",
  TABS_WRAPPER: "js--tabs-wrapper",
  TAB_LIST: "js--tab-list",
  PANEL_LIST: "js--panel-list",
  ANIMATED_FADE: "js--animated-fade",
  ANIMATED_OPACITY: "js--animated-opacity",
  ANIMATED_SLIDE: "js--animated-slide"
};
const KEYS = {
  END: "End",
  HOME: "Home",
  LEFT: "ArrowLeft",
  UP: "ArrowUp",
  RIGHT: "ArrowRight",
  DOWN: "ArrowDown",
  DELETE: "Delete",
  ENTER: "Enter",
  SPACE: " "
};
const getChildrenArray = (element) => element ? Array.prototype.slice.call(element.children) : [];
const getRandomId = (length = 5) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};
const index = "";
var TriggerEvents;
(function(TriggerEvents2) {
  TriggerEvents2["click"] = "click";
  TriggerEvents2["mouseover"] = "mouseover";
})(TriggerEvents || (TriggerEvents = {}));
class Tabs {
  constructor(tabsWrapper = '[data-tabs="wrapper"]', { tabbuttonsListSelector = '[data-tabs="tabs"]', tabpanelsListSelector = '[data-tabs="content"]', deletableTabs = false, initialTab = 0, equalHeight = false, orientation = "horizontal", triggerEvent = TriggerEvents.click, autoplay = {
    delay: 0
  }, on = {}, matchMediaRule }) {
    __privateAdd(this, _tabpanelsListSelector, void 0);
    __privateAdd(this, _tabbuttonsListSelector, void 0);
    __publicField(this, "activeIndex");
    __publicField(this, "nextIndex");
    __publicField(this, "prevIndex");
    __publicField(this, "lastIndex");
    __privateAdd(this, _deletableTabs, void 0);
    __publicField(this, "orientation");
    __publicField(this, "triggerEvent");
    __privateAdd(this, _autoplay, void 0);
    __privateAdd(this, _autoplayTimeout, void 0);
    __privateAdd(this, _listenersAdded, void 0);
    __publicField(this, "generatedId");
    __privateAdd(this, _equalHeight, void 0);
    __publicField(this, "tabsWrapper");
    __publicField(this, "tabButtonsList");
    __publicField(this, "tabPanelsList");
    __publicField(this, "tabs");
    __publicField(this, "panels");
    __publicField(this, "on");
    __privateAdd(this, _destroyed, void 0);
    __privateAdd(this, _inited, void 0);
    __privateAdd(this, _defaultRoles, void 0);
    __privateAdd(this, _defaultSelectors, void 0);
    __publicField(this, "matchMediaRule");
    __publicField(this, "isInMatchMedia");
    __publicField(this, "checkMatchMedia", () => {
      this.isInMatchMedia = !this.matchMediaRule || window.matchMedia(this.matchMediaRule).matches;
    });
    __publicField(this, "setEqualHeight", () => {
      this.panels.forEach((element) => {
        element.style.height = "auto";
      });
      const maxHeight = Math.max(...this.panels.map((element) => element.offsetHeight));
      this.panels.forEach((element) => {
        element.style.height = `${maxHeight}px`;
      });
    });
    __publicField(this, "goTo", (index2, setFocus = true) => {
      if (this.activeIndex !== index2 || !__privateGet(this, _inited)) {
        this.activeIndex = index2;
        this.updateProperties();
        this.setUnactiveAll();
        this.setActiveAttributes(index2);
        this.setActiveClasses(index2);
        if (setFocus) {
          this.focusTab(index2);
        }
        if (this.on.tabChange) {
          this.on.tabChange(this);
        }
      }
    });
    __publicField(this, "goToNext", () => {
      this.goTo(this.nextIndex);
    });
    __publicField(this, "goToPrev", () => {
      this.goTo(this.prevIndex);
    });
    __publicField(this, "stopAutoPlay", () => {
      clearTimeout(__privateGet(this, _autoplayTimeout));
    });
    __publicField(this, "changeTriggerEvent", (eventName) => {
      if (eventName in TriggerEvents) {
        this.removeListenersForTabs();
        this.triggerEvent = eventName;
        this.addListenersForTabs();
      } else {
        console.error("Icorrect type of event");
      }
    });
    __publicField(this, "runAutoPlay", () => {
      __privateSet(this, _autoplayTimeout, setTimeout(() => {
        this.goTo(this.nextIndex, false);
        this.runAutoPlay();
      }, __privateGet(this, _autoplay).delay));
    });
    __publicField(this, "addListenersForTabs", () => {
      this.tabsWrapper.addEventListener(this.triggerEvent, this.clickHandler);
      window.addEventListener("keydown", this.keydownHandler);
    });
    __publicField(this, "removeListenersForTabs", () => {
      this.tabsWrapper.removeEventListener(this.triggerEvent, this.clickHandler);
      window.removeEventListener("keydown", this.keydownHandler);
    });
    __publicField(this, "clickHandler", (event) => {
      if (this.isInMatchMedia) {
        this.stopAutoPlay();
        const { targetIndex, targetButton } = this.getEventDetails(event);
        if (targetIndex !== void 0 && this.tabs.includes(targetButton)) {
          this.goTo(+targetIndex);
        }
      }
    });
    __publicField(this, "keydownHandler", (event) => {
      if (this.isInMatchMedia) {
        const eventDetails = this.getEventDetails(event);
        const { targetButton, targetIndex, key } = eventDetails;
        if (targetButton && targetIndex !== void 0 && this.tabs.includes(targetButton)) {
          this.stopAutoPlay();
          switch (key) {
            case KEYS.LEFT:
            case KEYS.RIGHT: {
              event.preventDefault();
              if (this.orientation === "horizontal") {
                this.switchTabOnArrowPress(eventDetails);
              }
              break;
            }
            case KEYS.UP:
            case KEYS.DOWN: {
              event.preventDefault();
              if (this.orientation === "vertical") {
                this.switchTabOnArrowPress(eventDetails);
              }
              break;
            }
            case KEYS.DELETE: {
              event.preventDefault();
              this.deleteTab(eventDetails);
              break;
            }
            case KEYS.ENTER: {
              event.preventDefault();
              this.goTo(+targetIndex);
              break;
            }
            case KEYS.SPACE: {
              event.preventDefault();
              targetButton.click();
              break;
            }
            case KEYS.END: {
              event.preventDefault();
              this.focusTab(this.lastIndex);
              break;
            }
            case KEYS.HOME: {
              event.preventDefault();
              this.focusTab(0);
              break;
            }
          }
        }
      }
    });
    __publicField(this, "setUnactiveAll", () => {
      this.setUnactiveAttributesAll();
      [this.tabs, this.panels].flat().forEach((element) => {
        element.classList.remove(CLASSES.ACTIVE);
        element.classList.add(CLASSES.UNACTIVE);
      });
    });
    __publicField(this, "setUnactiveAttributesAll", () => {
      this.tabs.forEach((tabElement) => {
        tabElement.setAttribute("tabindex", "-1");
        tabElement.setAttribute("aria-selected", "false");
      });
      this.panels.forEach((tabpanel) => {
        tabpanel.setAttribute("inert", "true");
      });
    });
    __publicField(this, "setActiveAttributes", (index2) => {
      this.tabs[index2].setAttribute("tabindex", "0");
      this.tabs[index2].setAttribute("aria-selected", "true");
      this.panels[index2].removeAttribute("inert");
    });
    __publicField(this, "setActiveClasses", (index2) => {
      this.tabs[index2].classList.remove(CLASSES.UNACTIVE);
      this.tabs[index2].classList.add(CLASSES.ACTIVE);
      this.panels[index2].classList.remove(CLASSES.UNACTIVE);
      this.panels[index2].classList.add(CLASSES.ACTIVE);
    });
    __publicField(this, "focusTab", (order) => {
      this.tabs[order].focus();
    });
    __publicField(this, "switchTabOnArrowPress", (eventDetails) => {
      const { key, targetIndex, event } = eventDetails;
      event.preventDefault();
      switch (key) {
        case KEYS.LEFT:
        case KEYS.UP: {
          if (targetIndex !== void 0) {
            const nextIndex = targetIndex - 1 < 0 ? Number(this.lastIndex) : targetIndex - 1;
            if (this.triggerEvent === TriggerEvents.mouseover) {
              this.goTo(nextIndex);
            } else {
              this.focusTab(nextIndex);
            }
          }
          break;
        }
        case KEYS.RIGHT:
        case KEYS.DOWN: {
          if (targetIndex !== void 0) {
            const nextIndex = targetIndex >= Number(this.lastIndex) ? 0 : targetIndex + 1;
            if (this.triggerEvent === TriggerEvents.mouseover) {
              this.goTo(nextIndex);
            } else {
              this.focusTab(nextIndex);
            }
          }
          break;
        }
      }
    });
    __publicField(this, "deleteTab", (eventDetails) => {
      const { targetButton, targetIndex } = eventDetails;
      if (targetButton.dataset.deletable === "true" && targetIndex !== void 0) {
        this.tabs[targetIndex].remove();
        this.panels[targetIndex].remove();
        this.update();
        if (this.tabs.length > 0 && this.panels.length > 0) {
          const newTabsLength = this.tabs.length - 1;
          if (targetIndex < this.activeIndex || this.activeIndex > newTabsLength) {
            this.goTo(this.activeIndex - 1);
          } else {
            this.goTo(this.activeIndex);
          }
        }
      }
    });
    __publicField(this, "assignTabsAttributes", () => {
      var _a, _b;
      this.tabsWrapper.classList.add(CUSTOM_CLASSES.TABS_WRAPPER);
      this.tabsWrapper.setAttribute("aria-orientation", this.orientation);
      (_a = this.tabButtonsList) == null ? void 0 : _a.classList.add(CUSTOM_CLASSES.TAB_LIST);
      (_b = this.tabPanelsList) == null ? void 0 : _b.classList.add(CUSTOM_CLASSES.PANEL_LIST);
      this.tabs.forEach((tab, index2) => {
        tab.classList.add(CUSTOM_CLASSES.TAB);
        tab.setAttribute("aria-label", `${index2}`);
        tab.setAttribute("role", __privateGet(this, _defaultRoles).tab);
        tab.setAttribute("id", `${this.generatedId}-tab-${index2}`);
        tab.setAttribute("aria-controls", `${this.generatedId}-tabpanel-${index2}`);
        tab.dataset.deletable = `${__privateGet(this, _deletableTabs)}`;
        this.panels[index2].classList.add(CUSTOM_CLASSES.PANEL);
        this.panels[index2].setAttribute("aria-labelledby", `${this.generatedId}-tab-${index2}`);
        this.panels[index2].setAttribute("id", `${this.generatedId}-tabpanel-${index2}`);
        this.panels[index2].setAttribute("aria-label", `${index2}`);
        this.panels[index2].setAttribute("role", __privateGet(this, _defaultRoles).tabpanel);
      });
      this.setUnactiveAll();
    });
    __publicField(this, "removeTabsAttributes", () => {
      var _a, _b;
      this.tabsWrapper.classList.remove(CUSTOM_CLASSES.TABS_WRAPPER);
      this.tabsWrapper.removeAttribute("aria-orientation");
      (_a = this.tabButtonsList) == null ? void 0 : _a.classList.remove(CUSTOM_CLASSES.TAB_LIST);
      (_b = this.tabPanelsList) == null ? void 0 : _b.classList.remove(CUSTOM_CLASSES.PANEL_LIST);
      this.tabs.forEach((tab, index2) => {
        tab.classList.remove(CUSTOM_CLASSES.TAB);
        tab.classList.remove(CLASSES.ACTIVE);
        tab.classList.remove(CLASSES.UNACTIVE);
        tab.removeAttribute("tabindex");
        tab.removeAttribute("aria-label");
        tab.removeAttribute("aria-selected");
        tab.removeAttribute("role");
        tab.removeAttribute("id");
        tab.removeAttribute("aria-controls");
        delete tab.dataset.deletable;
        this.panels[index2].classList.remove(CUSTOM_CLASSES.PANEL);
        this.panels[index2].classList.remove(CLASSES.ACTIVE);
        this.panels[index2].classList.remove(CLASSES.UNACTIVE);
        this.panels[index2].removeAttribute("aria-labelledby");
        this.panels[index2].removeAttribute("id");
        this.panels[index2].removeAttribute("aria-label");
        this.panels[index2].removeAttribute("role");
        this.panels[index2].removeAttribute("inert");
      });
    });
    __publicField(this, "getEventDetails", (event) => {
      const key = event instanceof KeyboardEvent ? event.key : void 0;
      const target = event.target;
      const targetTab = target.closest(__privateGet(this, _defaultSelectors).tab);
      const targetIndex = targetTab == null ? void 0 : targetTab.getAttribute("aria-label");
      return {
        target,
        targetIndex: targetIndex ? +targetIndex : void 0,
        targetButton: targetTab,
        key,
        event
      };
    });
    __publicField(this, "updateProperties", () => {
      this.lastIndex = this.tabs.length - 1;
      this.nextIndex = this.activeIndex >= this.lastIndex ? 0 : this.activeIndex + 1;
      this.prevIndex = this.activeIndex - 1 < 0 ? this.lastIndex : this.activeIndex - 1;
    });
    __publicField(this, "update", () => {
      this.tabs = getChildrenArray(this.tabButtonsList);
      this.panels = getChildrenArray(this.tabPanelsList);
      this.updateProperties();
      this.assignTabsAttributes();
    });
    __publicField(this, "destroy", () => {
      this.removeTabsAttributes();
      this.removeListenersForTabs();
      window.removeEventListener("resize", this.setEqualHeight);
      __privateSet(this, _destroyed, true);
    });
    __privateSet(this, _tabpanelsListSelector, tabpanelsListSelector);
    __privateSet(this, _tabbuttonsListSelector, tabbuttonsListSelector);
    __privateSet(this, _deletableTabs, deletableTabs);
    this.tabsWrapper = typeof tabsWrapper === "string" ? document.querySelector(tabsWrapper) : tabsWrapper;
    this.tabButtonsList = void 0;
    this.tabPanelsList = void 0;
    this.tabButtonsList = void 0;
    this.tabs = [];
    this.panels = [];
    this.orientation = orientation === "vertical" ? "vertical" : "horizontal";
    this.triggerEvent = triggerEvent;
    this.activeIndex = initialTab;
    this.nextIndex = void 0;
    this.prevIndex = void 0;
    this.lastIndex = void 0;
    __privateSet(this, _autoplay, autoplay);
    __privateSet(this, _autoplayTimeout, 0);
    __privateSet(this, _listenersAdded, false);
    this.on = on;
    this.matchMediaRule = matchMediaRule;
    this.isInMatchMedia = false;
    this.generatedId = getRandomId();
    __privateSet(this, _equalHeight, equalHeight);
    __privateSet(this, _defaultRoles, {
      tab: "tab",
      tabpanel: "tabpanel"
    });
    __privateSet(this, _defaultSelectors, {
      tab: '[role="tab"]',
      tabpanel: '[role="tabpanel"]'
    });
    __privateSet(this, _destroyed, false);
    __privateSet(this, _inited, false);
    this.init();
  }
  init() {
    if (this.tabsWrapper && !__privateGet(this, _destroyed)) {
      if (this.on.beforeInit) {
        this.on.beforeInit(this);
      }
      this.checkMatchMedia();
      window.addEventListener("resize", this.checkMatchMedia);
      this.tabButtonsList = this.tabsWrapper.querySelector(__privateGet(this, _tabbuttonsListSelector));
      this.tabPanelsList = this.tabsWrapper.querySelector(__privateGet(this, _tabpanelsListSelector));
      if (this.tabButtonsList && this.tabPanelsList) {
        this.tabs = getChildrenArray(this.tabButtonsList);
        this.panels = getChildrenArray(this.tabPanelsList);
        if (this.tabs.length > 0 && this.tabs.length === this.panels.length) {
          if (__privateGet(this, _equalHeight)) {
            this.setEqualHeight();
            window.addEventListener("resize", this.setEqualHeight);
          }
          this.assignTabsAttributes();
          if (!__privateGet(this, _listenersAdded)) {
            this.addListenersForTabs();
            __privateSet(this, _listenersAdded, true);
          }
          this.goTo(this.activeIndex, false);
          if (__privateGet(this, _autoplay).delay > 0 && this.isInMatchMedia) {
            this.runAutoPlay();
          }
        }
      }
      __privateSet(this, _inited, true);
      if (this.on.afterInit) {
        this.on.afterInit(this);
      }
    }
  }
}
_tabpanelsListSelector = new WeakMap();
_tabbuttonsListSelector = new WeakMap();
_deletableTabs = new WeakMap();
_autoplay = new WeakMap();
_autoplayTimeout = new WeakMap();
_listenersAdded = new WeakMap();
_equalHeight = new WeakMap();
_destroyed = new WeakMap();
_inited = new WeakMap();
_defaultRoles = new WeakMap();
_defaultSelectors = new WeakMap();
exports.Tabs = Tabs;
