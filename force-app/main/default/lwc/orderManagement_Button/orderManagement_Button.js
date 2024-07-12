import { LightningElement, api } from "lwc";
import { NavigationMixin } from "lightning/navigation";

export default class OrderManagement_Button extends NavigationMixin(
  LightningElement
) {
  @api recordId;
  url;

  connectedCallback() {
    this.accountOrderManagementRef = {
      type: "standard__webPage",
      attributes: {
        url: `/lightning/n/Order_Management?accountId=${this.recordId}`
      }
    };
    this[NavigationMixin.GenerateUrl](this.accountOrderManagementRef).then(
      (url) => (this.url = url)
    );
  }

  handleClick(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    this[NavigationMixin.Navigate](this.accountOrderManagementRef);
  }
}
