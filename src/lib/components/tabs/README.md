# Tabs

## Usage

### Create an HTML markup

```html

<div data-tabs="wrapper">
  <div data-tabs="tabs">
    <button>Tab 1</button>
    <button>Tab 2</button>
    <button>Tab 3</button>
  </div>
  <ul data-tabs="content">
    <li>
      <p>Tab 1 content</p>
    </li>
    <li>
      <p>Tab 2 content</p>
    </li>
    <li>
      <p>Tab 3 content</p>
    </li>
  </ul>
</div>
```

### Create tabs instance

```javascript
const tabs = new Tabs(
  '[data-tabs="wrapper"]', // your custom wrapper selector or an HTML Element
  { // config object
    tabbuttonsListSelector: '[data-tabs="tabs"]', // your custom tab list selector
    tabpanelsListSelector: '[data-tabs="content"]', // your custom content panels list selector
  }
);
```

## API

### Config Properties

### `tabbuttonsListSelector`
*Type:* `string`  
*Default:* `'[data-tabs="tabs"]'`  
*Description:* Css selector for elements with tabs  

### `tabpanelsListSelector`
*Type:* `string`  
*Default:* `'[data-tabs="content"]'`  
*Description:* Css selector for elements with tabs content  

### `deletableTabs`
*Type:* `boolean`  
*Default:* `false`  
*Description:* Ability to delete tabs and their contents.  

### `initialTab`
*Type:* `number`  
*Default:* `0`  
*Description:* Id of the tab will be active after tabs initialization. buttons.  

### `orientation`
*Type:* `horizontal | vertical`  
*Default:* `horizontal`  
*Description:* orientation of tab buttons layout.  

### `autoplay`
*Type:* `object`  

#### Autoplay config object

### `delay`  
*Type:* `number`  
*Default:* `0`  
*Description:* Autoplay delay. A value of 0 disables autoplay.  

### `autoplay`
*Type:* `object`  
*Description:* Callbacks that can be initialized after some events with tabs  

#### Events callback config object

### `tabChange`  
*Type:* `function`  
*Default:* `undefined`  
*Description:* Callback will be started after every tab changing event  

### `beforeInit`  
*Type:* `function`  
*Default:* `undefined`  
*Description:* Callback will be started before tabs initialization  

### `afterInit`  
*Type:* `function`  
*Default:* `undefined`  
*Description:* Callback will be started after tabs initialization  


### Properties

### `activeIndex`  
*Type:* `number`  
*Description:* Index of current active tab.  

### `nextIndex`  
*Type:* `number`  
*Description:* Index of tab after current active (0 if cuurent tab is last).  

### `prevIndex`  
*Type:* `number`  
*Description:* Index of tab before current active (last if cuurent tab is first).  

### `lastIndex`  
*Type:* `number`  
*Description:* Index of last tab.

### `tabsWrapper`  
*Type:* `HTMLElement`  
*Description:* Main Tabs wrapper HTML Element.  

### `tabList`  
*Type:* `HTMLElement`  
*Description:* Tab buttons wrapper HTML Element.  

### `tabPanelsList`  
*Type:* `HTMLElement`  
*Description:* Tab content wrapper HTML Element.  

### `tabs`  
*Type:* `HTMLElement[]`  
*Description:* Array of tab-buttons HTML elements  

### `panels`  
*Type:* `HTMLElement[]`  
*Description:* Array of tab-panels HTML elements

### `generatedId`  
*Type:* `string`  
*Description:* Automatically generated unique identificator which is assigned as the prefix in id's to each element inside main tabs wrapper


### Methods

### `goTo(index)`
*Return:* -  
*Arguments:* `id`  
*Description:* makes tab with target id active.  

### `goToNext()`
*Return:* -  
*Arguments:* -  
*Description:* go to next tab.  

### `goToPrev()`
*Return:* -  
*Arguments:* -  
*Description:* go to previous tab.  

### `stopAutoPlay() ` 
*Return:* -  
*Arguments:* -  
*Description:* Stop the autoplay animation.  

### `update()`
*Return:* -  
*Arguments:* -  
*Description:* Update all indexes, properties and attributes for each tab.  

### `destroy()`
*Return:* -  
*Arguments:* -  
*Description:* Irreversible action! Remove all indexes, classes, properties and attributes for each tab.  


## License

MIT