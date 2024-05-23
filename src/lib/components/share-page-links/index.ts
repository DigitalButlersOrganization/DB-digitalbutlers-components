import './index.scss';
import { SharePageCallbacks } from './interfaces';

const DEFAULT_PARAMETERS = {
	messageForShareViaEmail: 'I think it will be interesting for you to read this article',
	pageName: 'We recommend it for reading',
	on: {},
};

export class SharePageLinks {
	linkSelector: string;
	href: string;
	arrayOfMainTagNames: string[];
	arrayOfMainTags: HTMLElement[];
	arrayOfSharePageLinks: HTMLElement[];
	messageForShareViaEmail: string;
	pageName: string;
	on: SharePageCallbacks = {};

	constructor(customParameters: {}) {
		const parameters = { ...DEFAULT_PARAMETERS, ...customParameters };
		this.linkSelector = 'a[data-network-name]';
		this.href = window.location.href;
		this.arrayOfMainTagNames = ['title', 'h1', '[role="heading"][aria-level="1"]'];
		this.arrayOfMainTags = [];
		this.arrayOfSharePageLinks = Array.from(document.querySelectorAll(this.linkSelector));
		this.messageForShareViaEmail = parameters.messageForShareViaEmail;
		this.pageName = parameters.pageName;
		this.on = parameters.on;
	}

	init = () => {
		this.arrayOfMainTagNames.forEach((tagName) => {
			const element = document.querySelector(tagName);
			if (element) this.arrayOfMainTags.push(element as HTMLElement);
		});
		this.pageName = this.arrayOfMainTags[0].textContent || this.pageName;

		this.arrayOfSharePageLinks.forEach((link) => {
			const network = link.dataset.networkName;
			switch (network) {
			case 'whats-app': {
				(link as HTMLAnchorElement).href = `https://api.whatsapp.com/send?text=${this.href}`;
				break;
			}
			case 'facebook': {
				(link as HTMLAnchorElement).href = `https://www.facebook.com/sharer.php?s=100&u=${this.href}&p[title]=${this.pageName}&p[summary]=${this.pageName}`;
				(link as HTMLAnchorElement).target = '_blank';
				break;
			}
			case 'twitter': {
				(link as HTMLAnchorElement).href = `http://twitter.com/share?text=${this.pageName}&url=${this.href}`;
				(link as HTMLAnchorElement).target = '_blank';
				break;
			}
			case 'linkedin': {
				(link as HTMLAnchorElement).href = `https://www.linkedin.com/shareArticle?mini=true&url=${this.href}&title=${this.pageName}`;
				(link as HTMLAnchorElement).target = '_blank';
				break;
			}
			case 'email': {
				(link as HTMLAnchorElement).href = `mailto:someone@example.com?subject=${this.pageName}&body=${this.messageForShareViaEmail}%20${this.href}`;
				(link as HTMLAnchorElement).target = '_blank';
				break;
			}
			case 'telegram': {
				(link as HTMLAnchorElement).href = `https://telegram.me/share/url?url=${this.href}&text=${this.pageName}`;
				(link as HTMLAnchorElement).target = '_blank';
				break;
			}
			default: {
				break;
			}
			}
		});
		if (this.on.afterInit) {
			this.on.afterInit(this);
		}
	};
}


