# Digitalbutlers-components

## Usage

### Install library


```
npm install @digital-butlers/components
```

or

```
pnpm add @digital-butlers/components
```

### Import library and initialize script


```javascript
// for tabs
import { Tabs } from '@digital-butlers/components';

const SELECTORS = {
	TABS_WRAPPER: '[data-role="tabs-wrapper"]',
	PANEL_LIST: '[data-role="panel-list"]',
	TAB_LIST: '[data-role="tab-list"]',
};

	const tabsVertical = new Tabs(SELECTORS.COMPONENT, {
	tabpanelsListSelector: SELECTORS.PANEL_LIST,
	tabbuttonsListSelector: SELECTORS.TAB_LIST,
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
});
```

[Documentation for tabs](https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/tree/master/src/lib/components/tabs)


