pragma solidity ^0.5.8;

/*
 @title VinoShop
 @ dev This is a simple store app with preloaded items. The user can add items to a cart
    every item added to a cart inccurs a cost. This is no ideal so it is an opportunity for improvement.

  At checkout a transaction will occur, the balance of current account and the wine list items will update.
  After checkout the cart will be empty.

  TODO: solve issues with checkout and empty cart functions
  - Metamask keeps trowing expection when calling the payable function CheckOutCart; error = "rpc error with payload"
  - Metamask throws same error, rpc error with payload
*/
contract VinoShop {
  address owner;
//@dev modifer allowing only owner of contract
  modifier onlyOwner(){
    require(msg.sender == owner,   "not working");
    _;
  }
//@dev creating a struct for wine inventory
struct WineList{
    uint vin_ID;
    string vin_Name;
    string vin_Des;
    uint vin_Price;
    uint inv_Qty;
  }
//@dev temporary cart struct
struct WineCart{
  uint wineid;
  uint wineprice;
}
//@dev Event triggers after new item added to cart
event addItemToCartEvent(string name, uint price, uint subtotal, uint cartItemsCount);
event checkoutEvent (uint subtotal);
//@dev wines mapping holds the wine list.
// cart mapping holds cart items for current address
// subtotal mapping keeps cart subtotal amount before checkout
// balance mapping to keep track of payments
mapping (uint => WineList) public wines;
mapping(address => WineCart[]) public cart;
mapping(address => uint) public subtotal;
mapping(address => uint) balance;

// @ dev variable to use in the smart contract
//winecount is number of items in  inventory
//cartitemCount is number of in current cart
//name
uint public wineCount;
uint public cartitemCount;
string public name;
uint public price;


constructor() public {
  owner = msg.sender;

//@dev List of Vino available.
/*Improvement Prop: Using oracles to retrive list of Vino from
  distribution center*/
  addWineItem("Duckhorn Merlot", "Napa Valley Three Palms Vineyard",1 wei,1000);
  addWineItem("K Syrah ", "Walla Walla Valley Powerline Estate",2 wei,1500);
  addWineItem("Château Coutet", "Barsac",2 wei,2000);
  addWineItem("Casanova di Neri", "Brunello di Montalcino",1 wei,2000);
}

function  addWineItem(string memory _name, string memory _des, uint _price, uint _qty) private {
  wineCount++;
  wines[wineCount] = WineList(wineCount, _name, _des, _price, _qty);
}

function addToCart(uint _cart_item_id) public  returns (bool){

  cartitemCount++;
  //var newCartItem = cart[_cust];
  WineCart memory newCartItem;
  name = wines[_cart_item_id].vin_Name;
  price = wines[_cart_item_id].vin_Price;
  newCartItem.wineid = _cart_item_id;
  newCartItem.wineprice = wines[_cart_item_id].vin_Price;
  subtotal[msg.sender] += newCartItem.wineprice;
  cart[msg.sender].push(newCartItem);

  emit addItemToCartEvent(name,price,subtotal[msg.sender],cartitemCount);

  return true;
}

/*
Checkout function is not finished and metamask keeps throwing Alert: Transancion error.
Function SHOULD be paybable but keep getting errors in metamask
TODO: figure out a way to accept payment for items


*/
function CheckOutCart() public payable {

    //wines[id].inv_Qty--  cart[address][x].
    //require(msg.value == subtotal[msg.sender]);
    //balance[msg.sender] += msg.value;
//    subtotal[msg.sender] = 0;

    emit checkoutEvent (subtotal[msg.sender]);
}


// this function should work with Checkout function to reduce item quantity.
function decrementQuantity(uint _dcnum) private {
  wines[_dcnum].inv_Qty--;
}


//empty cart function does not work
// Metamask throws error on pay load
function emptyCart() public {
  delete cart[msg.sender];
  subtotal[msg.sender] = 0;
}

}
