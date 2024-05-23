var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const index = "";
const DEFAULT_PARAMETERS = {
  messageForShareViaEmail: "I think it will be interesting for you to read this article",
  pageName: "We recommend it for reading",
  on: {}
};
class SharePageLinks {
  constructor(customParameters) {
    __publicField(this, "linkSelector");
    __publicField(this, "href");
    __publicField(this, "arrayOfMainTagNames");
    __publicField(this, "arrayOfMainTags");
    __publicField(this, "arrayOfSharePageLinks");
    __publicField(this, "messageForShareViaEmail");
    __publicField(this, "pageName");
    __publicField(this, "on", {});
    __publicField(this, "init", () => {
      this.arrayOfMainTagNames.forEach((tagName) => {
        const element = document.querySelector(tagName);
        if (element)
          this.arrayOfMainTags.push(element);
      });
      this.pageName = this.arrayOfMainTags[0].textContent || this.pageName;
      this.arrayOfSharePageLinks.forEach((link) => {
        const network = link.dataset.networkName;
        switch (network) {
          case "whats-app": {
            link.href = `https://api.whatsapp.com/send?text=${this.href}`;
            break;
          }
          case "facebook": {
            link.href = `https://www.facebook.com/sharer.php?s=100&u=${this.href}&p[title]=${this.pageName}&p[summary]=${this.pageName}`;
            link.target = "_blank";
            break;
          }
          case "twitter": {
            link.href = `http://twitter.com/share?text=${this.pageName}&url=${this.href}`;
            link.target = "_blank";
            break;
          }
          case "linkedin": {
            link.href = `https://www.linkedin.com/shareArticle?mini=true&url=${this.href}&title=${this.pageName}`;
            link.target = "_blank";
            break;
          }
          case "email": {
            link.href = `mailto:someone@example.com?subject=${this.pageName}&body=${this.messageForShareViaEmail}%20${this.href}`;
            link.target = "_blank";
            break;
          }
          case "telegram": {
            link.href = `https://telegram.me/share/url?url=${this.href}&text=${this.pageName}`;
            link.target = "_blank";
            break;
          }
        }
      });
      if (this.on.afterInit) {
        this.on.afterInit(this);
      }
    });
    const parameters = { ...DEFAULT_PARAMETERS, ...customParameters };
    this.linkSelector = "a[data-network-name]";
    this.href = window.location.href;
    this.arrayOfMainTagNames = ["title", "h1", '[role="heading"][aria-level="1"]'];
    this.arrayOfMainTags = [];
    this.arrayOfSharePageLinks = Array.from(document.querySelectorAll(this.linkSelector));
    this.messageForShareViaEmail = parameters.messageForShareViaEmail;
    this.pageName = parameters.pageName;
    this.on = parameters.on;
  }
}
export {
  SharePageLinks
};
