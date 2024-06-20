import { SharePageLinks } from '../../lib/components/share-page-links';

const shareLinks = new SharePageLinks({
	messageForShareViaEmail: 'I think it will be interesting for you to read this article', // the text to insert in the "body of the message" field (if we share a link to the page in the email)
	pageName: 'We recommend it for reading', // if there is no 'title', 'h1', '[role="heading"][aria-level="1"]' on the page, this text will be used instead
});

shareLinks.init();
