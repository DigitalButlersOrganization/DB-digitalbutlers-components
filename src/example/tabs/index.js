import { Tabs } from '../../lib/index';

const wrappers = document.querySelectorAll('.wrapper');

wrappers.forEach((wrapper) => {
	// eslint-disable-next-line no-unused-vars
	const tabs = new Tabs(wrapper, {
		tabpanelsListSelector: '[data-tabs="content"]',
		tabbuttonsListSelector: '[data-tabs="tabs"]',
		deletableTabs: true,
		triggerEevent: 'mouseover',
	});
});

// eslint-disable-next-line no-unused-vars
const mainTabs = new Tabs('.app', {
	tabpanelsListSelector: '.content',
	tabbuttonsListSelector: '.app-tabs',
	orientation: 'vertical',
	deletableTabs: true,
	animation: {
		delay: 1000,
	},
	triggerEvent: 'mouseover',
	matchMediaRule: '(min-width: 600px)',
	// equalHeight: true,
	autoplay: {
		delay: 0,
	},
	on: {
		tabChange: (tabs) => {
			console.log(tabs.activeIndex);
		},
	},
	// deletableTabs: true,
});
