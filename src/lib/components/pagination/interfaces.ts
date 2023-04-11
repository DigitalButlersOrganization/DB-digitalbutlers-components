export interface PaginationConfigModel {
  paginationWrapperSelector?: string,
  dynamicElementSelector?: string,
  previousButtonInner?: string,
  nextButtonInner?: string,
  itemsPerPage: number,
  hiddenButtons?: {
    min: number,
  }
  animationLength: number,
	// tabbuttonsListSelector: string,
	// deletableTabs: boolean,
	// initialTab: number,
	// orientation: OrientationType,
	// equalHeight: boolean,
	// autoplay: AutoPlayModel,
	// on: EventsModel,
}

export interface hiddenButtonsConfigModel {
  min: number,
}

export interface pageMapItemModel {
  page: any,
  visible: boolean,
  current: boolean,
}

export interface addButtonsPropertiesModel {
  content: string,
  label: string,
}
