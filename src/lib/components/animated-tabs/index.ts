import { CLASSES } from '../../../constants/classes';
import { Tabs } from '../../index';
import { TabsConfigModel } from '../tabs/interfaces';
import { AnimatedTabsConfigModel, AnimationType } from './interfaces';
import './index.scss';

export class AnimatedTabs extends Tabs {
	animationDelay: number;
	animationType: AnimationType;
	animatedClass: string;
	// eslint-disable-next-line no-useless-constructor
	constructor(
		tabsWrapper: string | HTMLElement, tabsConfig: TabsConfigModel, {
			animation,
		}: AnimatedTabsConfigModel,
	) {
		super(tabsWrapper, tabsConfig);
		this.animationDelay = animation.delay;
		this.animationType = animation.type;
		this.animatedClass = CLASSES.VISIBLE;
	}

	init = () => {
		super.init();
		// this.animatedClass = 		this.setInlineStyles();
	};

	public setActive = (index: number, setFocus: boolean = true) => {
		// console.log(this.focusTab);
		this.currentActive = index;
		this.setInvisibleAll();
		setTimeout(() => {
			this.setUnactiveAll();
			this.tabs[index].setAttribute('tabindex', '0');
			this.tabs[index].setAttribute('aria-selected', 'true');
			this.tabs[index].classList.remove(CLASSES.UNACTIVE);
			this.tabs[index].classList.add(CLASSES.ACTIVE);
			setTimeout(() => {
				this.tabs[index].classList.add(CLASSES.VISIBLE);
			}, 100);
			this.panels[index].removeAttribute('hidden');
			this.panels[index].removeAttribute('inert');
			this.panels[index].classList.remove(CLASSES.UNACTIVE);
			this.panels[index].classList.add(CLASSES.ACTIVE);
			setTimeout(() => {
				this.panels[index].classList.add(CLASSES.VISIBLE);
			}, 100);
		}, this.animationDelay);
		// Set focus when required
		if (setFocus) {
			this.focusTab(index);
		}
	};

	private setInvisibleAll = () => {
		this.tabs.forEach((tabElement) => {
			tabElement.classList.remove(CLASSES.VISIBLE);
		});
		this.panels.forEach((tabpanel) => {
			tabpanel.classList.remove(CLASSES.VISIBLE);
		});
	};

	private setInlineStyles = () => {
		[this.tabs, this.panels].flat().forEach((element) => {
			// eslint-disable-next-line no-param-reassign
			element.style.transition = `transform ${this.animationDelay / 1000}s ease-in-out, opacity ${this.animationDelay / 1000}s ease-in-out`;
		});
	};
}
