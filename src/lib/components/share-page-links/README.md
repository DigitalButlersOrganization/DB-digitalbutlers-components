# SharePageLinks

## Usage

### Create an HTML markup

```html
<section>
				<a href="" data-network-name="whats-app">WhatsApp</a>
				<a href="" data-network-name="facebook">Facebook</a>
				<a href="" data-network-name="twitter">Twitter</a>
				<a href="" data-network-name="linkedin">Linkedin</a>
				<a href="" data-network-name="telegram">Telegram</a>
				<a href="" data-network-name="email">Email</a>
</section>
```

### Create SharePageLinks instance

```javascript
import { SharePageLinks } from '@digital-butlers/components/share-page-links';

const shareLinks = new SharePageLinks({
	messageForShareViaEmail: "This is really important! Don't miss it", // the text to insert in the "body of the message" field (if we share a link to the page in the email)
	pageName: 'Custom page name', // if there is no 'title', 'h1', '[role="heading"][aria-level="1"]' on the page, this text will be used instead
});

shareLinks.init();

```

## API

### Config Properties


### `messageForShareViaEmail`
*Type:* `string`
*Default:* `'I think it will be interesting for you to read this article'`
*Description:* The text to insert in the "subject of the message" field (if we share a link to the page in the email)

### `pageName`
*Type:* `string`
*Default:* `'We recommend it for reading'`
*Description:* If there is no 'title', 'h1', '[role="heading"][aria-level="1"]' on the page, this text will be used instead


### Events callback config object

### `afterInit`
*Type:* `function`
*Default:* `undefined`
*Description:* Callback will be started after SharePageLinks initialization

## License

MIT
