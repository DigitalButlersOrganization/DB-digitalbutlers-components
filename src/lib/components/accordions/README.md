# Accordions

## Usage

### Create an HTML markup

```html
<div data-role="accordion">
	<div data-role="accordion-item">
		<div data-role="accordion-summary">
			<h3 class="heading heading--l">Here's your first question</h3>
		</div>
		<div data-role="accordion-details">
			<div>
				<p class="paragraph paragraph--m">Here is the answer to your first question</p>
			</div>
		</div>
	</div>
	<div data-role="accordion-item">
		<div data-role="accordion-summary">
			<h3 class="heading heading--l">Here's your second question</h3>
		</div>
		<div data-role="accordion-details">
			<div>
				<p class="paragraph paragraph--m">Here is the answer to your second question</p>
			</div>
		</div>
	</div>
</div>
```

### Create accordion instance

```javascript
const componentElement = document.querySelector('[data-component-id="accordions"]'); //

const accordions = new Accordions({
	parentElement: componentElement, // Any node that is the parent of an accordion. It is advisable to specify the nearest parent
});
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

### `on`
*Type:* `object`
*Description:* Callbacks that can be initialized after some events with accordions

#### Events callback config object

### `detailsTransitionEnd`
*Type:* `function`
*Default:* `undefined`
*Description:* Callback will be started after every transition end

### `open`
*Type:* `function`
*Default:* `undefined`
*Description:* Callback will be started after every accordion open event

### `close`
*Type:* `function`
*Default:* `undefined`
*Description:* Callback will be started after every accordion close event

### `toggle`
*Type:* `function`
*Default:* `undefined`
*Description:* Callback will be started after every accordion changing event

### `beforeInit`
*Type:* `function`
*Default:* `undefined`
*Description:* Callback will be started before accordion initialization

### `afterInit`
*Type:* `function`
*Default:* `undefined`
*Description:* Callback will be started after accordion initialization
