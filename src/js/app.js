App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
        return App.initWeb3();
  },
  initWeb3: function() {
          // Find and set current web3 povider
          if (typeof web3 !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
          } else {
            // Specify default instance if no web3 instance provided
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
            web3 = new Web3(App.web3Provider);
          }
          return App.initContract();
  },

  //initialize contract VinoShop
  initContract: function() {
          $.getJSON("VinoShop.json", function(VinoShop) {
            // Instantiate a new truffle contract from the artifact
            App.contracts.VinoShop = TruffleContract(VinoShop);
            // Connect provider to interact with contract
            App.contracts.VinoShop.setProvider(App.web3Provider);
            // event listener
            App.listenForEvents()
            return App.render();
          });
  },

  // method for events
  listenForEvents: function() {
      App.contracts.VinoShop.deployed().then(function(instance) {
        instance.addItemToCartEvent({}, {
          fromBlock: 0,
          toBlock: 'latest'
        }).watch(function(error,result) {

                if(!error) {
                var cartResults = $("#cartResults");
                var subtotal = $("#subtotal");
                var cart_length = $("#cart_length");

                var name = result.args.name;
                var subt = result.args.subtotal.toNumber();
                var price = result.args.price.toNumber();
                var cartItems = result.args.cartItemsCount.toNumber();
                var cartTemplate = "<tr><th>" + name + "</th><td>" + price + "</td></tr>"
                cartResults.append(cartTemplate);
                subtotal.html("You cart subtotal: " + subt );
                cart_length.html("Item(s) in cart " + cartItems);

              } else {

                cartResults.html(error);

              }

            });

            instance.checkoutEvent({}, {
              fromBlock: 0,
              toBlock: 'latest'
            }).watch(function(error,result) {

                    if(!error) {
                    var cartResults = $("#cartResults");
                    cartResults.empty();
                    var subtotal = $("#subtotal");
                    subtotal.empty();
                    var cart_length = $("#cart_length");
                    cart_length.empty();

                    subtotal.html("Thank you  :) Your cart is empty" );
                  } else {

                    cartResults.html(error);

                  }

                });

        });
    },

  render: function() {
          var wineInstance;
          // Load wine list
          web3.eth.getCoinbase(function(err, account) {
              if (err === null) {
                App.account = account;
                $("#accountAddress").html("Shopping for account: " + account);
                }
          });

          // Load contract data
          App.contracts.VinoShop.deployed().then(function(instance) {
              wineInstance = instance;
              return wineInstance.wineCount();
                }).then(function(wineCount) {
                    var wineResults = $("#wineResults");
                    wineResults.empty();
                    var wineSelect = $("#wineSelect");
                    wineSelect.empty();

                          for (var i = 1; i <= wineCount; i++) {
                                wineInstance.wines(i).then(function(wine) {
                                  var id = wine[0];
                                  var name = wine[1];
                                  var des = wine[2];
                                  var wine_price = wine[3];
                                  var wine_qty = wine[4];

                                  // Render candidate Result
                                  var wineTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + des + "</td><td>" + wine_price + "</td><td>" + wine_qty + "</td></tr>"
                                  wineResults.append(wineTemplate);

                                  // Render list option
                                  var wineOption = "<option value=" + id + ">" + name + "</ option>"
                                  wineSelect.append(wineOption);
                            });
                      }
                });
    },

  ToCart: function() {
    // method triggers on add to cart button
    // gets the account from the intance and calls addToCart function
    // from VinoShop contract.
      var cart_item_id = $("#wineSelect").val();
      var cart_length = $("cart_length");
      App.contracts.VinoShop.deployed().then(function(instance){
            web3.eth.getCoinbase(function(account){
            App.account =  account;
            instance.addToCart(cart_item_id, {from: account});

            });
        });
    },

    Checkout: function() {
      // call CheckOutCart function in smart contract
        App.contracts.VinoShop.deployed().then(function(instance){
              web3.eth.getCoinbase(function(account){
              App.account =  account;
              instance.CheckOutCart({from: account});

                });
          });
      },
  }

  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
