import { Marquee } from '../../lib/components/marquee';

const marquee = new Marquee({
	marqueeParent: document.querySelector('[data-component-id="marquee-parent-long"]'),
	marqueeMovingLineSelector: '[data-role="marquee-moving-line"]',
	marqueeListSelector: '[data-role="marquee-list"]',
	duration: 10,
	wrapperOfVisiblePartOfMarquee: document.documentElement, // it is needed to measure the width of the visible part of the running line
});

marquee.init();
