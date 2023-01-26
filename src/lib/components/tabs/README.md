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

## API

### Properties

| Name                    | Type               | Default              | Description                                                                                                                                                                                                           |
|-------------------------|--------------------|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `tabSelector` required  | `string`           | `undefined`          | Css selector for elements with tabs content.                                                                                                                                                                          |
| `btnSelector`           | `string`           | `undefined`          | Css selector for elements used to switch between tabs.                                                                                                                                                                |
| `navSelector`           | `string`           | `undefined`          | Css selector for navigation element. If can element with selector not found this.nav will be set to first button parent. Used to insert moving background element if this `hasMovingBackground` sets to `true`        |
| `activeClass`           | `string`           | `'js--active'`       | Class to be added to active tab and button.                                                                                                                                                                           |
| `eventType`             | `string`           | `'click'`            | Event type will be listened at buttons.                                                                                                                                                                               |
| `initialTab`            | `number`, `string` | `0`                  | Id or name of the tab will be active after tabs initialization.                                                                                                                                                       |
| `hasMovingBackground`   | `boolean`          | `false`              | If `true` it will init (and create if it's needed) element with `movingBackgroundClass` class. It's the element that will be moved to create a visual effect like [there](https://royals-postpartum.webflow.io/blog). |
| `movingBackgroundClass` | `string`           | `'tabs__background'` | Moving background class.                                                                                                                                                                                              |
| `searchParameterName`   | `string`           | `undefined`          | If sets on tab change url search parameter `searchParameterName` will be changed to active tab name.                                                                                                                  | 
| `tabNameAttribute`      | `string`           | `'data-tab-name'`    | Tab element attribute with tab name.                                                                                                                                                                                  |                                                                                                                                                   

### Methods

| Name         | Return                 | Arguments                  | Description                                                                                       |
|--------------|------------------------|----------------------------|---------------------------------------------------------------------------------------------------|
| `init()`     | Tabs instance          | -                          | Initialize all listeners.                                                                         |
| `goTo(id)`   | Active tab HTMLElement | `id`: `number` or `string` | If typeof `id` === `'string'` makes tab with name `id` active. Else makes tab number `id` active. |
| `goToNext()` | Active tab HTMLElement | -                          | Makes next tab active.                                                                            |
| `goToPrev()` | Active tab HTMLElement | -                          | Makes previous tab active.                                                                        |

## License

MIT

Copyright © 2021 [kirillsakun](https://github.com/kirillsakun).