import { Pagination } from '../../../dist/index';

const component = document.querySelector('.component');
// eslint-disable-next-line no-unused-vars
const pagination = new Pagination(component, {
	itemsPerPage: 4,
	paginationWrapperSelector: '.pagination-wrapper',
	dynamicElementSelector: '.dynamic-element',
	animationLength: 1000,
});
