# Digitalbutlers-components

<div style="display: flex">

## Examples of components <img src="https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/icons/arrow-down.svg" width="25" height="25"/>

</div>

[You can view examples of components here](https://digitalbutlers-components.webflow.io/)

## Documentation <img src="https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/icons/arrow-down.svg" width="25" height="25"/>

[Documentation for Tabs](https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/lib/components/tabs/README.md)

[Documentation for Accordions](https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/lib/components/accordions/README.md)

[Documentation for Marquee](https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/lib/components/marquee/README.md)

[Documentation for SharePageLinks](https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/lib/components/share-page-links/README.md)

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
```

#### You can see more class parameters in the [documentation](https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/lib/components/accordions/README.md) <img src="https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/icons/exclamation-mark.svg" width="25" height="25"/>

<hr>

### Import a class and create an instance of MARQUEE:

<hr>

```javascript
import { Marquee } from '@digital-butlers/components/marquee';

const marquee = new Marquee({
	marqueeParentSelector: '[data-role="marquee-parent"]',
	marqueeMovingLineSelector: '[data-role="marquee-moving-line"]',
	marqueeListSelector: '[data-role="marquee-list"]',
	wrapperOfVisiblePartOfMarquee: document.documentElement, // it is needed to measure the width of the visible part of the running line
	matchMediaRule: window.matchMedia('(min-width: 800px)'), // will prevent the tab changing if window.matchMedia doesn't match
});

marquee.init();
```

#### You can see more class parameters in the [documentation](https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/lib/components/marquee/README.md) <img src="https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/icons/exclamation-mark.svg" width="25" height="25"/>

<hr>

### Import a class and create an instance of SHARE_PAGE_LINKS:

<hr>

```javascript
import { SharePageLinks } from '@digital-butlers/components/share-page-links';

const shareLinks = new SharePageLinks({
	messageForShareViaEmail: "This is really important! Don't miss it", // the text to insert in the "body of the message" field (if we share a link to the page in the email)
	pageName: 'Custom page name', // if there is no 'title', 'h1', '[role="heading"][aria-level="1"]' on the page, this text will be used instead
});

shareLinks.init();
```

#### You can see more class parameters in the [documentation](https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/lib/components/share-page-links/README.md) <img src="https://github.com/DigitalButlersOrganization/DB-digitalbutlers-components/blob/master/src/icons/exclamation-mark.svg" width="25" height="25"/>

<hr>
