var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const index = "";
const DEFAULT_PARAMETERS = {
  marqueeParent: document.documentElement,
  marqueeMovingLineSelector: '[data-role="marquee-moving-line"]',
  marqueeListSelector: '[data-role="marquee-list"]',
  duration: 10,
  divisibleNumber: 0,
  wrapperOfVisiblePartOfMarquee: document.documentElement,
  matchMediaRule: window.matchMedia("screen")
};
class Marquee {
  constructor(customParameters) {
    __publicField(this, "marqueeParent");
    __publicField(this, "init", () => {
      if (!this.hasAllRequiredNodes()) {
        console.error("Marquee has not all required nodes");
        return;
      }
      this.addCustomAttributes();
      this.initResizeObserver();
      window.marquee = this;
    });
    __publicField(this, "initResizeObserver", () => {
      const resizeObserver = new ResizeObserver(() => {
        if (this.matchMediaRule.matches) {
          this.update();
        } else {
          this.disable();
        }
      });
      resizeObserver.observe(this.marqueeParent);
    });
    __publicField(this, "hasAllRequiredNodes", () => {
      const arrayOfRequiredParameters = [
        this.marqueeParent,
        this.marqueeMovingLineElement,
        this.marqueeListElement,
        this.wrapperOfVisiblePartOfMarquee
      ];
      return !arrayOfRequiredParameters.some((element) => !element);
    });
    __publicField(this, "addCustomAttributes", () => {
      this.marqueeParent.dataset.marqueeRole = "parent";
      this.marqueeMovingLineElement.dataset.marqueeRole = "moving-line";
      this.marqueeListElement.dataset.marqueeRole = "list";
    });
    __publicField(this, "getListsNumber", () => {
      let width = 0;
      const childrenWithoutDuplicates = [...this.marqueeListElement.children].slice(0, this.numberOfListChildren);
      childrenWithoutDuplicates.forEach((element) => {
        width += element.clientWidth;
      });
      if (width > 0) {
        const { clientWidth } = this.wrapperOfVisiblePartOfMarquee;
        return 2 * Math.ceil(clientWidth / width);
      }
      return 2;
    });
    __publicField(this, "greatestCommonDivisor", () => {
      let firstNumber = this.divisibleNumber;
      let secondNumber = this.copyOfMarqueeListElement.children.length;
      while (secondNumber !== 0) {
        const temporary = secondNumber;
        secondNumber = firstNumber % secondNumber;
        firstNumber = temporary;
      }
      return firstNumber;
    });
    __publicField(this, "leastCommonMultiple", () => Math.abs(this.divisibleNumber * this.copyOfMarqueeListElement.children.length) / this.greatestCommonDivisor());
    __publicField(this, "getCopyOfFragmentForDuplicate", () => this.fragmentForDuplicate ? this.fragmentForDuplicate : this.generateListElement());
    __publicField(this, "disable", () => {
      console.log("disable");
      const copyOfFragmentForDuplicate = this.getCopyOfFragmentForDuplicate();
      this.marqueeListElement.innerHTML = "";
      this.marqueeListElement.append(copyOfFragmentForDuplicate.cloneNode(true));
      this.marqueeMovingLineElement.dataset.marqueeState = "disabled";
    });
    __publicField(this, "update", () => {
      this.marqueeMovingLineElement.dataset.marqueeState = "enabled";
      const listsNeeded = this.getListsNumber();
      let addedLists = 1;
      if (listsNeeded === this.listsNumber)
        return;
      const copyOfFragmentForDuplicate = this.getCopyOfFragmentForDuplicate();
      const numberOfCopies = copyOfFragmentForDuplicate.children.length / this.copyOfMarqueeListElement.children.length;
      this.marqueeListElement.innerHTML = "";
      this.marqueeListElement.append(copyOfFragmentForDuplicate.cloneNode(true));
      while (addedLists < listsNeeded) {
        this.marqueeListElement.append(copyOfFragmentForDuplicate.cloneNode(true));
        addedLists += numberOfCopies;
      }
      this.marqueeMovingLineElement.style.animationDuration = `${(addedLists + numberOfCopies) * this.duration}s`;
      this.listsNumber = listsNeeded;
    });
    __publicField(this, "generateListElement", () => {
      const fragment = document.createDocumentFragment();
      const additionalFragment = document.createDocumentFragment();
      const childrenWithoutDuplicates = [...this.marqueeListElement.children].slice(0, this.numberOfListChildren);
      if (this.divisibleNumber > 0) {
        const leastCommonMultiple = this.leastCommonMultiple();
        const additionalElementNumbers = leastCommonMultiple - childrenWithoutDuplicates.length === 0 ? 0 : leastCommonMultiple - childrenWithoutDuplicates.length;
        for (let index2 = 0; index2 < additionalElementNumbers; index2 += 1) {
          additionalFragment.append(childrenWithoutDuplicates[index2 % childrenWithoutDuplicates.length].cloneNode(true));
        }
      }
      [...childrenWithoutDuplicates, ...additionalFragment.children].forEach((element) => {
        fragment.append(element);
      });
      this.fragmentForDuplicate = fragment;
      return fragment;
    });
    const parameters = { ...DEFAULT_PARAMETERS, ...customParameters };
    this.marqueeParent = parameters.marqueeParent;
    this.marqueeMovingLineElement = this.marqueeParent.querySelector(parameters.marqueeMovingLineSelector);
    this.marqueeListElement = this.marqueeParent.querySelector(parameters.marqueeListSelector);
    this.numberOfListChildren = this.marqueeListElement.children.length;
    this.duration = Number.parseInt(window.getComputedStyle(this.marqueeMovingLineElement).animationDuration, 10) || parameters.duration;
    this.divisibleNumber = parameters.divisibleNumber;
    this.wrapperOfVisiblePartOfMarquee = parameters.wrapperOfVisiblePartOfMarquee;
    this.matchMediaRule = parameters.matchMediaRule;
    this.copyOfMarqueeListElement = this.marqueeListElement.cloneNode(true);
    this.listsNumber = 1;
    this.fragmentForDuplicate = void 0;
  }
}
export {
  Marquee
};
