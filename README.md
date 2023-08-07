# ReactIFDO Module

This is a IFDO service modules for React-only Websites. [IFDO](https://ifdo.co.kr/) is a data-driven marketing automation service that helps improve conversion rates. 

For more information, please visit our website [IFDO Service](https://ifdo.co.kr/spec_segment.apz).

If you want to use IFDO service in React, please follow the procedure below.

## Install

Install react-ifdo module with npm.

```bash
npm i react-ifdo
``` 

## Usage

Initializing ReactIFDO and Tracking Pageviews : Create a `RouterIFDOTracker.js` file. And define the code as below.

###### RouterIFDOTracker.js

```js
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactIFDO from "react-ifdo";

const RouterIFDOTracker = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    ReactIFDO.initialize('NTA0000000011');                      // Initializing ReactIFDO
    setInitialized(true);
  }, []);

  useEffect(() => {
    if(initialized) {
        ReactIFDO.pageView(location.pathname + location.search);  // Tracking Pageviews
    }   
  }, [initialized, location]);
};

export default RouterIFDOTracker;

```

This function is called where Router is defined.


###### Router.js

```js
...
import RouterIFDOTracker from './RouterIFDOTracker'; 

function Router() {
   RouterIFDOTracker(); 
   return(
      ...
   );
}

export default Router;

```



For a working demo have a look at the demo files or clone this repo and run npm install npm start then open http://localhost:8080 and follow the instructions. Demo requires you to have your own TrackingID. 

## API

#### ReactIFDO.initialize('GCODE')

This function must be used to initialize ReactIFDO before other tracking functions can record data. If you want to get a GCODE, Sign up here [IFDO Join](https://ifdo.co.kr/join_ifdo.apz) and apply for the service.

###### Example

```js
ReactIFDO.initialize('NTA0000000011');
```

| Value                              | Notes                                                                                                                                                                             |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GCODE | `String`. Required. IFDO Tracking CODE like `NTA0000000011`. |


#### ReactIFDO.pageView(path)

It functions to track page views. Must be declared with initialize() function. The path is passed as a parameter, but not directly by this function. If you want to specify a path, check the function below.

###### Example

```js
ReactIFDO.pageView();
```

#### Variable Settings

You have to set the necessary variables for each page, such as membership registration(1), login(2), product details(3), shopping basket(4), purchase (5) , internal search(6) , and wishList(7).

##### 1. Member Registration Analysis

Set the following variables on the membership registration page. The variables required for this page are membership ID and membership status.

###### Example

```js
ReactIFDO._NB_JID = "david"; 
ReactIFDO._SEND("join"); // or ReactIFDO._SEND("withdraw"); 
```

| Value | Notes|
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _NB_JID | `String`. Required. Join ID like `david`. |
| _SEND | `String`. Required. Sign up/cancellation status like `join` or `withdraw`.|

After setting the variable, call the _SEND() function is required. See the _SEND() function below.

##### 2. Member Login Analysis

The member login page requires a login ID and an object variable with email, age, gender, and lastly all that information. Please set it according to the format below.

###### Example

```js
ReactIFDO._NB_ID = 'david';              
ReactIFDO._NB_EMAIL = 'david@test.com';                
ReactIFDO._NB_UDF = { 'udf01': '', 'udf02': '', 'udf03': '', 'udf04': '' };
ReactIFDO._SEND("login");
```

| Value | Notes|
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _NB_ID  | `String`. Required. Login ID like `david`. |
| _NB_EMAIL | `String`. Required. User Email like `david@test.com`. |
| _NB_UDF | `Object`. Required. User Infomation like `{ 'udf01': '', 'udf02': '', 'udf03': '', 'udf04': '' }`. |

After setting the variable, call the _SEND() function is required. See the _SEND() function below.

##### 3. Product Inquiry Analysis

These are the variables required for the product detail page. Write it according to the product category, product name, product code, price, product image, and whether it is out of stock.

###### Example

```js
ReactIFDO._NB_CT = 'outer';   
ReactIFDO._NB_PD = 'padding';      
ReactIFDO._NB_PC = 'a-15978';   
ReactIFDO._NB_AMT = 48000;    
ReactIFDO._NB_IMG = 'https://www.example.com/productImg.jpg'; 
ReactIFDO._NB_PD_USE = '';   
ReactIFDO._SEND("prodDetail");
```

| Value | Notes|
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _NB_CT  | `String`. Optional. Product category like `outer`. |
| _NB_PD | `String`. Required. Name of the product like `padding`. |
| _NB_PC | `String`. Optional. Product code like `a-15978`. |
| _NB_AMT | `Number`. Required. Product price like `48000`. |
| _NB_IMG | `Object`. Optional. Product image url like `https://www.example.com/productImg.jpg`. |
| _NB_PD_USE | `String`. Required. The default is blank. if it is out of stock, Enter `N`. |

After setting the variable, call the _SEND() function is required. See the _SEND() function below.

##### 4. Shopping Cart Analysis

Variable required for shopping cart page. 'u' must be entered as a shopping cart separator.

###### ReactIFDO._NB_LO.push({PC : '', PN : 'Product Name', CT : '', AM : 'Amount', PR : 'Product Total Amount'});

or

###### ReactIFDO._NB_LO.push( {PC : 'Product Code', PN : 'Product Name', CT : 'Category', AM : 'Amount', PR : 'Product Total Amount'} );

###### Example

```js
for (...) {
   // 장바구니 상품 리스트 객체
   ReactIFDO._NB_LO.push({ PC : 'a-15978', PN : 'padding', CT : 'outer', AM : 1, PR : 32000 });
}
ReactIFDO._SEND("cart");
```

| Value | Notes|
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _NB_LO.push | `object`. Required. Enter in the object format that contains each information like `{ PC : 'a-15978', PN : 'padding', CT : 'outer', AM : 1, PR : 32000 }`. |
| PC | `String`. Optional. Product code like `a-15978`. |
| PN | `String`. Required. Name of the product like `padding`. |
| CT | `String`. Optional. Product Category like `outer`. |
| AM | `Number`. Required. Number of Orders like `1`. |
| PR | `Number`. Required. Total amount of product like `32000`. |


After setting the variable, call the _SEND() function is required. See the _SEND() function below.

##### 5. Purchase Analysis

Set the following variables on the order completion page. Be especially careful when creating the `NB_LO.push` variable. Even if it is an optional value, you must also enter a required variable name. Please look carefully at the format and fill it out accordingly.

###### ReactIFDO._NB_LO.push({PC : '', PN : 'Product Name', CT : '', AM : 'Amount', PR : 'Product Total Amount'});

or

###### ReactIFDO._NB_LO.push({PC : 'Product Code', PN : 'Product Name', CT : 'Category', AM : 'Amount', PR : 'Product Total Amount'});

###### Example

```js
ReactIFDO._NB_ORD_NO = "ord-154982";
ReactIFDO._NB_ORD_AMT = 5;                                                                         
for (...) {
   // 구매 상품 리스트 객체
   ReactIFDO._NB_LO.push({ PC : 'a-15978', PN : 'padding', CT : 'outer', AM : 1, PR : 32000 });
}
ReactIFDO._SEND("order");
```

| Value | Notes|
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _NB_ORD_NO | `String`. Required. Order Number like `ord-154982`. |
| _NB_ORD_AMT | `Number`. Required. Number of Orders like `5`. |
| _NB_LO.push | `object`. Required. Enter in the object format that contains each information like `{ PC : 'a-15978', PN : 'padding', CT : 'outer', AM : 1, PR : 32000 }`. |
| PC | `String`. Optional. Product code like `a-15978`. |
| PN | `String`. Required. Name of the product like `padding`. |
| CT | `String`. Optional. Product Category like `outer`. |
| AM | `Number`. Required. Number of Orders like `1`. |
| PR | `Number`. Required. Total amount of product like `32000`. |


After setting the variable, call the _SEND() function is required. See the _SEND() function below.

##### 6. Internal Search Analysis

Fill out the product search page. A variable representing each keyword and the number of search results.

###### Example

```js
ReactIFDO._NB_kwd = 'black dress';
ReactIFDO._NB_AMT = 20; 
ReactIFDO._SEND("prodSearch");
```

| Value | Notes|
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _NB_kwd | `String`. Required. Internal search terms like `black dress`. |
| _NB_AMT | `Number`. Required. Number of internal search results like `20`. |

After setting the variable, call the _SEND() function is required. See the _SEND() function below.

##### 7. Wish List Analysis

Lastly, the wish list page. You must create a separation value for the wish list with `w` . And be careful when you write the `_NB_LO.push()` function.

###### ReactIFDO._NB_LO.push({PC : '', PN : 'Product Name', CT : '', AM : 'Amount', PR : 'Product Total Amount'});

or

###### ReactIFDO._NB_LO.push({PC : 'Product Code', PN : 'Product Name', CT : 'Category', AM : 'Amount', PR : 'Product Total Amount'});

###### Example

```js
for (...) {
   // 위시 리스트 상품 리스트 객체
   ReactIFDO._NB_LO.push({ PC : 'a-15978', PN : 'padding', CT : 'outer', AM : 1, PR : 32000 });
}
ReactIFDO._SEND("wishList");
```

| Value | Notes|
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _NB_LO.push | `object`. Required. Enter in the object format that contains each information like `{ PC: 'a-15978', PN: 'padding', CT: 'outer', AM: 1, PR: 32000 }`. |
| PC | `String`. Optional. Product code like `a-15980`. |
| PN | `String`. Required. Name of the product like `padding`. |
| CT | `String`. Optional. Product Category like `outer`. |
| AM | `Number`. Required. Number of Orders like `1`. |
| PR | `Number`. Required. Total amount of product like `32000`. |


After setting the variable, call the _SEND() function is required. See the _SEND() function below.

#### ReactIFDO._SEND()

Function called after each page's variable is declared. At this time, if there is a path you want to specify, you can put it as the second factor value.

###### Example

```js
ReactIFDO._SEND('join');
```

If you are setting a direct path,

```js
ReactIFDO._SEND('join','https://www.example.com');
```

After you finish writing the script code for each page, the script installation is complete. 

## Development

### Prerequisites

- node.js
- npm
- `npm install`
- `npm install react@^15.6.1 prop-types@^15.5.10`

### Running tests

```bash
npm test
```

## Maintainer

#### Submitting changes/fixes

If you have any questions, feel free to contact me below.

+ IFDO - [https://ifdo.co.kr/](https://ifdo.co.kr/)
