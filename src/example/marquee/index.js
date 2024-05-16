import { Marquee } from '../../lib/components/marquee';

const marquee = new Marquee({
	marqueeParent: document.querySelector('[data-component-id="marquee"]'),
	marqueeMovingLineSelector: '[data-role="marquee-moving-line"]',
	marqueeListSelector: '[data-role="marquee-list"]',
	wrapperOfVisiblePartOfMarquee: document.documentElement, // it is needed to measure the width of the visible part of the running line
	matchMediaRule: window.matchMedia('(min-width: 800px)'), // will prevent the tab changing if window.matchMedia doesn't match
});

marquee.init();
