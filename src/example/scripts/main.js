import { Tabs } from '../../lib/index';

// const tabs = new Tabs({
// 	tabsWrapperSelector: '[data-tabs="wrapper"]',
// 	tabpanelsListSelector: '[data-tabs="content"]',
// 	tabbuttonsListSelector: '[data-tabs="tabs"]',
// });
const tabs = new Tabs({
	tabsWrapperSelector: '[data-tabs="wrapper"]',
	tabpanelsListSelector: '[data-tabs="content"]',
	tabbuttonsListSelector: '[data-tabs="tabs"]',
	deletableTabs: true,
});

tabs.init();

console.log(tabs);
