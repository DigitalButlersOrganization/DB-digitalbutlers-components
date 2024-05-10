    openClass: 'js--open',
    parentElement: document,
    accordionSelector: '[data-role="accordion"]',
    itemSelector: '[data-role="accordion-item"]',
    summarySelector: '[data-role="accordion-summary"]',
    detailsSelector: '[data-role="accordion-details"]',
    breakpoint: window.matchMedia('screen'),
    isSingle: false,
    on: {},

# Tabs

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

### Create tabs instance

```javascript
const componentElement = document.querySelector('[data-component-id="accordions"]'); //

const accordions = new Accordions({
	parentElement: componentElement, // Any node that is the parent of an accordion. It is advisable to specify the nearest parent
});
accordions.init();
```
