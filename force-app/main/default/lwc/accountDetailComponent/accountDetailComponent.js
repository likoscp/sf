import { LightningElement, api, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import getAccount from "@salesforce/apex/AccountController.getAccount";
import getCurrentUser from "@salesforce/apex/AccountController.getCurrentUser";

export default class AccountDetailComponent extends NavigationMixin(
  LightningElement
) {
  @api recordId;
  account;
  error;
  isManager = false;
  userError;

  @wire(getAccount, { accountId: "$recordId" })
  wiredAccount({ error, data }) {
    if (data) {
      this.account = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this.account = undefined;
    }
  }

  @wire(getCurrentUser)
  wiredUser({ error, data }) {
    if (data) {
      this.isManager = data.IsManager__c;
      this.userError = undefined;
    } else if (error) {
      this.userError = error;
    }
  }

  handleCreateProduct() {}

  handleGoToCart() {
    this[NavigationMixin.Navigate]({
      type: "standard__component",
      attributes: {
        componentName: "c__CartComponent"
      }
    });
  }
}
