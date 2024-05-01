import { getRandomId } from '../../utils/get-random-id';
import {
	PARAMS_KEY, PARAMS, AccordionElement, AccordionProperties,
} from './interfaces';

const DESTROYED_TYPES = {
	MANUAL: 'manual',
	BREAKPOINT: 'breakpoint',
};

const ATTRIBUTES_PREFIX = 'data-accordion-';
const ATTRIBUTES = {
	IS_SINGLE: `${ATTRIBUTES_PREFIX}is-single`,
};
const DEFAULTS = {
	openClass: 'js--open',
	parentElement: document,
	accordionSelector: '[data-role="accordion"]',
	itemSelector: '[data-role="accordion-item"]',
	summarySelector: '[data-role="accordion-summary"]',
	detailsSelector: '[data-role="accordion-details"]',
	breakpoint: window.matchMedia('screen'),
	onDetailsTransitionEnd: () => {},
	isSingle: false,
};

export class Accordions {
	instanceId: string | undefined;
	openClass: string;
	accordionSelector: string;
	itemSelector: string;
	summarySelector: string;
	detailsSelector: string;
	isSingle: boolean;
	breakpoint: MediaQueryList;
	parentElement: HTMLElement | Document;
	elements: AccordionElement[];
	itemElements: AccordionElement[];
	isDestroyed: boolean;
	destroyedBy: string | undefined;
	onDetailsTransitionEnd: () => void;

	constructor(customParameters = {}) {
		const parameters = {
			...DEFAULTS,
			...customParameters,
		};

		this.instanceId = undefined;
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
		this.destroyedBy = undefined;

		this.onDetailsTransitionEnd = parameters.onDetailsTransitionEnd || (() => {});

		this.init();
	}

	// Instance id
	updateInstanceId = () => {
		this.instanceId = Accordions.generateInstanceId();
	};

	static generateInstanceId = (): string => {
		const instanceId = getRandomId();

		return this.isInstanceIdUnique(instanceId) ? instanceId : this.generateInstanceId();
	};

	static isInstanceIdUnique = (instanceId: string): boolean => !document.querySelector(`[id^="accordion-${instanceId}]"`);

	// Elements ids
	generateAccordionId = (accordionId: string | number) => `accordion-${this.instanceId}-${accordionId}`;

	generateItemId = (itemId: string | number) => `accordion-item-${this.instanceId}-${itemId}`;

	generateSummaryId = (itemId: string | number) => `accordion-summary-${this.instanceId}-${itemId}`;

	generateDetailsId = (itemId: string | number) => `accordion-details-${this.instanceId}-${itemId}`;

	getItemById = (itemId: string) => this.itemElements
		.find((itemElement) => itemElement[PARAMS_KEY]?.[PARAMS.ITEM_ID] === itemId);

	getAccordionById = (accordionId: string) => this.elements
		.find((accordionElement) => accordionElement[PARAMS_KEY]?.[PARAMS.ACCORDION_ID] === accordionId);

	// Initialisation
	initAccordions = () => {
		this.elements = Array.from(this.parentElement.querySelectorAll(this.accordionSelector));

		this.elements.forEach((accordionElement, accordionIndex) => {
			this.initAccordion(accordionElement, accordionIndex);
		});
	};

	initAccordion = (accordionElement: AccordionElement, accordionId: number) => {
		if (accordionElement[PARAMS_KEY]) {
			return;
		}
		const parentItemElement = accordionElement.closest(this.itemSelector) as AccordionElement ?? undefined;
		if (parentItemElement && !parentItemElement[PARAMS_KEY]) {
			parentItemElement[PARAMS_KEY] = {};
		}
		const parentItemId = parentItemElement
			&& (parentItemElement[PARAMS_KEY] as AccordionProperties)[PARAMS.ITEM_ID];
		const isSingle = accordionElement.hasAttribute(ATTRIBUTES.IS_SINGLE)
			? accordionElement.getAttribute(ATTRIBUTES.IS_SINGLE) === 'true'
			: this.isSingle;

		accordionElement[PARAMS_KEY] = {};
		accordionElement[PARAMS_KEY][PARAMS.ACCORDION_ID] = String(accordionId);
		accordionElement[PARAMS_KEY][PARAMS.ITEMS_IDS] = [];
		accordionElement[PARAMS_KEY][PARAMS.IS_SINGLE] = isSingle;

		accordionElement.id = this.generateAccordionId(accordionId);

		const accordionChildren = Array.from(accordionElement.children) as AccordionElement[];

		const itemElements = accordionChildren
			.filter((element) => element.matches(this.itemSelector));

		itemElements.forEach((itemElement, itemIndex) => {
			const itemId = `${accordionId}-${itemIndex}`;

			this.initItem({
				itemElement,
				itemId,
				accordionId,
				parentItemId,
			});
			((accordionElement[PARAMS_KEY] as AccordionProperties)[PARAMS.ITEMS_IDS] as string[]).push(itemId);
		});
	};

	initItem = ({
		itemElement, itemId, accordionId, parentItemId,
	}: { itemElement: AccordionElement, itemId: string, accordionId: number, parentItemId?: string }) => {
		if (itemElement[PARAMS_KEY]) {
			return;
		}

		const summaryElement = itemElement.querySelector(this.summarySelector) as AccordionElement ?? undefined;
		const detailsElement = itemElement.querySelector(this.detailsSelector) as AccordionElement ?? undefined;

		const summaryId = this.generateSummaryId(itemId);
		const detailsId = this.generateDetailsId(itemId);

		itemElement.id = this.generateItemId(itemId);
		itemElement[PARAMS_KEY] = {};
		itemElement[PARAMS_KEY][PARAMS.ITEM_ID] = itemId;
		itemElement[PARAMS_KEY][PARAMS.ACCORDION_ID] = String(accordionId);
		itemElement[PARAMS_KEY][PARAMS.SUMMARY_ELEMENT] = summaryElement;
		itemElement[PARAMS_KEY][PARAMS.DETAILS_ELEMENT] = detailsElement;

		this.itemElements.push(itemElement);

		summaryElement.setAttribute('tabindex', '0');
		summaryElement.setAttribute('id', summaryId);
		summaryElement.setAttribute('aria-controls', detailsId);
		summaryElement[PARAMS_KEY] = {};
		summaryElement[PARAMS_KEY][PARAMS.ITEM_ID] = itemId;

		detailsElement.setAttribute('id', detailsId);
		detailsElement.setAttribute('aria-labelledby', summaryId);
		detailsElement[PARAMS_KEY] = {};
		detailsElement[PARAMS_KEY][PARAMS.ITEM_ID] = itemId;
		if (parentItemId) {
			detailsElement.addEventListener('transitionend', this.onDetailsTransitionEnd);
		}
		summaryElement.addEventListener('click', this.onSummaryClick);
	};

	// Destroying
	destroyAccordion = (accordion: AccordionElement | string) => {
		const accordionElement = typeof accordion === 'string' ? this.getAccordionById(accordion) : accordion;

		if (!accordionElement || !accordionElement[PARAMS_KEY]) {
			return;
		}

		const accordionItemsElements = this.itemElements
			.filter((itemElement) => {
				if (!itemElement[PARAMS_KEY] || !accordionElement[PARAMS_KEY]) {
					return false;
				}
				return itemElement[PARAMS_KEY][PARAMS.ACCORDION_ID]
					=== accordionElement[PARAMS_KEY][PARAMS.ACCORDION_ID];
			});

		accordionItemsElements.forEach((accordionItemElement) => {
			this.destroyItem(accordionItemElement);
		});

		this.elements = this.elements
			.filter((element) => {
				if (!element[PARAMS_KEY] || !accordionElement[PARAMS_KEY]) {
					return false;
				}
				return element[PARAMS_KEY][PARAMS.ACCORDION_ID]
					!== accordionElement[PARAMS_KEY][PARAMS.ACCORDION_ID];
			});
		delete accordionElement[PARAMS_KEY];
		accordionElement.removeAttribute('id');
	};

	destroyItem = (item: AccordionElement | string) => {
		const itemElement = typeof item === 'string' ? this.getItemById(item) : item;

		if (!itemElement || !itemElement[PARAMS_KEY]) {
			return;
		}

		const summaryElement = itemElement[PARAMS_KEY][PARAMS.SUMMARY_ELEMENT] as AccordionElement ?? undefined;
		const detailsElement = itemElement[PARAMS_KEY][PARAMS.DETAILS_ELEMENT] as AccordionElement ?? undefined;

		this.itemElements = this.itemElements
			.filter((itemElement_) => {
				if (!itemElement_[PARAMS_KEY] || !itemElement[PARAMS_KEY]) {
					return false;
				}
				return itemElement_[PARAMS_KEY][PARAMS.ITEM_ID] !== itemElement[PARAMS_KEY][PARAMS.ITEM_ID];
			});
		delete itemElement[PARAMS_KEY];
		itemElement.removeAttribute('id');

		if (summaryElement) {
			if (summaryElement[PARAMS_KEY]) {
				delete summaryElement[PARAMS_KEY];
			}
			summaryElement.removeAttribute('id');
			summaryElement.removeAttribute('aria-controls');
			summaryElement.removeAttribute('aria-expanded');
		}

		delete detailsElement[PARAMS_KEY];
		detailsElement.removeAttribute('id');
		detailsElement.removeAttribute('aria-labelledby');
		detailsElement.removeAttribute('inert');

		summaryElement.removeEventListener('click', this.onSummaryClick);
	};

	// Event handlers
	onSummaryClick = (event: MouseEvent) => {
		if (!this.breakpoint.matches) {
			return;
		}
		const itemId = (event.currentTarget as AccordionElement)[PARAMS_KEY]?.[PARAMS.ITEM_ID];
		if (itemId) {
			this.toggle(itemId);
		}
	};

	onBreakpointChange = () => {
		if (this.breakpoint.matches) {
			if (this.isDestroyed && this.destroyedBy === DESTROYED_TYPES.BREAKPOINT) {
				this.init();
			}
		} else if (!this.isDestroyed) {
			this.destroy(DESTROYED_TYPES.BREAKPOINT);
		}
	};

	// Public methods
	init = () => {
		this.updateInstanceId();
		this.initAccordions();

		this.isDestroyed = false;
		this.destroyedBy = undefined;

		this.breakpoint.addEventListener('change', this.onBreakpointChange);
		this.onBreakpointChange();

		this.closeAll();
	};

	destroy = (destroyedBy = DESTROYED_TYPES.MANUAL) => {
		this.elements.forEach((accordionElement) => {
			this.destroyAccordion(accordionElement);
		});

		this.isDestroyed = true;
		this.destroyedBy = destroyedBy;
	};

	open = (item: AccordionElement | string) => {
		const itemElement = typeof item === 'string' ? this.getItemById(item) : item;

		if (!itemElement || !itemElement[PARAMS_KEY]) {
			return;
		}

		const accordionElement = this.getAccordionById(itemElement[PARAMS_KEY]?.[PARAMS.ACCORDION_ID] ?? '');
		const detailsElement = itemElement[PARAMS_KEY][PARAMS.DETAILS_ELEMENT];
		const summaryElement = itemElement[PARAMS_KEY][PARAMS.SUMMARY_ELEMENT];

		if (accordionElement?.[PARAMS_KEY]?.[PARAMS.IS_SINGLE]) {
			this.closeAccordion(accordionElement);
		}

		itemElement[PARAMS_KEY][PARAMS.IS_OPEN] = true;
		itemElement.classList.add(this.openClass);
		summaryElement?.setAttribute('aria-expanded', 'true');
		detailsElement?.removeAttribute('inert');
	};

	close = (item: AccordionElement | string) => {
		const itemElement = typeof item === 'string' ? this.getItemById(item) : item;

		if (itemElement && !itemElement[PARAMS_KEY]) {
			itemElement[PARAMS_KEY] = {};
		}

		const detailsElement = itemElement?.[PARAMS_KEY]?.[PARAMS.DETAILS_ELEMENT];
		const summaryElement = itemElement?.[PARAMS_KEY]?.[PARAMS.SUMMARY_ELEMENT];

		if (!detailsElement) {
			return;
		}

		(itemElement[PARAMS_KEY] as AccordionProperties)[PARAMS.IS_OPEN] = false;
		itemElement.classList.remove(this.openClass);
		summaryElement?.setAttribute('aria-expanded', 'false');
		detailsElement.setAttribute('inert', '');
	};

	toggle = (item: AccordionElement | string) => {
		const itemElement = typeof item === 'string' ? this.getItemById(item) : item;

		if (itemElement && !itemElement[PARAMS_KEY]) {
			itemElement[PARAMS_KEY] = {};
		}

		if (!itemElement) {
			return;
		}

		if ((itemElement[PARAMS_KEY] as AccordionProperties)[PARAMS.IS_OPEN]) {
			this.close(itemElement);
		} else {
			this.open(itemElement);
		}
	};

	closeAccordion = (accordion: AccordionElement | string) => {
		const accordionElement = typeof accordion === 'string' ? this.getAccordionById(accordion) : accordion;

		if (!accordionElement) {
			return;
		}

		if (!accordionElement[PARAMS_KEY]) {
			accordionElement[PARAMS_KEY] = {};
		}

		const itemsIds = accordionElement[PARAMS_KEY][PARAMS.ITEMS_IDS] ?? [];

		itemsIds.forEach((itemId) => {
			this.close(itemId);
		});
	};

	closeAll = () => {
		this.elements.forEach((accordion) => {
			this.closeAccordion(accordion);
		});
	};
}
