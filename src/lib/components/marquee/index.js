import './index.scss';

const DEFAULT_PARAMETERS = {
	marqueeParent: document.documentElement,
	marqueeMovingLineSelector: '[data-role="marquee-moving-line"]',
	marqueeListSelector: '[data-role="marquee-list"]',
	duration: 10,
	divisibleNumber: 0,
	wrapperOfVisiblePartOfMarquee: document.documentElement,
	matchMediaRule: window.matchMedia('screen'),
};

export class Marquee {
	marqueeParent;
	constructor(customParameters) {
		const parameters = { ...DEFAULT_PARAMETERS, ...customParameters };
		this.marqueeParent = parameters.marqueeParent;
		this.marqueeMovingLineElement = this.marqueeParent.querySelector(parameters.marqueeMovingLineSelector);
		this.marqueeListElement = this.marqueeParent.querySelector(parameters.marqueeListSelector);
		this.numberOfListChildren = this.marqueeListElement.children.length;
		this.duration = Number.parseInt(window.getComputedStyle(this.marqueeMovingLineElement).animationDuration, 10)
		|| parameters.duration;
		this.divisibleNumber = parameters.divisibleNumber;
		this.wrapperOfVisiblePartOfMarquee = parameters.wrapperOfVisiblePartOfMarquee;
		this.matchMediaRule = parameters.matchMediaRule;
		this.copyOfMarqueeListElement = this.marqueeListElement.cloneNode(true);
		this.listsNumber = 1;
		this.fragmentForDuplicate = undefined;
	}

	init = () => {
		// eslint-disable-next-line no-console
		if (!this.hasAllRequiredNodes()) { console.error('Marquee has not all required nodes'); return; }
		this.addCustomAttributes();
		this.initResizeObserver();
		window.marquee = this;
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
		this.marqueeMovingLineElement.dataset.marqueeRole = 'moving-line';
		this.marqueeListElement.dataset.marqueeRole = 'list';
	};


	getListsNumber = () => {
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
	};

	greatestCommonDivisor = () => {
		let firstNumber = this.divisibleNumber;
		let secondNumber = this.copyOfMarqueeListElement.children.length;

		while (secondNumber !== 0) {
			const temporary = secondNumber;
			secondNumber = firstNumber % secondNumber;
			firstNumber = temporary;
		}
		return firstNumber;
	};

	leastCommonMultiple = () => Math.abs(this.divisibleNumber * this.copyOfMarqueeListElement.children.length)
	/ this.greatestCommonDivisor();

	getCopyOfFragmentForDuplicate = () => (this.fragmentForDuplicate ? this.fragmentForDuplicate
		: this.generateListElement());

	disable = () => {
		console.log('disable');
		const copyOfFragmentForDuplicate = this.getCopyOfFragmentForDuplicate();
		this.marqueeListElement.innerHTML = '';
		this.marqueeListElement.append(copyOfFragmentForDuplicate.cloneNode(true));
		this.marqueeMovingLineElement.dataset.marqueeState = 'disabled';
	};


	update = () => {
		this.marqueeMovingLineElement.dataset.marqueeState = 'enabled';
		const listsNeeded = this.getListsNumber();

		let addedLists = 1;

		if (listsNeeded === this.listsNumber) return;

		const copyOfFragmentForDuplicate = this.getCopyOfFragmentForDuplicate();
		const numberOfCopies = copyOfFragmentForDuplicate.children.length
		/ this.copyOfMarqueeListElement.children.length;
		this.marqueeListElement.innerHTML = '';
		this.marqueeListElement.append(copyOfFragmentForDuplicate.cloneNode(true));

		while (addedLists < listsNeeded) {
			this.marqueeListElement.append(copyOfFragmentForDuplicate.cloneNode(true));
			addedLists += numberOfCopies;
		}
		this.marqueeMovingLineElement.style.animationDuration = `${(addedLists + numberOfCopies) * this.duration}s`;
		this.listsNumber = listsNeeded;
	};

	generateListElement = () => {
		const fragment = document.createDocumentFragment();
		const additionalFragment = document.createDocumentFragment();
		const childrenWithoutDuplicates = [...this.marqueeListElement.children].slice(0, this.numberOfListChildren);

		if (this.divisibleNumber > 0) {
			const leastCommonMultiple = this.leastCommonMultiple();
			const additionalElementNumbers = leastCommonMultiple - childrenWithoutDuplicates.length === 0
				? 0 : leastCommonMultiple - childrenWithoutDuplicates.length;

			for (let index = 0; index < additionalElementNumbers; index += 1) {
				additionalFragment.append(childrenWithoutDuplicates[index % childrenWithoutDuplicates.length]
					.cloneNode(true));
			}
		}

		[...childrenWithoutDuplicates, ...additionalFragment.children].forEach((element) => {
			fragment.append(element);
		});
		this.fragmentForDuplicate = fragment;
		return fragment;
	};
}


