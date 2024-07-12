import { LightningElement, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import getProducts from "@salesforce/apex/ProductController.getProducts";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class OrderManagement extends LightningElement {
  @track recordId;
  @track searchKey = "";
  @track typeFilter = [];
  @track familyFilter = [];
  @track products = [];
  @track filteredProducts = [];
  @track cart = [];
  @track typeFilterOptions = [];
  @track familyFilterOptions = [];
  @track isModalOpen = false;
  @track selectedProduct = {};

  @wire(CurrentPageReference)
  getPageReference(pageRef) {
    if (pageRef) {
      this.setRecordId(pageRef.state.c__recordId);
    }
  }

  setRecordId(id) {
    this.recordId = id;
  }

  connectedCallback() {
    this.loadProducts();
  }

  loadProducts() {
    getProducts()
      .then((result) => {
        this.products = result;
        this.filteredProducts = this.products;
        this.setFilterOptions();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setFilterOptions() {
    const types = new Set();
    const families = new Set();

    this.products.forEach((product) => {
      types.add(product.Type__c);
      families.add(product.Family__c);
    });

    this.typeFilterOptions = Array.from(types).map((type) => ({
      label: type,
      value: type
    }));
    this.familyFilterOptions = Array.from(families).map((family) => ({
      label: family,
      value: family
    }));
  }

  handleSearch(event) {
    this.searchKey = event.target.value.toLowerCase();
    this.filterProducts();
  }

  handleFilterChange(event) {
    const filterName = event.target.dataset.name;
    const filterValue = event.target.value;

    if (event.target.checked) {
      if (filterName === "type") {
        this.typeFilter.push(filterValue);
      } else if (filterName === "family") {
        this.familyFilter.push(filterValue);
      }
    } else {
      if (filterName === "type") {
        this.typeFilter = this.typeFilter.filter(
          (type) => type !== filterValue
        );
      } else if (filterName === "family") {
        this.familyFilter = this.familyFilter.filter(
          (family) => family !== filterValue
        );
      }
    }
    this.filterProducts();
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product) => {
      return (
        product.Name.toLowerCase().includes(this.searchKey) &&
        (this.typeFilter.length === 0 ||
          this.typeFilter.includes(product.Type__c)) &&
        (this.familyFilter.length === 0 ||
          this.familyFilter.includes(product.Family__c))
      );
    });
  }
  handleDetails(event) {
    const productId = event.target.dataset.id;
    this.selectedProduct = this.products.find((prod) => prod.Id === productId);
    this.isModalOpen = true;
  }
  handleCloseModal() {
    this.isModalOpen = false;
  }

  handleAdd(event) {
    const productId = event.target.dataset.id;
    const product = this.products.find((prod) => prod.Id === productId);
    this.cart.push({
      ...product,
      quantity: 1
    });
    this.showToast(
      "Product added",
      `${product.Name} has been added to the cart`,
      "success"
    );
  }

  showToast(title, message, variant) {
    const evt = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(evt);
  }
}
