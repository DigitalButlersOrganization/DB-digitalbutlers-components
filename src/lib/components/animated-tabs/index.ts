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
		this.setInlineStyles();
	};

	public setActive = (index: number, setFocus: boolean = true) => {
		// console.log(this.focusTab);
		this.currentActive = index;
		this.setInvisibleAll();
		setTimeout(() => {
			this.setUnactiveAll();
			this.setActiveAttributes(index);
			this.setActiveClasses(index);
			setTimeout(() => {
				this.setVisible(index);
				// this.tabs[index].classList.add(this.animatedClass);
				// this.panels[index].classList.add(this.animatedClass);
			}, 100);
		}, this.animationDelay);
		// Set focus when required
		if (setFocus) {
			this.focusTab(index);
		}
	};

	private setInvisibleAll = () => {
		[this.tabs, this.panels].flat().forEach((element) => {
			switch (this.animationType) {
			case 'opacity':
				if (this.panels.includes(element)) {
					this.setInvisibleByOpacity(element);
				}
				break;
			default:
				element.classList.remove(this.animatedClass);
				break;
			}
		});
	};

	private setVisible = (index: number) => {
		switch (this.animationType) {
		case 'opacity':
			this.setVisibleByOpacity(index);
			break;
		default:
			this.tabs[index].classList.add(this.animatedClass);
			this.panels[index].classList.add(this.animatedClass);
			break;
		}
	};

	private setVisibleByOpacity = (index: number) => {
		this.panels[index].classList.add(this.animatedClass);
		this.panels[index].style.opacity = '1';
	};

	// eslint-disable-next-line class-methods-use-this
	private setInvisibleByOpacity = (element: HTMLElement) => {
		// eslint-disable-next-line no-param-reassign
		element.style.opacity = '0';
	};

	private setInlineStyles = () => {
		[this.tabs, this.panels].flat().forEach((element) => {
			// eslint-disable-next-line no-param-reassign
			element.style.transition = `transform ${this.animationDelay / 1000}s ease-in-out, opacity ${this.animationDelay / 1000}s ease-in-out`;
		});
	};
}
