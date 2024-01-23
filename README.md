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
});
```

[Documentation for tabs](https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/tree/master/src/lib/components/tabs)


