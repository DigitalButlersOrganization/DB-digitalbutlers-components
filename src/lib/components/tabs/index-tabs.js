
import { KEYS_CODES } from '../../_constants/index.ts';

function initTabs(tabsWrapper, tabpanelsList) {
	// Add or subtract depending on key pressed
	const direction = {
		37: -1,
		38: -1,
		39: 1,
		40: 1,
	};

	function deactivateTabs(tab) {
		const nearestTabsWrapper = tab.closest(tabsWrapper);
		const nearestTabList = nearestTabsWrapper.querySelector('[role="tablist"]');
		const nearestTabpanelsList = nearestTabsWrapper.querySelector(tabpanelsList);
		const desiredTabsElements = nearestTabList.querySelectorAll('[role="tab"]');
		const desiredTabpanelsElements = nearestTabpanelsList.childNodes;
		desiredTabsElements.forEach((tabElement) => {
			tabElement.setAttribute('tabindex', '-1');
			tabElement.setAttribute('aria-selected', 'false');
			tabElement.classList.remove('js--active');
		});
		desiredTabpanelsElements.forEach((tabpanel) => {
			tabpanel.setAttribute('hidden', 'hidden');
		});
	}

	function activateTab(tab, setFocus) {
		const controls = tab.getAttribute('aria-controls');
		const desiredTabpanel = document.querySelector(`#${controls}`);

		// eslint-disable-next-line no-param-reassign
		setFocus = setFocus || true;
		deactivateTabs(tab);
		tab.setAttribute('tabindex', '0');
		tab.setAttribute('aria-selected', 'true');
		tab.classList.add('js--active');
		desiredTabpanel.removeAttribute('hidden');
		// Set focus when required
		if (setFocus) {
			tab.focus();
		}
	}

	function clickEventListener(event) {
		if (event.target.closest('[role="tab"]')) {
			const tab = event.target.closest('[role="tab"]');
			activateTab(tab, false);
		}
	}

	// eslint-disable-next-line unicorn/consistent-function-scoping
	function focusFirstTab(event) {
		const { target } = event;
		const nearestTabList = target.closest('[role="tablist"]');
		const desiredTabsElements = nearestTabList.querySelectorAll('[role="tab"]');
		const firstTabOfDesired = desiredTabsElements[0];
		firstTabOfDesired.focus();
	}

	// eslint-disable-next-line unicorn/consistent-function-scoping
	function focusLastTab(event) {
		const { target } = event;
		const nearestTabList = target.closest('[role="tablist"]');
		const desiredTabsElements = nearestTabList.querySelectorAll('[role="tab"]');
		const lastTabOfDesired = desiredTabsElements[desiredTabsElements.length - 1];
		lastTabOfDesired.focus();
	}
	// When a tablist is aria-orientation is set to vertical, only up and down arrow
	// should function. In all other cases only left and right arrow function.
	function switchTabOnArrowPress(event) {
		const { target, keyCode } = event;
		const pressedKeyCode = keyCode;
		const nearestTabList = target.closest('[role="tablist"]');
		const desiredTabsElements = nearestTabList.querySelectorAll('[role="tab"]');
		const pressedIndex = direction[pressedKeyCode];
		if (pressedIndex) {
			desiredTabsElements.forEach((tab, index) => {
				if (tab === target) {
					if (desiredTabsElements[index + pressedIndex]) {
						desiredTabsElements[index + pressedIndex].focus();
						// eslint-disable-next-line no-undef
					} else if (pressedKeyCode === KEYS_CODES.LEFT || pressedKeyCode === KEYS_CODES.UP) {
						focusLastTab(event);
						// eslint-disable-next-line no-undef
					} else if (pressedKeyCode === KEYS_CODES.RIGHT || pressedKeyCode === KEYS_CODES.DOWN) {
						focusFirstTab(event);
					}
				}
			});
		}
	}
	function determineOrientation(event) {
		const key = event.keyCode;
		const vertical = event.target.closest('[role="tablist"]').getAttribute('aria-orientation') === 'vertical';
		let proceed = false;

		if (vertical) {
			// eslint-disable-next-line no-undef
			if (key === KEYS_CODES.UP || key === KEYS_CODES.DOWN) {
				event.preventDefault();
				proceed = true;
			}
			// eslint-disable-next-line no-undef
		} else if (key === KEYS_CODES.LEFT || key === KEYS_CODES.RIGHT) {
			proceed = true;
		}

		if (proceed) {
			switchTabOnArrowPress(event);
		}
	}
	// Handle keydown on tabs
	function keydownEventListener(event) {
		if (event.target.closest('[role="tab"]')) {
			const key = event.keyCode;

			switch (key) {
			case KEYS_CODES.END: {
				event.preventDefault(); // prevent page scroll
				focusLastTab(event);
				break;
			}
			// eslint-disable-next-line no-undef
			case KEYS_CODES.HOME: {
				event.preventDefault(); // prevent page scroll
				focusFirstTab(event);
				break;
			}
			// eslint-disable-next-line no-undef
			case KEYS_CODES.UP: {
				// eslint-disable-next-line no-undef
				determineOrientation(event);
				break;
			}
			// eslint-disable-next-line no-undef
			case KEYS_CODES.DOWN: {
				determineOrientation(event);
				break;
			}
			default: {
				break;
			}
			}
		}
	}
	// Deletes a tab and its panel
	// eslint-disable-next-line unicorn/consistent-function-scoping
	function deleteTab(event) {
		const { target } = event;
		// eslint-disable-next-line unicorn/prefer-query-selector
		const desiredPanel = document.getElementById(target.getAttribute('aria-controls'));

		target.remove();
		desiredPanel.remove();
	}
	// Detect if a tab is deletable
	function determineDeletable(event) {
		const { target } = event;
		const nearestTabList = target.closest('[role="tablist"]');
		const desiredTabsElements = nearestTabList.querySelectorAll('[role="tab"]');

		if (Object.hasOwn(target.dataset, 'deletable')) {
			desiredTabsElements.forEach((tab, index) => {
				if (target === tab) {
					deleteTab(event, target);
					// Activate the closest tab to the one that was just deleted
					if (desiredTabsElements.length > 1) {
						if (index - 1 < 0) {
							activateTab(desiredTabsElements[index + 1]);
						} else {
							activateTab(desiredTabsElements[index - 1]);
						}
					} else {
						nearestTabList.closest(tabsWrapper).focus();
					}
				}
			});
		}
	}
	// Handle keyup on tabs
	function keyupEventListener(event) {
		if (event.target.closest('[role="tab"]')) {
			const key = event.keyCode;

			switch (key) {
			// eslint-disable-next-line no-undef
			case KEYS_CODES.LEFT: {
				determineOrientation(event);
				break;
			}
			// eslint-disable-next-line no-undef
			case KEYS_CODES.RIGHT: {
				determineOrientation(event);
				break;
			}
			// eslint-disable-next-line no-undef
			case KEYS_CODES.DELETE: {
				determineDeletable(event);
				break;
			}
			// eslint-disable-next-line no-undef
			case KEYS_CODES.ENTER: {
				activateTab(event.target);
				break;
			}
			// eslint-disable-next-line no-undef
			case KEYS_CODES.SPACE: {
				activateTab(event.target);
				break;
			}
			default: {
				break;
			}
			}
		}
	}

	function addListenersForTabs() {
		window.addEventListener('click', clickEventListener);
		window.addEventListener('keydown', keydownEventListener);
		window.addEventListener('keyup', keyupEventListener);
	}
	addListenersForTabs();
}

function assigningTabsAttributes(tabsWrapper, tabpanelsList) {
	const nearestTabsWrapper = document.querySelectorAll(tabsWrapper);
	nearestTabsWrapper.forEach((tabWrapper) => {
		const nearestTabList = tabWrapper.querySelector('[role="tablist"]');
		const nearestTabpanelsList = tabWrapper.querySelector(tabpanelsList);
		const nearestTabs = nearestTabList.childNodes;
		const nearestTabpanels = nearestTabpanelsList.childNodes;
		const regForRemoveSpecialSymbols = /[^\s\w]/gi;
		nearestTabs.forEach((tab, index) => {
			const titleCurrentTab = tab.textContent.toLowerCase()
				.replace(regForRemoveSpecialSymbols, '').split(' ').join('-')
				.trim();
			tab.setAttribute('id', titleCurrentTab);
			tab.setAttribute('aria-controls', `${titleCurrentTab}-tabpanel`);
			nearestTabpanels[index].setAttribute('aria-labelledby', titleCurrentTab);
			nearestTabpanels[index].setAttribute('id', `${titleCurrentTab}-tabpanel`);
		});
	});
	// eslint-disable-next-line no-undef
	initTabs(tabsWrapper, tabpanelsList);
}
assigningTabsAttributes('[data-name="tabs-wrapper"]', // wrapper for tabpanels and tablist
	'[data-name="tabpanels-list"]', // wrapper for tabpanels
);
