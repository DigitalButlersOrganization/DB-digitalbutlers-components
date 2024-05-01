import { Accordions } from '../../lib/index';

const component = document.querySelector('.component');
// eslint-disable-next-line no-unused-vars
const accirdions = new Accordions(component, {
	// itemsPerPage: 4,
	// paginationWrapperSelector: '.pagination-wrapper',
	// dynamicElementSelector: '.dynamic-element',
	// animationLength: 1000,
});

console.log(accirdions);
