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

### Initialize tabs

```javascript
tabs.init();
```

			deletableTabs = false,
			initialTab = 0,
			vertical = false,
			autoplay = {
				delay: 0,
			},

## API

### Config Properties

##### tabbuttonsListSelector
**Type:** `string`
**Default:** `'[data-tabs="tabs"]'`
**Description:** Css selector for elements with tabs

##### tabpanelsListSelector
**Type:** `string`
**Default:** `'[data-tabs="content"]'`
**Description:** Css selector for elements with tabs content

##### deletableTabs
**Type:** `boolean`
**Default:** `false`
**Description:** Ability to delete tabs and their contents.

##### initialTab
**Type:** `number`
**Default:** `0`
**Description:** Id of the tab will be active after tabs initialization. buttons.

##### vertical
**Type:** `boolaen`
**Default:** `false`
**Description:** Vertical layout of slides.

##### autoplay
**Type:** `object`

###### Autoplay config properties
##### vertical
**Delay:** `boolaen`
**Default:** `0`
**Description:** Autoplay delay. A value of 0 disables autoplay.


### Methods

##### init()
**Return:** -
**Arguments:** -
**Required to use**
**Description:** Initialize all listeners and methods.

##### setActive(index)
**Return:** -
**Arguments:** `id`
**Description:** makes tab with target id active.

##### getNextIndex()
**Return:** Index of slide fater active, and 0 if current active slide is last
**Arguments:** -

##### getPreviousIndex()
**Return:** Index of slide before active, and index of last slide if current index = 0
**Arguments:** -

##### getLastIndex()
**Return:** Index of last slide
**Arguments:** -

##### stopAutoPlay()
**Return:** -
**Arguments:** -
**Description:** Stop the autoplay animation.

##### update()
**Return:** -
**Arguments:** -
**Description:** Update all indexes, properties and attributes for each tab.


## License

MIT