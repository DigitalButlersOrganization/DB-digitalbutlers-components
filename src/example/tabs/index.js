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
	orientation: 'vertical',
	animation: {
		delay: 1000,
	},
	// equalHeight: true,
	autoplay: {
		delay: 0,
	},
	on: {
		tabChange: (mainTabs) => {
			console.log(mainTabs.activeIndex);
		},
	},
	// deletableTabs: true,
});

mainTabs.init();
console.log(mainTabs);
console.log(mainTabs.equalHei);

document.querySelector('.next').addEventListener('click', () => {
	mainTabs.goToNext();
});
