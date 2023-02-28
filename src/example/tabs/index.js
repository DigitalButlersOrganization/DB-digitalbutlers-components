import { Tabs } from '../../lib/index';

const wrappers = document.querySelectorAll('.wrapper');

wrappers.forEach((wrapper) => {
	const tabs = new Tabs(wrapper, {
		tabpanelsListSelector: '[data-tabs="content"]',
		tabbuttonsListSelector: '[data-tabs="tabs"]',
		deletableTabs: true,
	});
	tabs.init();
});

const mainTabs = new Tabs('.app', {
	tabpanelsListSelector: '.content',
	tabbuttonsListSelector: '.app-tabs',
	vertical: true,
	animation: {
		delay: 1000,
	},
	equalHeight: true,
	autoplay: {
		delay: 1000,
	},
	// deletableTabs: true,
});

mainTabs.init();
