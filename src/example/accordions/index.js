import { Accordions } from '../../../dist/index';

const component = document.querySelector('.component');
// eslint-disable-next-line no-unused-vars
const accordions = new Accordions({
	parentElement: component,
});

console.log(accordions);
