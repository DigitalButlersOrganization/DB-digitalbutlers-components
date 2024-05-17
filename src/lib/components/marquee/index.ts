import './index.scss';
import { MarqueeCallbacks } from './interfaces';

const DEFAULT_PARAMETERS = {
	marqueeParent: document.documentElement,
	marqueeMovingLineSelector: '[data-role="marquee-moving-line"]',
	marqueeListSelector: '[data-role="marquee-list"]',
	duration: 10,
	divisibleNumber: 0,
	wrapperOfVisiblePartOfMarquee: document.documentElement,
	matchMediaRule: window.matchMedia('screen'),
	on: {},
};

export class Marquee {
	marqueeParent : HTMLElement;
	marqueeMovingLineElement : HTMLElement | null;
	marqueeListElement : HTMLElement | null;
	numberOfListChildren : number | undefined;
	duration: number;
	divisibleNumber: number;
	wrapperOfVisiblePartOfMarquee: HTMLElement;
	matchMediaRule: MediaQueryList;
	listsNumber: number;
	fragmentForDuplicate: DocumentFragment | undefined;
	on: MarqueeCallbacks = {};

	constructor(customParameters: {}) {
		const parameters = { ...DEFAULT_PARAMETERS, ...customParameters };
		this.marqueeParent = parameters.marqueeParent;
		this.marqueeMovingLineElement = this.marqueeParent.querySelector(parameters.marqueeMovingLineSelector);
		this.marqueeListElement = this.marqueeParent.querySelector(parameters.marqueeListSelector);
		this.numberOfListChildren = this.marqueeListElement?.children.length;
		this.duration = Number.parseInt(window.getComputedStyle(this.marqueeMovingLineElement as HTMLElement)
			.animationDuration, 10)
		|| parameters.duration;
		this.divisibleNumber = parameters.divisibleNumber;
		this.wrapperOfVisiblePartOfMarquee = parameters.wrapperOfVisiblePartOfMarquee;
		this.matchMediaRule = parameters.matchMediaRule;
		this.listsNumber = 1;
		this.fragmentForDuplicate = undefined;
	}

	init = () => {
		if (this.on.beforeInit) {
			this.on.beforeInit(this);
		}
		// eslint-disable-next-line no-console
		if (!this.hasAllRequiredNodes()) { console.error('Marquee has not all required nodes'); return; }
		this.addCustomAttributes();
		this.initResizeObserver();
		if (this.on.afterInit) {
			this.on.afterInit(this);
		}
	};

	initResizeObserver = () => {
		const resizeObserver = new ResizeObserver(() => {
			if (this.matchMediaRule.matches) {
				this.update();
			} else {
				this.disable();
			}
		});

		resizeObserver.observe(this.marqueeParent);
	};

	hasAllRequiredNodes = () => {
		const arrayOfRequiredParameters = [
			this.marqueeParent,
			this.marqueeMovingLineElement,
			this.marqueeListElement,
			this.wrapperOfVisiblePartOfMarquee,
		];
		return !arrayOfRequiredParameters.some((element) => !element);
	};

	addCustomAttributes = () => {
		this.marqueeParent.dataset.marqueeRole = 'parent';
		if (this.marqueeMovingLineElement) this.marqueeMovingLineElement.dataset.marqueeRole = 'moving-line';
		if (this.marqueeListElement) this.marqueeListElement.dataset.marqueeRole = 'list';
	};


	getListsNumber = () => {
		let width = 0;
		if (!this.marqueeListElement) return 2;
		const childrenWithoutDuplicates = Array.from(this.marqueeListElement.children)
			.slice(0, this.numberOfListChildren);
		childrenWithoutDuplicates.forEach((element) => {
			width += element.clientWidth;
		});
		if (width > 0) {
			const { clientWidth } = this.wrapperOfVisiblePartOfMarquee;
			return 2 * Math.ceil(clientWidth / width);
		}

		return 2;
	};

	greatestCommonDivisor = () => {
		let firstNumber : number = this.divisibleNumber;
		let secondNumber: number = this.numberOfListChildren || 0;

		while (secondNumber !== 0) {
			const temporary = secondNumber;
			if (secondNumber) {
				secondNumber = firstNumber % secondNumber;
				firstNumber = temporary;
			}
		}
		return firstNumber;
	};

	leastCommonMultiple = () => {
		if (this.numberOfListChildren) {
			return Math.abs(this.divisibleNumber * this.numberOfListChildren) / this.greatestCommonDivisor();
		}
		return 0;
	};

	getCopyOfFragmentForDuplicate = () => (this.fragmentForDuplicate ? this.fragmentForDuplicate
		: this.generateListElement());

	disable = () => {
		if (this.on.disable) {
			this.on.disable(this);
		}
		const copyOfFragmentForDuplicate = this.getCopyOfFragmentForDuplicate();
		if (this.marqueeMovingLineElement) this.marqueeMovingLineElement.dataset.marqueeState = 'disabled';
		if (this.marqueeListElement) {
			this.marqueeListElement.innerHTML = '';
			this.marqueeListElement.append(copyOfFragmentForDuplicate.cloneNode(true));
		}
	};


	update = () => {
		if (this.on.update) {
			this.on.update(this);
		}
		if (this.marqueeMovingLineElement) this.marqueeMovingLineElement.dataset.marqueeState = 'enabled';
		const listsNeeded = this.getListsNumber();

		let addedLists = 1;

		if (listsNeeded === this.listsNumber) return;
		if (!this.numberOfListChildren) return;

		const copyOfFragmentForDuplicate = this.getCopyOfFragmentForDuplicate();
		const numberOfCopies = copyOfFragmentForDuplicate.children.length
		/ this.numberOfListChildren;
		if (this.marqueeListElement) {
			this.marqueeListElement.innerHTML = '';
			this.marqueeListElement.append(copyOfFragmentForDuplicate.cloneNode(true));
		}

		while (addedLists < listsNeeded) {
			if (this.marqueeListElement) this.marqueeListElement.append(copyOfFragmentForDuplicate.cloneNode(true));
			addedLists += numberOfCopies;
		}
		if (this.marqueeMovingLineElement) {
			this.marqueeMovingLineElement.style.animationDuration = `${(addedLists + numberOfCopies) * this.duration}s`;
			this.listsNumber = listsNeeded;
		}
	};

	generateListElement = () => {
		const fragment = document.createDocumentFragment();
		const additionalFragment = document.createDocumentFragment();
		if (!this.marqueeListElement) return fragment;
		const childrenWithoutDuplicates = Array.from(this.marqueeListElement.children)
			.slice(0, this.numberOfListChildren);

		if (this.divisibleNumber > 0) {
			const leastCommonMultiple = this.leastCommonMultiple();
			const additionalElementNumbers = leastCommonMultiple - childrenWithoutDuplicates.length === 0
				? 0 : leastCommonMultiple - childrenWithoutDuplicates.length;

			for (let index = 0; index < additionalElementNumbers; index += 1) {
				additionalFragment.append(childrenWithoutDuplicates[index % childrenWithoutDuplicates.length]
					.cloneNode(true));
			}
		}

		[...childrenWithoutDuplicates, ...Array.from(additionalFragment.children)].forEach((element) => {
			fragment.append(element);
		});
		this.fragmentForDuplicate = fragment;
		return fragment;
	};
}


