export const getChildrenArray = (element: HTMLElement): HTMLElement[] => (element
	? Array.prototype.slice.call(element.children)
	: []);
