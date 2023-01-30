import { CLASSES } from '../../../constants/classes';
import { CUSTOM_CLASSES } from './custom-classes';
import { KEYS } from '../../../constants/keys';
import { getChildrenArray, getRandomId } from '../../index';
import './index.scss';
import {
	AutoPlayModel, EventDetailsModel, TabsConfigModel,
} from './interfaces';

export class Tabs {
	#tabpanelsListSelector: string;
	#tabbuttonsListSelector: string;
	currentActive: number;
	nextIndex: number | undefined;
	prevIndex: number | undefined;
	lastIndex: number | undefined;
	#deletableTabs: boolean;
	#orientation: 'vertical' | 'horizontal';
	#autoplay: AutoPlayModel;
	#autoplayTimeout: number;
	#listenersAdded: boolean;
	#maxPanelHeight: number;
	generatedId: string;
	#equalHeight: boolean;
	tabsWrapper: HTMLElement;
	tabList: HTMLElement | undefined;
	tabPanelsList: HTMLElement | undefined;
	tabs: HTMLElement[];
	panels: HTMLElement[];
	#defaultRoles: {
		[key: string]: string
	};

	#defaultSelectors: {
		[key: string]: `[role="${string}"]`
	};

	// eslint-disable-next-line default-param-last
	constructor(tabsWrapper: string | HTMLElement = '[data-tabs="wrapper"]',
		{
			tabbuttonsListSelector = '[data-tabs="tabs"]',
			tabpanelsListSelector = '[data-tabs="content"]',
			deletableTabs = false,
			initialTab = 0,
			equalHeight = false,
			vertical = false,
			autoplay = {
				delay: 0,
			},
		}: TabsConfigModel) {
		this.#tabpanelsListSelector = tabpanelsListSelector;
		this.#tabbuttonsListSelector = tabbuttonsListSelector;
		this.#deletableTabs = deletableTabs;
		this.tabsWrapper = typeof tabsWrapper === 'string'
			? document.querySelector(tabsWrapper) as HTMLElement
			: tabsWrapper;
		this.tabList = undefined;
		this.tabPanelsList = undefined;
		this.tabs = [];
		this.panels = [];
		this.#orientation = vertical ? 'vertical' : 'horizontal';
		this.currentActive = initialTab;
		this.nextIndex = undefined;
		this.prevIndex = undefined;
		this.lastIndex = undefined;
		this.#autoplay = autoplay;
		this.#autoplayTimeout = 0;
		this.#listenersAdded = false;
		this.#maxPanelHeight = 0;
		this.generatedId = getRandomId();
		this.#equalHeight = equalHeight;
		this.#defaultRoles = {
			tab: 'tab',
			tabpanel: 'tabpanel',
		};
		this.#defaultSelectors = {
			tab: '[role="tab"]',
			tabpanel: '[role="tabpanel"]',
		};
	}

	init() {
		if (this.tabsWrapper) {
			this.tabList = this.tabsWrapper.querySelector(this.#tabbuttonsListSelector) as HTMLElement;
			this.tabPanelsList = this.tabsWrapper.querySelector(this.#tabpanelsListSelector) as HTMLElement;
			if (this.tabList && this.tabPanelsList) {
				this.tabs = getChildrenArray(this.tabList);
				this.panels = getChildrenArray(this.tabPanelsList);
				if (this.tabs.length === this.panels.length) {
					if (this.#equalHeight) {
						this.setEqualHeight();
						window.addEventListener('resize', this.setEqualHeight);
					}
					this.assigningTabsAttributes();
					if (!this.#listenersAdded) {
						this.addListenersForTabs();
						this.#listenersAdded = true;
					}
					this.goTo(this.currentActive);
					if (this.#autoplay.delay > 0) {
						this.runAutoPlay();
					}
				}
			}
		}
	}

	setEqualHeight = () => {
		this.panels.forEach((element) => {
			// console.log(element.style);
			element.style.height = 'auto';
		});
		const maxHeight = Math.max(...this.panels.map((element) => element.offsetHeight));
		this.panels.forEach((element) => {
			element.style.height = `${maxHeight}px`;
		});
	};

	public goTo = (index: number, setFocus: boolean = true) => {
		this.currentActive = index;
		this.updateProperties();
		this.setUnactiveAll();
		this.setActiveAttributes(index);
		this.setActiveClasses(index);
		// Set focus when required
		if (setFocus) {
			this.focusTab(index);
		}
	};

	public goToNext = () => {
		this.goTo(this.nextIndex as number);
	};

	public goToPrev = () => {
		this.goTo(this.prevIndex as number);
	};

	public stopAutoPlay = () => {
		clearTimeout(this.#autoplayTimeout);
	};

	private runAutoPlay = () => {
		this.#autoplayTimeout = setTimeout(() => {
			this.goTo(this.nextIndex as number);
			this.runAutoPlay();
		}, this.#autoplay.delay);
	};

	private addListenersForTabs = () => {
		this.tabsWrapper.addEventListener('click', this.clickHandler);
		window.addEventListener('keyup', this.keyupHandler);
	};

	private clickHandler = (event: MouseEvent) => {
		this.stopAutoPlay();
		const { targetIndex, targetButton } = this.getEventDetails(event);
		if (targetIndex !== undefined && this.tabs.includes(targetButton)) {
			this.goTo(+targetIndex);
		}
	};

	private keyupHandler = (event: KeyboardEvent) => {
		const eventDetails: EventDetailsModel = this.getEventDetails(event);
		const { targetButton, targetIndex, key } = eventDetails;
		if (targetButton && targetIndex !== undefined && this.tabs.includes(targetButton)) {
			this.stopAutoPlay();
			switch (key) {
			case KEYS.LEFT:
			case KEYS.RIGHT: {
				event.preventDefault();
				if (this.#orientation === 'horizontal') {
					this.switchTabOnArrowPress(eventDetails);
				}
				break;
			}
			case KEYS.UP:
			case KEYS.DOWN: {
				event.preventDefault(); // prevent page scroll
				if (this.#orientation === 'vertical') {
					this.switchTabOnArrowPress(eventDetails);
				}
				break;
			}
			case KEYS.DELETE: {
				this.deleteTab(eventDetails);
				break;
			}
			case KEYS.ENTER || KEYS.SPACE: {
				this.goTo(+targetIndex);
				break;
			}
			case KEYS.END: {
				event.preventDefault(); // prevent page scroll
				this.focusTab(this.lastIndex as number);
				break;
			}
			case KEYS.HOME: {
				event.preventDefault(); // prevent page scroll
				this.focusTab(0);
				break;
			}
			default: {
				break;
			}
			}
		}
	};

	protected setUnactiveAll = () => {
		this.setUnactiveAttributesAll();
		[this.tabs, this.panels].flat().forEach((element) => {
			element.classList.remove(CLASSES.ACTIVE);
			element.classList.add(CLASSES.UNACTIVE);
		});
	};

	protected setUnactiveAttributesAll = () => {
		this.tabs.forEach((tabElement) => {
			tabElement.setAttribute('tabindex', '-1');
			tabElement.setAttribute('aria-selected', 'false');
		});
		this.panels.forEach((tabpanel) => {
			tabpanel.setAttribute('inert', 'true');
		});
	};

	protected setActiveAttributes = (index: number) => {
		this.tabs[index].setAttribute('tabindex', '0');
		this.tabs[index].setAttribute('aria-selected', 'true');
		this.panels[index].removeAttribute('inert');
	};

	protected setActiveClasses = (index: number) => {
		this.tabs[index].classList.remove(CLASSES.UNACTIVE);
		this.tabs[index].classList.add(CLASSES.ACTIVE);
		this.panels[index].classList.remove(CLASSES.UNACTIVE);
		this.panels[index].classList.add(CLASSES.ACTIVE);
	};

	protected focusTab = (order: number) => {
		this.tabs[order].focus();
	};

	// When a tablist is aria-orientation is set to vertical, only up and down arrow
	// should function. In all other cases only left and right arrow function.
	private switchTabOnArrowPress = (eventDetails: EventDetailsModel) => {
		const { key, targetIndex } = eventDetails;
		switch (key) {
		case KEYS.LEFT:
		case KEYS.UP: {
			if (targetIndex !== undefined) {
				this.focusTab(targetIndex - 1 < 0
					? (this.lastIndex as number) : targetIndex - 1);
			}
			break;
		}
		case KEYS.RIGHT:
		case KEYS.DOWN: {
			if (targetIndex !== undefined) {
				this.focusTab(targetIndex >= (this.lastIndex as number)
					? 0 : targetIndex + 1);
			}
			break;
		}
		default: {
			break;
		}
		}
	};

	// Deletes a tab and its panel
	private deleteTab = (eventDetails: EventDetailsModel) => {
		const { targetButton, targetIndex } = eventDetails;
		if (targetButton.dataset.deletable && targetIndex !== undefined) {
			this.tabs[targetIndex].remove();
			this.panels[targetIndex].remove();
			const newTabsLength = this.tabs.length - 1;
			if (targetIndex < this.currentActive) {
				this.goTo(targetIndex);
			} else if (targetIndex >= this.currentActive) {
				if (targetIndex === newTabsLength || targetIndex === newTabsLength) {
					this.goTo(targetIndex - 1);
				} else {
					this.goTo(targetIndex);
				}
			}
			this.update();
		}
	};

	private assigningTabsAttributes = () => {
		this.tabsWrapper.setAttribute('aria-orientation', this.#orientation);
		this.tabList?.classList.add(CUSTOM_CLASSES.TAB_LIST);
		this.tabPanelsList?.classList.add(CUSTOM_CLASSES.PANEL_LIST);
		this.tabs.forEach((tab, index) => {
			tab.classList.add(CUSTOM_CLASSES.TAB);
			tab.setAttribute('aria-label', `${index}`);
			tab.setAttribute('role', this.#defaultRoles.tab);
			tab.setAttribute('id', `${this.generatedId}-tab-${index}`);
			tab.setAttribute('aria-controls', `${this.generatedId}-tabpanel-${index}`);

			tab.dataset.deletable = `${this.#deletableTabs}`;
			this.panels[index].classList.add(CUSTOM_CLASSES.PANEL);
			this.panels[index].setAttribute('aria-labelledby', `${this.generatedId}-tab-${index}`);
			this.panels[index].setAttribute('id', `${this.generatedId}-tabpanel-${index}`);
			this.panels[index].setAttribute('aria-label', `${index}`);
			this.panels[index].setAttribute('role', this.#defaultRoles.tabpanel);
		});
		this.setUnactiveAll();
	};

	private getEventDetails = (event: KeyboardEvent | MouseEvent): EventDetailsModel => {
		const key = event instanceof KeyboardEvent ? event.key : undefined;
		const target = event.target as HTMLElement;
		const targetTab = target.closest(this.#defaultSelectors.tab) as HTMLElement;
		const targetIndex = targetTab?.getAttribute('aria-label');
		return {
			target,
			targetIndex: targetIndex ? +targetIndex : undefined,
			targetButton: targetTab,
			key,
			event,
		};
	};

	private updateProperties = (): void => {
		this.lastIndex = this.tabs.length - 1;
		this.nextIndex = (this.currentActive >= this.lastIndex)
			? 0 : this.currentActive + 1;
		this.prevIndex = (this.currentActive - 1 < 0
			? this.lastIndex : this.currentActive - 1);
	};

	public update = () => {
		this.updateProperties();
		this.init();
		this.assigningTabsAttributes();
	};
}

