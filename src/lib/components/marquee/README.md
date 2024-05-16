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

...
