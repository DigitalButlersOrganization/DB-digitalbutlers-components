import './index.scss';
import { MarqueeCallbacks } from './interfaces';

const DEFAULT_PARAMETERS = {
	marqueeParentSelector: '[data-role="marquee-parent"]',
	marqueeMovingLineSelector: '[data-role="marquee-moving-line"]',
	marqueeListSelector: '[data-role="marquee-list"]',
	duration: 10,
	divisibleNumber: 0,
	matchMediaRule: window.matchMedia('screen'),
	on: {},
};

export class Marquee {
	marqueeParentElement: HTMLElement | null;
	marqueeMovingLineElement: HTMLElement | null | undefined;
	marqueeListElement: HTMLElement | null | undefined;
	numberOfListChildren: number | undefined;
	duration: number;
	divisibleNumber: number;
	matchMediaRule: MediaQueryList;
	listsNumber: number;
	fragmentForDuplicate: DocumentFragment | undefined;
	on: MarqueeCallbacks = {};

	constructor(customParameters: {}) {
		const parameters = { ...DEFAULT_PARAMETERS, ...customParameters };
		this.marqueeParentElement = document.querySelector(parameters.marqueeParentSelector);
		this.marqueeMovingLineElement = this.marqueeParentElement?.querySelector(parameters.marqueeMovingLineSelector);
		this.marqueeListElement = this.marqueeParentElement?.querySelector(parameters.marqueeListSelector);
		this.numberOfListChildren = this.marqueeListElement?.children.length;
		// eslint-disable-next-line operator-linebreak
		this.duration =
			Number.parseInt(window.getComputedStyle(this.marqueeMovingLineElement as HTMLElement).animationDuration, 10) ||
			parameters.duration;
		this.divisibleNumber = parameters.divisibleNumber;
		this.matchMediaRule = parameters.matchMediaRule;
		this.listsNumber = 1;
		this.fragmentForDuplicate = undefined;
		this.on = parameters.on;
	}

	init = () => {
		if (this.on.beforeInit) {
			this.on.beforeInit(this);
		}
		// eslint-disable-next-line no-console
		if (!this.hasAllRequiredNodes()) {
			console.error('Marquee has not all required nodes');
			return;
		}
		this.addCustomAttributes();
		this.checkImagesDownloading();
		this.initResizeObserver();
		if (this.on.afterInit) {
			this.on.afterInit(this);
		}
	};

	checkImagesDownloading = () => {
		const arrayOfImages = this.marqueeParentElement?.querySelectorAll('img');
		if (!arrayOfImages?.length) return;

		arrayOfImages.forEach((element) => {
			if (element.complete) return;
			element.addEventListener('load', this.update);
		});
	};

	initResizeObserver = () => {
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
	};

	hasAllRequiredNodes = () => {
		const arrayOfRequiredParameters = [
			this.marqueeParentElement,
			this.marqueeMovingLineElement,
			this.marqueeListElement,
		];
		return !arrayOfRequiredParameters.some((element) => !element);
	};

	addCustomAttributes = () => {
		if (this.marqueeParentElement) this.marqueeParentElement.dataset.marqueeRole = 'parent';
		if (this.marqueeMovingLineElement) this.marqueeMovingLineElement.dataset.marqueeRole = 'moving-line';
		if (this.marqueeListElement) this.marqueeListElement.dataset.marqueeRole = 'list';
	};

	getListsNumber = () => {
		let width = 0;
		if (!this.marqueeListElement) return 2;
		const childrenWithoutDuplicates = Array.from(this.marqueeListElement.children).slice(0, this.numberOfListChildren);
		childrenWithoutDuplicates.forEach((element) => {
			width += element.clientWidth;
		});
		if (width > 0 && this.marqueeParentElement) {
			const { clientWidth } = this.marqueeParentElement;
			return 2 * Math.ceil(clientWidth / width);
		}

		return 2;
	};

	greatestCommonDivisor = () => {
		let firstNumber: number = this.divisibleNumber;
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

	// eslint-disable-next-line no-confusing-arrow
	getCopyOfFragmentForDuplicate = () =>
		// eslint-disable-next-line implicit-arrow-linebreak
		this.fragmentForDuplicate ? this.fragmentForDuplicate : this.generateListElement();

	disable = () => {
		if (this.on.disable) {
			this.on.disable(this);
		}
		this.listsNumber = 1;
		const copyOfFragmentForDuplicate = this.getCopyOfFragmentForDuplicate();
		if (this.marqueeParentElement) this.marqueeParentElement.dataset.marqueeState = 'disabled';
		if (this.marqueeListElement) {
			this.marqueeListElement.innerHTML = '';
			this.marqueeListElement.append(copyOfFragmentForDuplicate.cloneNode(true));
		}
	};

	update = () => {
		if (this.on.update) {
			this.on.update(this);
		}
		if (this.marqueeParentElement) this.marqueeParentElement.dataset.marqueeState = 'enabled';
		const listsNeeded = this.getListsNumber();

		let addedLists = 1;

		if (listsNeeded === this.listsNumber) return;

		if (!this.numberOfListChildren) return;

		const copyOfFragmentForDuplicate = this.getCopyOfFragmentForDuplicate();
		const numberOfCopies = copyOfFragmentForDuplicate.children.length / this.numberOfListChildren;
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
		const childrenWithoutDuplicates = Array.from(this.marqueeListElement.children).slice(0, this.numberOfListChildren);

		if (this.divisibleNumber > 0) {
			const leastCommonMultiple = this.leastCommonMultiple();
			// eslint-disable-next-line operator-linebreak
			const additionalElementNumbers =
				leastCommonMultiple - childrenWithoutDuplicates.length === 0
					? 0
					: leastCommonMultiple - childrenWithoutDuplicates.length;

			for (let index = 0; index < additionalElementNumbers; index += 1) {
				additionalFragment.append(childrenWithoutDuplicates[index % childrenWithoutDuplicates.length].cloneNode(true));
			}
		}

		[...childrenWithoutDuplicates, ...Array.from(additionalFragment.children)].forEach((element) => {
			fragment.append(element);
		});
		this.fragmentForDuplicate = fragment;
		return fragment;
	};
}
