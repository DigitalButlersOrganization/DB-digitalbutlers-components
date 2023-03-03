import { Tabs } from '../../lib/index';

const wrappers = document.querySelectorAll('.wrapper');

wrappers.forEach((wrapper) => {
	const tabs = new Tabs(wrapper, {
		tabpanelsListSelector: '[data-tabs="content"]',
		tabbuttonsListSelector: '[data-tabs="tabs"]',
		deletableTabs: true,
		tabsHeight: 'equal',
	});
});

const mainTabs = new Tabs('.app', {
	tabpanelsListSelector: '.content',
	tabbuttonsListSelector: '.app-tabs',
	orientation: 'vertical',
	deletableTabs: true,
	animation: {
		delay: 1000,
	},
	tabsHeight: 'equal',
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


// document.querySelector('.next').addEventListener('click', () => {
// 	mainTabs.destroy();
// });
// document.querySelector('.prev').addEventListener('click', () => {
// 	mainTabs.init();
// });
