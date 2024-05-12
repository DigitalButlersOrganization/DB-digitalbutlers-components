# Digitalbutlers-components
<div style="display: flex">

## Examples of components <img src="https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/icons/arrow-down.svg" width="25" height="25"/>
</div>

[You can view examples of components here](https://digitalbutlers-components.webflow.io/)

## Documentation <img src="https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/icons/arrow-down.svg" width="25" height="25"/>

[Documentation for tabs](https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/lib/components/tabs/README.md)

[Documentation for accordions](https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/lib/components/accordions/README.md)

## Usage <img src="https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/icons/arrow-down.svg" width="25" height="25"/>

### Install library

```
npm install @digital-butlers/components
```

or

```
pnpm add @digital-butlers/components
```

### Import a class and create an instance of TABS

<hr>


```javascript

import { Tabs } from '@digital-butlers/components/tabs';

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
#### You can see more class parameters in the [documentation](https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/lib/components/tabs/README.md) <img src="https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/icons/exclamation-mark.svg" width="25" height="25"/>

### Import a class and create an instance of ACCORDIONS:

<hr>


```javascript

import { Accordions } from '@digital-butlers/components/accordions';

const componentElement = document.querySelector('[data-component-id="accordions"]'); //

const accordions = new Accordions({
	parentElement: componentElement, // Any node that is the parent of an accordion. It is advisable to specify the nearest parent
	isSingle: true, // If set to 'true', then only one active accordion element can be turned on at a time
});
accordions.init();
```

#### You can see more class parameters in the [documentation](https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/lib/components/accordions/README.md) <img src="https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/icons/exclamation-mark.svg" width="25" height="25"/>


<hr>

