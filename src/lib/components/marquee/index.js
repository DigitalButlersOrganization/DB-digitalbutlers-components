

const DEFAULT_PARAMETERS = {
	marqueeParent: document.documentElement,
	marqueeMovingLineSelector: '[data-role="marquee-moving-line"]',
	marqueeListSelector: '[data-role="marquee-list"]',
	duration: 10,
	divisibleNumber: 0,
	wrapperOfVisiblePartOfMarquee: document.documentElement,
	matchMedia: window.matchMedia('screen'),
};

export class Marquee {
	marqueeParent;
	constructor(CUSTOM_PARAMETERS) {
		const parameters = { ...DEFAULT_PARAMETERS, ...CUSTOM_PARAMETERS };
		this.marqueeParent = parameters.marqueeParent;
		this.marqueeMovingLineElement = this.marqueeParent.querySelector(parameters.marqueeMovingLineSelector);
		this.marqueeListElement = this.marqueeParent.querySelector(parameters.marqueeListSelector);
		this.duration = parameters.duration
		|| Number.parseInt(window.getComputedStyle(this.marqueeMovingLineElement).animationDuration, 10);
		this.divisibleNumber = parameters.divisibleNumber;
		this.wrapperOfVisiblePartOfMarquee = parameters.wrapperOfVisiblePartOfMarquee;
		this.matchMedia = parameters.matchMedia;
		this.copyOfMarqueeListElement = this.marqueeListElement.cloneNode(true);
		this.marqueeListElementWidth = this.marqueeListElement.clientWidth;
		this.listsNumber = 1;
	}

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

	init = () => {
		if (this.hasAllRequiredNodes()) {
			this.addCustomAttributes();
			this.update();
			this.initResizeObserver();
		} else {
			console.error('Marquee has not all required nodes');
		}
	};

	getListsNumber = () => {
		if (this.marqueeListElementWidth > 0) {
			const { clientWidth } = this.wrapperOfVisiblePartOfMarquee;
			console.log(this.marqueeListElementWidth, clientWidth);
			return 2 * Math.ceil(clientWidth / this.marqueeListElementWidth);
		}

		return 2;
	};

	leastCommonMultiple = () => Math.abs(this.divisibleNumber * this.copyOfMarqueeListElement.children.length)
	/ this.greatestCommonDivisor();


	initResizeObserver = () => {
		const resizeObserver = new ResizeObserver(() => {
			if (this.matchMedia.matches) {
				this.update();
			} else {
				this.disable();
			}
		});

		resizeObserver.observe(this.marqueeParent);
	};

	disable = () => {
		console.log('disable', this);
	};

	update = () => {
		const listsNeeded = this.getListsNumber();
		console.log(listsNeeded);
		let addedLists = 1;

		if (listsNeeded === this.listsNumber) return;

		const listElementCopy = this.generateListElement();
		const numberOfCopies = listElementCopy.children.length / this.copyOfMarqueeListElement.children.length;
		this.marqueeListElement.innerHTML = '';
		this.marqueeListElement.append(listElementCopy.cloneNode(true));

		while (addedLists < listsNeeded) {
			this.marqueeListElement.append(listElementCopy.cloneNode(true));
			addedLists += numberOfCopies;
		}
		this.marqueeMovingLineElement.style.animationDuration = `${(addedLists + numberOfCopies) * this.duration}s`;
		this.listsNumber = listsNeeded;
	};

	generateListElement = () => {
		const fragment = document.createDocumentFragment();
		const additionalFragment = document.createDocumentFragment();
		const listChildren = this.copyOfMarqueeListElement.cloneNode(true).children;

		if (this.divisibleNumber > 0) {
			const leastCommonMultiple = this.leastCommonMultiple();
			const additionalElementNumbers = leastCommonMultiple - listChildren.length === 0
				? 0 : leastCommonMultiple - listChildren.length;

			for (let index = 0; index < additionalElementNumbers; index += 1) {
				additionalFragment.append(listChildren[index % listChildren.length].cloneNode(true));
			}
		}

		[...listChildren, ...additionalFragment.children].forEach((element) => {
			fragment.append(element);
		});
		console.log(fragment);
		return fragment;
	};
}


