var VinoShop = artifacts.require("./VinoShop.sol");

contract("VinoShop", function(accounts) {
  var VinoShopInstance;

  it("it initializes with 4  items", function() {
    return VinoShop.deployed().then(function(instance) {
      return instance.wineCount();
    }).then(function(count) {
      assert.equal(count, 4);
    });
  });

  it("it initializes the the list with empty cart", function() {
    return VinoShop.deployed().then(function(instance) {
      VinoShopInstance = instance;
      return VinoShopInstance.cartitemCount();
    }).then(function(count) {
      assert.equal(count , 0, "cart starts empty");
    });
  });

});
