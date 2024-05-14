# Marquee

## Usage

### Create an HTML markup

```html
<section class="section" data-component-id="marquee">
		<div class="marquee-parent" >
			<div data-role="marquee-moving-line">
				<div data-role="marquee-list">
					<div class="card-wrapper">
						<div class="card">Card</div>
					</div>
					<div class="card-wrapper">
						<div class="card">Card</div>
					</div>
					<div class="card-wrapper">
						<div class="card">Card</div>
					</div>
				</div>
			</div>
		</div>
		<div class="container">
	</section>
```

### Create marquee instance

```javascript
const marquee = new Marquee({
	marqueeParent: document.querySelector('[data-component-id="marquee"]'),
	marqueeMovingLineSelector: '[data-role="marquee-moving-line"]',
	marqueeListSelector: '[data-role="marquee-list"]',
	wrapperOfVisiblePartOfMarquee: document.documentElement, // it is needed to measure the width of the visible part of the running line
	matchMediaRule: window.matchMedia('(min-width: 800px)'), // will prevent the tab changing if window.matchMedia doesn't match
});

marquee.init();

```

## API

### Config Properties

### `openClass`
*Type:* `string`
*Default:* `'js--open'`
*Description:* The class that will be added to the active accordion item

### `parentElement`
*Type:* `HTMLElement | Document`
*Default:* `document`
*Description:* Any node that is the parent of an accordion. It is advisable to specify the nearest parent

### `accordionSelector`
*Type:* `string`
*Default:* `'[data-role="accordion"]'`
*Description:* Css selector for wrapping all accordion elements

### `itemSelector`
*Type:* `string`
*Default:* `'[data-role="accordion-item"]'`
*Description:* Css selector for creating a separate element inside the accordion, which will include "summary" and "details"

### `summarySelector`
*Type:* `string`
*Default:* `'[data-role="accordion-summary"]'`
*Description:* Css selector for creating a "summary" inside a separate accordion item

### `detailsSelector`
*Type:* `string`
*Default:* `'[data-role="accordion-details"]'`
*Description:* Css selector for creating a "details" inside a separate accordion item

### `breakpoint`
*Type:* `MediaQueryList`
*Default:* `window.matchMedia('screen')`
*Description:* prevents changing the accordions if the breakpoint does not match the window.matchmedia

### `isSingle`
*Type:* `AccordionCallbacks`
*Default:* `false`
*Description:* If set to 'true', then only one active accordion element can be turned on at a time

