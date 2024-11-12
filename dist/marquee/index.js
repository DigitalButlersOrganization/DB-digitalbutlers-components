var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const index = "";
const DEFAULT_PARAMETERS = {
  marqueeParentSelector: '[data-role="marquee-parent"]',
  marqueeMovingLineSelector: '[data-role="marquee-moving-line"]',
  marqueeListSelector: '[data-role="marquee-list"]',
  duration: 10,
  divisibleNumber: 0,
  matchMediaRule: window.matchMedia("screen"),
  on: {}
};
class Marquee {
  constructor(customParameters) {
    __publicField(this, "marqueeParentElement");
    __publicField(this, "marqueeMovingLineElement");
    __publicField(this, "marqueeListElement");
    __publicField(this, "numberOfListChildren");
    __publicField(this, "duration");
    __publicField(this, "divisibleNumber");
    __publicField(this, "matchMediaRule");
    __publicField(this, "listsNumber");
    __publicField(this, "fragmentForDuplicate");
    __publicField(this, "on", {});
    __publicField(this, "init", () => {
      if (this.on.beforeInit) {
        this.on.beforeInit(this);
      }
      if (!this.hasAllRequiredNodes()) {
        console.error("Marquee has not all required nodes");
        return;
      }
      this.addCustomAttributes();
      this.checkImagesDownloading();
      this.initResizeObserver();
      if (this.on.afterInit) {
        this.on.afterInit(this);
      }
    });
    __publicField(this, "checkImagesDownloading", () => {
      var _a;
      const arrayOfImages = (_a = this.marqueeParentElement) == null ? void 0 : _a.querySelectorAll("img");
      if (!(arrayOfImages == null ? void 0 : arrayOfImages.length))
        return;
      arrayOfImages.forEach((element) => {
        if (element.complete)
          return;
        element.addEventListener("load", this.update);
      });
    });
    __publicField(this, "initResizeObserver", () => {
      const resizeObserver = new ResizeObserver(() => {
        if (this.matchMediaRule.matches) {
          this.update();
        } else {
          this.disable();
        }
      });
      if (this.marqueeParentElement) {
        resizeObserver.observe(this.marqueeParentElement);
      }
    });
    __publicField(this, "hasAllRequiredNodes", () => {
      const arrayOfRequiredParameters = [
        this.marqueeParentElement,
        this.marqueeMovingLineElement,
        this.marqueeListElement
      ];
      return !arrayOfRequiredParameters.some((element) => !element);
    });
    __publicField(this, "addCustomAttributes", () => {
      if (this.marqueeParentElement)
        this.marqueeParentElement.dataset.marqueeRole = "parent";
      if (this.marqueeMovingLineElement)
        this.marqueeMovingLineElement.dataset.marqueeRole = "moving-line";
      if (this.marqueeListElement)
        this.marqueeListElement.dataset.marqueeRole = "list";
    });
    __publicField(this, "getListsNumber", () => {
      let width = 0;
      if (!this.marqueeListElement)
        return 2;
      const childrenWithoutDuplicates = Array.from(this.marqueeListElement.children).slice(0, this.numberOfListChildren);
      childrenWithoutDuplicates.forEach((element) => {
        width += element.clientWidth;
      });
      if (width > 0 && this.marqueeParentElement) {
        const { clientWidth } = this.marqueeParentElement;
        return 2 * Math.ceil(clientWidth / width);
      }
      return 2;
    });
    __publicField(this, "greatestCommonDivisor", () => {
      let firstNumber = this.divisibleNumber;
      let secondNumber = this.numberOfListChildren || 0;
      while (secondNumber !== 0) {
        const temporary = secondNumber;
        if (secondNumber) {
          secondNumber = firstNumber % secondNumber;
          firstNumber = temporary;
        }
      }
      return firstNumber;
    });
    __publicField(this, "leastCommonMultiple", () => {
      if (this.numberOfListChildren) {
        return Math.abs(this.divisibleNumber * this.numberOfListChildren) / this.greatestCommonDivisor();
      }
      return 0;
    });
    __publicField(this, "getCopyOfFragmentForDuplicate", () => this.fragmentForDuplicate ? this.fragmentForDuplicate : this.generateListElement());
    __publicField(this, "disable", () => {
      if (this.on.disable) {
        this.on.disable(this);
      }
      this.listsNumber = 1;
      const copyOfFragmentForDuplicate = this.getCopyOfFragmentForDuplicate();
      if (this.marqueeParentElement)
        this.marqueeParentElement.dataset.marqueeState = "disabled";
      if (this.marqueeListElement) {
        this.marqueeListElement.innerHTML = "";
        this.marqueeListElement.append(copyOfFragmentForDuplicate.cloneNode(true));
      }
    });
    __publicField(this, "update", () => {
      if (this.on.update) {
        this.on.update(this);
      }
      if (this.marqueeParentElement)
        this.marqueeParentElement.dataset.marqueeState = "enabled";
      const listsNeeded = this.getListsNumber();
      let addedLists = 1;
      if (listsNeeded === this.listsNumber)
        return;
      if (!this.numberOfListChildren)
        return;
      const copyOfFragmentForDuplicate = this.getCopyOfFragmentForDuplicate();
      const numberOfCopies = copyOfFragmentForDuplicate.children.length / this.numberOfListChildren;
      if (this.marqueeListElement) {
        this.marqueeListElement.innerHTML = "";
        this.marqueeListElement.append(copyOfFragmentForDuplicate.cloneNode(true));
      }
      while (addedLists < listsNeeded) {
        if (this.marqueeListElement)
          this.marqueeListElement.append(copyOfFragmentForDuplicate.cloneNode(true));
        addedLists += numberOfCopies;
      }
      if (this.marqueeMovingLineElement) {
        this.marqueeMovingLineElement.style.animationDuration = `${(addedLists + numberOfCopies) * this.duration}s`;
        this.listsNumber = listsNeeded;
      }
    });
    __publicField(this, "generateListElement", () => {
      const fragment = document.createDocumentFragment();
      const additionalFragment = document.createDocumentFragment();
      if (!this.marqueeListElement)
        return fragment;
      const childrenWithoutDuplicates = Array.from(this.marqueeListElement.children).slice(0, this.numberOfListChildren);
      if (this.divisibleNumber > 0) {
        const leastCommonMultiple = this.leastCommonMultiple();
        const additionalElementNumbers = leastCommonMultiple - childrenWithoutDuplicates.length === 0 ? 0 : leastCommonMultiple - childrenWithoutDuplicates.length;
        for (let index2 = 0; index2 < additionalElementNumbers; index2 += 1) {
          additionalFragment.append(childrenWithoutDuplicates[index2 % childrenWithoutDuplicates.length].cloneNode(true));
        }
      }
      [...childrenWithoutDuplicates, ...Array.from(additionalFragment.children)].forEach((element) => {
        fragment.append(element);
      });
      this.fragmentForDuplicate = fragment;
      return fragment;
    });
    var _a, _b, _c;
    const parameters = { ...DEFAULT_PARAMETERS, ...customParameters };
    this.marqueeParentElement = document.querySelector(parameters.marqueeParentSelector);
    this.marqueeMovingLineElement = (_a = this.marqueeParentElement) == null ? void 0 : _a.querySelector(parameters.marqueeMovingLineSelector);
    this.marqueeListElement = (_b = this.marqueeParentElement) == null ? void 0 : _b.querySelector(parameters.marqueeListSelector);
    this.numberOfListChildren = (_c = this.marqueeListElement) == null ? void 0 : _c.children.length;
    this.duration = Number.parseInt(window.getComputedStyle(this.marqueeMovingLineElement).animationDuration, 10) || parameters.duration;
    this.divisibleNumber = parameters.divisibleNumber;
    this.matchMediaRule = parameters.matchMediaRule;
    this.listsNumber = 1;
    this.fragmentForDuplicate = void 0;
    this.on = parameters.on;
  }
}
export {
  Marquee
};
