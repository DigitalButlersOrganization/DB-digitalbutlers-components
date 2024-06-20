import { Marquee } from '../../lib/components/marquee';

// const marquee = new Marquee({
// 	marqueeParent: document.querySelector('[data-component-id="marquee"]'),
// 	marqueeMovingLineSelector: '[data-role="marquee-moving-line"]',
// 	marqueeListSelector: '[data-role="marquee-list"]',
// 	wrapperOfVisiblePartOfMarquee: document.documentElement, // it is needed to measure the width of the visible part of the running line
// 	matchMediaRule: window.matchMedia('(min-width: 800px)'), // will prevent the tab changing if window.matchMedia doesn't match
// 	on: {
// 		update(instance) {
// 			console.log(instance);
// 		},
// 	},
// });

// marquee.init();

console.log(1);
const marquee = new Marquee({
	marqueeParent: document.querySelector('[data-component-id="marquee"]'),
	marqueeMovingLineSelector: '[data-role="marquee-moving-line"]',
	marqueeListSelector: '[data-role="marquee-list"]',
	wrapperOfVisiblePartOfMarquee: document.querySelector('[data-role="media-box"]'), // it is needed to measure the width of the visible part of the running line
	matchMediaRule: window.matchMedia('(max-width: 991px)'), // will prevent the tab changing if window.matchMedia doesn't match
	on: {
		update(instance) {
			console.log(instance);
		},
	},
});

marquee.init();
