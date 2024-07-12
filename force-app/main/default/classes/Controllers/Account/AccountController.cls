public with sharing class AccountController {
  @AuraEnabled(cacheable=true)
  public static Account getAccount(Id accountId) {
    return [
      SELECT Id, Name, AccountNumber
      FROM Account
      WHERE Id = :accountId
      LIMIT 1
    ];
  }

  @AuraEnabled(cacheable=true)
  public static User getCurrentUser() {
    return [
      SELECT Id, IsManager__c
      FROM User
      WHERE Id = :UserInfo.getUserId()
    ];
  }
}
