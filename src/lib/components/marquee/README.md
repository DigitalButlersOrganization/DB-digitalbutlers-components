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
	marqueeMovingLineSelector: '[data-role="marquee-moving-line"]',
	marqueeListSelector: '[data-role="marquee-list"]',
	wrapperOfVisiblePartOfMarquee: document.documentElement, // it is needed to measure the width of the visible part of the running line
	matchMediaRule: window.matchMedia('(min-width: 800px)'), // will prevent the tab changing if window.matchMedia doesn't match
});

marquee.init();

```

## API

### Config Properties

### `marqueeParent`
*Type:* `HTMLElement`
*Default:* `document.documentElement`
*Description:* Any node that is the parent of a marquee. It is advisable to specify the nearest parent

### `marqueeMovingLineSelector`
*Type:* `string`
*Default:* `'[data-role="marquee-moving-line"]'`
*Description:* Css selector to specify for the element that will be animated. "marquee-list" is a child element, relative to the "moving-line".

### `marqueeListSelector`
*Type:* `string`
*Default:* `'[data-role="marquee-list"]'`
*Description:* Css selector, which is the direct parent for all images, texts, and other moving elements.

### `duration`
*Type:* `number`
*Default:* `10`
*Description:* Determines the speed of the running line

### `divisibleNumber`
*Type:* `number`
*Default:* `0`
*Description:* When creating copies of animated elements, the number from the variable "divisible Number" will be used. If it is greater than 0, then the total number of animated elements will be a multiple of "divisibleNumber".

### `matchMediaRule`
*Type:* `MediaQueryList`
*Default:* `window.matchMedia('screen')`
*Description:* Prevents changing the accordions if the breakpoint does not match the window.matchmedia

### `wrapperOfVisiblePartOfMarquee`
*Type:* `HTMLElement`
*Default:* `document.documentElement`
*Description:* Sometimes the infinite marquee should not span the full width of the screen, but rather the width of a smaller container. Pass the wrapper of the visible part of your marquee to the parameter "wrapperOfVisiblePartOfMarquee".

### Events callback config object


### `beforeInit`
*Type:* `function`
*Default:* `undefined`
*Description:* Callback will be started before marquee initialization

### `afterInit`
*Type:* `function`
*Default:* `undefined`
*Description:* Callback will be started after marquee initialization

### `disable`
*Type:* `function`
*Default:* `undefined`
*Description:* Callback will be started after disable marquee

### `update`
*Type:* `function`
*Default:* `undefined`
*Description:* Callback will be started after update marquee

## License

MIT
