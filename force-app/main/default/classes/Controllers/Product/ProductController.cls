public with sharing class ProductController {
  @AuraEnabled(cacheable=true)
  public static List<Product__c> getProducts() {
    return [
      SELECT Id, Name, Description__c, Type__c, Family__c, Price__c, Image__c
      FROM Product__c
    ];
  }
}
