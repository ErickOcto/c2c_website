# SOFTWARE DESIGN DESCRIPTION
# C2C (Consumer-To-Consumer)
## Second Hand Items Seller

Document Number Page

# DPPL-C2C <#>/<quantity^ #^

- List of contents..........................................................................................................................................
- List of Tables.............................................................................................................................................
- list of Figures............................................................................................................................................
- 1. Introduction...........................................................................................................................................
   - 1.1 Purpose of Writing Documents....................................................................................................
   - 1.2 Scope of the Problem...................................................................................................................
   - 1.3 Definitions and Terms................................................................................................................
   - 1.4 Reference....................................................................................................................................
- 2 Global Planning....................................................................................................................................
   - 2.1 Environmental Implementation Plan..........................................................................................
   - 2.2 Software Architecture Description.............................................................................................
- 3 Detailed Design....................................................................................................................................
   - 3.1 Use Case Realization..................................................................................................................
      - 3.1.1 Use Case #1 User login.....................................................................................................
         - 3.1.1.1 Use Case Scenario #1 User login............................................................................
         - 3.1.1.2 UI Design and UI Object Description #1 User Login.............................................
         - 3.1.1.3 Object Identification and Class Type #1 User Login..............................................
         - 3.1.1.4 Sequence Diagram #1 User Login..........................................................................
   - 3.1.2 Use Case #2 Report Product....................................................................................................
      - 3.1.2.1 Use Case Scenario #2 Report Product...........................................................................
         - 3.1.2.2. UI Design and UI Object Description #2 Report Product......................................
         - 3.1.2.3 Identification of Objects and Class Types #2 Report Product.................................
         - 3.1.2.4 Sequence Diagram #2 Report Product....................................................................
      - 3.1.3 Use Case #3 Personal Profile Information........................................................................
         - 3.1.3.1 Use Case Scenario #3 Personal Profile Information...............................................
         - 3.1.3.2. UI Design and UI Object Description #3 Personal Profile Information................
         - 3.1.3.3 IdentificationObjectand Class Type #3 Personal Profile Information.....................
         - 3.1.3.4 Sequence Diagram #3 Personal Profile Information...............................................
      - 3.1.4 Use Case #4 Searching.....................................................................................................
         - 3.1.4.1 Use Case Scenario #4 Searching.............................................................................
         - 3.1.4.2 UI Design and UI Object Description #4 Searching...............................................
         - 3.1.4.3 Object Identification and Class Type #4 Searching................................................
         - 3.1.4.4 Sequence Diagram #4 Searching.............................................................................
      - 3.1.5 Use case #5 Management Listing.....................................................................................
         - 3.1.5.1 Use Case Scenario #5 Management Listing...........................................................
         - 3.1.5.2 UI Design and UI Object Description #5 Management Listing.............................
         - 3.1.5.3 IdentificationObjectand Class Type #5 Management Listing.................................
         - 3.1.5.4 Sequence Diagram #5 Management Listing...........................................................
            - DPPL-C2C Page 5 from Informatics
      - 3.1.6 Use Case #6 Make Order..................................................................................................
         - 3.1.6.1 Use Case Scenario #6 Make Order........................................................................
         - 3.1.6.2 UI Design and UI Object Description #6 Make Order............................................
         - 3.1.6.3 IdentificationObjectand Class Type #6 Make Order...............................................
         - 3.1.6.4 Sequence Diagram #6 Make Order.........................................................................
      - 3.1.7 Use Case #7 Shipping New Order....................................................................................
         - 3.1.7.1 Use Case Scenario #7 Shipping New Order............................................................
         - 3.1.7.2 UI Design and UI Object Description #7 Shipping New Order..............................
         - 3.1.7.3 IdentificationObjectand Class Type #7 Shipping New Order.................................
         - 3.1.7.4 Sequence Diagram #7 Shipping New Order...........................................................
      - 3.1.8 Use Case #8 Transaction & Payment................................................................................
         - 3.1.8.1 Use Case Scenario #8 Transaction & Payment.......................................................
         - 3.1.8.2 UI Design and UI Object Description #8 Transaction & Payment.........................
         - 3.1.8.3 Identification of Objects and Class Types #8 Transaction & Payment...................
         - 3.1.8.4 Sequence Diagram #8 Transaction & Payment.......................................................
      - 3.1.9 Use Case #9 Product Detail..............................................................................................
         - 3.1.9.1 Use Case Scenario #9 Product Detail......................................................................
         - 3.1.9.2 UI Design and UI Object Description #9 Product Detail........................................
         - 3.1.9.3 Object Identification and Class Type #9 Product Detail.........................................
         - 3.1.9.4 Sequence Diagram #9 Product Detail.....................................................................
      - 3.1.10 Use Case #10 Chat..........................................................................................................
         - 3.1.10.1 Use Case Scenario #10 Chat.................................................................................
         - 3.1.10.2 UI Design and Object Description #10 Chat.........................................................
         - 3.1.10.3 Identification Object and Class Type #10 Chat.....................................................
         - 3.1.10.4 Sequence Diagram #10 Chat.................................................................................
      - 3.1.11 Use Case #11 Notification..............................................................................................
         - 3.1.11.1 Use Case Scenario #11 Notification......................................................................
         - 3.1.11.2 UI Design and Object Description UI #11 Notification........................................
         - 3.1.11.3 New Object Identification & Class Type #11 Notification...................................
         - 3.1.11.4 Sequence Diagram #11 Notification......................................................................
   - 3.2 Class Diagram............................................................................................................................
   - 3.3 Detail Class Development..........................................................................................................
   - 3.3.2 Algorithm................................................................................................................................
- 4 Requirement Traceability Matrix.........................................................................................................
            - DPPL-C2C Page 6 from Informatics


## List of Tables.............................................................................................................................................



```
DPPL-C2C Page 7 from 79
```



## list of Figures............................................................................................................................................



```
DPPL-C2C Page 8 from 79
```



## 1. Introduction...........................................................................................................................................

### 1.1 Purpose of Writing Documents....................................................................................................

This document we made is to specify our needs in this software for the C2C (Customer-to-Customer)
Marketplace (a web based platform that is designed for user to buying and selling second hand items).
The main purpose of this document is for defining the system’s functionalities, constraints, and the
requirements for guiding software development in a way that is structured

this document we made also serve as a reference for all development team members, including the
project manager, system analyst, backend developer, frontend developer, UI/UX designer, tester, and
documentation specialist. To ensure that our system is built to be secure, user friendly, and capable of
supporting safe and comfortable online platform for second hand transactions.

### 1.2 Scope of the Problem...................................................................................................................

This document covering all of the requirement for the C2C Marketplace platform. Including the core
functionalities, such as registration and authentication of user, product management for sellers, product
searching and filtering for users, transparent order and checkout processes, payment integration,
shipping tracking, review and rating for ordered item system, and reporting features

Our system focuses on two main users type: Buyer and Seller, with an additional Admin role thats
responsible for report handling, and transaction security on our platform.

Our platform is designed for supporting safe and transparent transactions through a mediation system,
so we can reduce the risk of fraud and providing an efficient and user-friendly second-hand shopping
experience.


```
DPPL-C2C Page 9 from 79
```


### 1.3 Definitions and Terms................................................................................................................

**C2C (Customer to Customer):** Business model where users act as both buyers and sellers through a
digital platform

**User:** Any person who interacts with the system, including buyers and sellers

**Buyer:** A user who purchases second hand items from the system

**Seller:** A user who list and sell second hand items on the platform

**Admin:** A system manager, that is responsible for maintaining the platform’s integrity, handling
reports, and ensuring every transaction’s safety

**FR (Functional Requirement):** A specific functional behavior or feature the system must perform

**API (Application Programming Interface):** A software for intermediary that allows communication
between systems (e.g., payment gateway or shipping cost API)

**UI/UX (User Interface / User Experience):** The design and interaction aspects that determine how
users experience and navigate the website

### 1.4 Reference....................................................................................................................................

**[1]** M. Hassanein and M. Head, “The impact of online trust and perceived enjoyment on consumer
online purchase decisions,” Information & Management, vol. 48, no. 6, pp. 321–327, 2011.

**[2]** D. Gupta, A. Nath, and R. P. Chauhan, E-commerce: Concepts, Models and Strategies. New Delhi,
India: Global Vision Publishing House, 2014.

**[3]** A. Nørskov and A. Rask, “Designing a trustworthy online second-hand marketplace: A study on
user behavior and platform features,” Journal of Retailing and Consumer Services, vol. 58, pp.
102–111, 2021.

**[4]** H. Lee and S. Park, “A model for evaluating the user experience in C2C marketplaces: Security,
usability, and customer satisfaction,” in Proceedings of the International Conference on E-Business
Engineering, Macau, China, Dec. 2020, pp. 88–94.

**[5]** RajaOngkir, “RajaOngkir API Documentation,” Online. Available: https://rajaongkir.com/.
(Accessed: 29 Sept. 2025).

**[6]** Xendit, “Xendit Payment Gateway API,” Online. Available: https://www.xendit.co/id/. (Accessed:
29 Sept. 2025).

**[7]** Midtrans, “Payment Gateway API Documentation,” Online. Available: https://midtrans.com/id.
(Accessed: 29 Sept. 2025).


```
DPPL-C2C Page 10 from 79
```


## 2 Global Planning....................................................................................................................................

### 2.1 Environmental Implementation Plan..........................................................................................

This software is intended to provide a safe, accessible, and user-friendly online marketplace for buying
and selling second-hand items. The main purpose of the platform is as a mediator of transactions
between buyers and sellers to reduce fraud, increase trust, and support sustainable consumption
practices.

Unlike informal buying and selling activities that occur through social media, where transactions are
often risky and lack accountability, the system acts as a secure intermediary to ensure that product
delivery, payment processes, and user interactions occur safely and transparently.

The product is **a new web-based system** that mitigates gaps and limitations from existing
second-hand marketplace. The C2C is aimed to improve the quality of existing marketplace by:

```
● Recommending alternative for customers who want high-quality second-hand goods at
affordable prices.
● Recommending items that suit their preference.
● Offer protection and support when disputes or product mismatches occur.
● Offer customer service when there is troubleshooting in a transaction.
● Encourage sustainable lifestyle choices through reuse and recycling.
```
The existence of administrators for this platform manage the database system as well as maintain a
safe buying process, ensuring that the platform is trusted with administrator as the mediator.

### 2.2 Software Architecture Description.............................................................................................

_Filled with a list of modules. The list of modules can be in the form of the following table:_

### The contents of the diagram components

```
No Component Name Description
1 Profile Every users’ personal data
2 User Every users’ data account
3 Buyer Buyers’ account activity
4 Report Report made by buyers and report management
5 Admin Admins’ data and account activity
6 Seller Sellers’ account activity
7 Review Review made by buyers and review management
8 Order Order made by buyers and order management
9 ProductListing Management of product listing by sellers
10 Message Chat feature information
11 Notification Notification feature information
12 Transaction Payment management
```

```
DPPL-C2C Page 11 from 79
```


## 3 Detailed Design....................................................................................................................................

### 3.1 Use Case Realization..................................................................................................................

```
No Nama Use Case Use Case Description
#1 User login This use case describes how a registered user logs into the
system securely using their credentials.
```
```
#2 Report product This use case describes how a user reports a product
suspected of violating platform rules to the Admin for
review and potential removal.
```
```
#3 Personal profile information Both buyer and sellers can input and update their personal
profile to ease the process of buy and sell
```
```
#4 Searching This use case makes the buyer search an active preloved
product list based on a keyword, and can narrow the result
by using filters and sorting. The result must be returned
with the default order of relevance and fast display
```
```
#5 Management listing List products and its description that will be sold in the
marketplace.
```
```
#6 Make order The make order scenario use case explains the flow of
product purchases by buyers to sellers through the preloved
application.
#7 Shipping new order This use case scenario makes the seller able to ship their
products and updates the information to the application.
This happens if they receive a notification for a new order
from the application.
```
```
#8 Transaction & payment Allows buyers to select a preferred payment method and
complete the transaction process for an order.
#9 Product detail Users can get complete information about a preloved item
before deciding to buy such us (Desc, Price, Available Size
and Color, etc.). And allow user to read some reviews about
that product.
```
```
#10 Chat The chat scenario explains the flow of communication
between buyers and sellers through the preloved app
#11 Notification Allows users to view the notification that they receive
```

```
DPPL-C2C Page 12 from 79
```


#### 3.1.1 Use Case #1 User login.....................................................................................................

##### 3.1.1.1 Use Case Scenario #1 User login............................................................................

Use Case Scenario #1 :
i. Pre-Condition:
The User has a valid, registered, and verified account.
ii. Use Case Description:
This use case describes how a registered user logs into the system securely using their
credentials.

```
No Primary Flow
1 The User navigates to the Login page.
2 The User inputs their registered email address and password.
3 The User clicks the "Login" button.
4 The user will be directed to the home page.
Alternative Flow: Invalid Password
1 The User enters the correct email but an incorrect password.
2 The user is notified that the password they input is incorrect.
3 The User clicks the “Forgot Password?” button.
4 The user clicks “send verification code via email”
5 The user will open the email to see the code
6 The User input the code
7 The user is directed to the create new password page
8 The user input the new password.
9 The user repeats the log in scenario with the new password.
```
```
iii. Post-Condition:
The user successfully logged in into the application
```
##### 3.1.1.2 UI Design and UI Object Description #1 User Login.............................................


```
DPPL-C2C Page 13 from 79
```


##### P011 - Login Page

##### P002 - Verify Email Page

UI Object Description Table
**ID.
PAGE**

###### PAGE NUMBER DESCRIPTION

```
P011 Login User Login Form
P012 Verify Email The page where users can verify their emails by
inputting 6 digits code.
```
_P011 Interface: Login Page_


```
DPPL-C2C Page 14 from 79
```


_Antarmuka P012: Verify Email PAge_


```
DPPL-C2C Page 15 from 79
```

```
Object_Id TYPE LABEL Information
```
```
Txt_Email Text Field Email The place where users can input their email.
```
```
Txt_Password Text Field Password The place where users can input their
password.
```
```
Btn_Login Button Login If clicked, will trigger Login Controller to do
auth process
```
```
Txt_Error Label/Text Invalid email or
password.
```
```
An error message will appear if the credential
is invalid.
```
```
Btn_Forgot_P
assword
```
```
Link Button Forgot Password? If clicked, the user will be redirect to forgot
password page
```
```
Lbl_Title Label Give Your Items a
Second Life.
```
```
Login page headline
```
```
Object_Id TYPE LABEL Inform
ation
```
```
Txt_Code_1 Text Field - First
input
column
(total 6)
```
```
Txt_Code_2 Text Field - Second input column (total 6)
```
```
Txt_Code_3 Text Field - Third input column (total 6)
```
```
Txt_Code_4 Text Field - Fourth input column (total 6)
```
```
Txt_Code_5 Text Field - Fifth input column (total 6)
```
```
Txt_Code_6 Text Field - Sixth input column (total 6)
```
```
Btn_Verify Button Verify If clicked, will trigger the system to verify the
code inputted.
```
```
Btn_Back Button Back If clicked, will redirect user to previous page
```
```
Lbl_Instructio
n
```
```
Label Input Verification Code Instruction to user input their verification code.
```

##### 3.1.1.3 Object Identification and Class Type #1 User Login..............................................

```
No Nama Object Object Type
```
```
1 Login Interface Boundary
```
```
2 Dashboard Interface Boundary
```
```
3 User/Account Entity
```
```
4 Login Controller Controller
```
```
5 Session Manager Controller
```
```
6 Verify Email Interface Boundary
```

```
DPPL-C2C Page 16 from 79
```


##### 3.1.1.4 Sequence Diagram #1 User Login..........................................................................

### 3.1.2 Use Case #2 Report Product....................................................................................................

#### 3.1.2.1 Use Case Scenario #2 Report Product...........................................................................

```
I. PreCondition: The User (Buyer/General User) is viewing the product details page.
II. Use Case Description: This use case describes how a user reports a product suspected of
violating platform rules to the Admin for review and potential removal.
No Primary Flow (Send Report Successfull)
1 The user hits the “Report product” button because of a rule violation.
2 The user gets a report pop-up, where the user must select a reason for the report (e.g.,
prohibited item, misleading description).
```

```
DPPL-C2C Page 17 from 79
```


```
3 The user selects the reason(s)
4 User clicks the "Send report" button.
Alternative Flow (Cancelation)
1 The user hits the “Report product” button because of a rule violation.
2 The user gets a report pop-up, where the user must select a reason for the report (e.g.,
prohibited item, misleading description).
3 The user selects the reason(s)
4 The user clicks “x” button to cancel the report.
```
```
III. Post condition: User will be directed back to the product detail page.
```
##### 3.1.2.2. UI Design and UI Object Description #2 Report Product......................................

```
Page: P021 (Modal Appear)
```
UI Object Description Table: Report Product

_Antarmuka P021: Page Product Detail_


```
DPPL-C2C Page 18 from 79
```

###### ID. PAGE PAGE NUMBER DESCRIPTION

```
P021 Product Detail (Report
Modal Appear)
```
```
The page displaying complete information about a selected
product listing. And now pop up appear
```
```
Object_Id TYPE LABEL Information
```
```
Img_Product Image Display Product Image Displays images of the selected product.
```

##### 3.1.2.3 Identification of Objects and Class Types #2 Report Product.................................

```
No Nama Object Object Type
```
```
1 Report Product Interface (Modal) Boundary
```

```
DPPL-C2C Page 19 from 79
```

```
Object_Id TYPE LABEL Information
```
```
Lbl_Name Label Product Name Displays the name of the product.
```
```
Lbl_Price Label Price Displays the selling price of the product.
```
```
Lbl_Descripti
on
```
```
Label Description Displays detailed information about the product.
```
```
Btn_Chat Button Chat Seller Allows the buyer to initiate a chat with the seller.
```
```
Btn_Back Button Back Navigates the user back to the previous page (e.g.,
Search Result, Homepage).
```
```
Btn_Follow Button + If clicked, the buyer will follow the seller account
```
```
Radio_Color Radio Color Choose Color To Checkout Or add to cart
```
```
Radio_Size Radio Size Choose Size To Checkout Or add to cart
```
```
Button_Find_
My_Size
```
```
Link Button Find My Size Redirect user to profile personalization ()
```
```
Capital_Repo
t
```
```
Capital -
```
```
Modal_Title Text Title Report This
Product?
```
```
Displays title of the report modal
```
```
Modal_Desc Text Desc Please fill the
form and our
admin gonna
check it asap
```
```
Displays description of the report modal
```
```
Txt_Why Text Input Why? Choose the main reason of user reported
```
```
Txt_Desc Text Input Description The user must describe of why they report its
product
```

```
No Nama Object Object Type
```
```
2 Product Listing Entity
```
```
3 Product Report Entity
```
```
4 Report Controller Controller
```
```
5 Admin Notification Controller Controller
```
##### 3.1.2.4 Sequence Diagram #2 Report Product....................................................................

#### 3.1.3 Use Case #3 Personal Profile Information........................................................................

##### 3.1.3.1 Use Case Scenario #3 Personal Profile Information...............................................

Use Case Scenario #3 :
i. Pre-Condition:
The user (Buyer/Seller) already registered to the system and logged in.
ii. Use Case Description: Both buyer and users can input and update their personal profile to ease
the process of buying and selling.

```
Primary Flow
```
1. User opens profile setting page and click on personal data


```
DPPL-C2C Page 20 from 79
```


2. User input name, date of birth, gender, nationality, email, phone number, username
    and main address
3. User upload profile photo
4. User see the notification that the photo upload is successful
5. User click on save button
6. User see notification that te update is successful

```
Alternative flow: Unsuccessful personal profile update (unsuccessful profile photo
upload and/or unsuccessful personal data update)
```
1. User opens profile setting page and click on personal data
2. User input name, date of birth, gender, nationality, email, phone number, username
    and main address
3. User upload photo
4. User see the notification that the photo upload is unsuccessful
5. User try to upload photo again
6. The user click on “save” button
7. User see notification that the update is unsuccessful

```
iii. Post-condition: User is redirected to the home page
```
##### 3.1.3.2. UI Design and UI Object Description #3 Personal Profile Information................


```
DPPL-C2C Page 21 from 79
```


_P031 - Profile Settings_

```
ID Page Page Name Description
```
```
P031 Profile Settings A page for both seller and buyer to update personal
profile and see/update other settings.
```
```
ID_Object Type Label Information
```

```
DPPL-C2C Page 22 from 79
```


P031-TAB-01 Tab Personal data Active tab, shows
personal info page

P031-TAB-02 Tab Address list to manage multiple
addresses

P031-TAB-03 Tab Personalized
Preference

```
To set preference, such
as clothing size
preference
```
P031-TAB-04 Tab Transaction History Shows past
orders/transactions

P031-PHO-01 Photo upload/holder - Editable profile picture

P031-HEA-01 Header Section Profile Details Title for personal data
fields

P031-INP-01 Input fields Name Editable string/text
field

P031-INP-02 Input fields gender Editable string/text
field

P031-INP-03 Input fields Nationality Editable string/text
field

P031-INP-04 Input fields Email Editable string/text
field

P031-INP-05 Input fields Phone number Editable string/text
field

P031-INP-06 Input fields Main address Editable string/text
field

P031-INP-07 Input field Date of Birth Editable date selector
field

P031-HEA-01 Header Section Account Security Title for security
options

P031-LNK-01 Button (link) Change password Opens password
change form

P031-LNK-02 Button (link) Two-Factor
Authentication

```
Opens 2FA settings
```
P031-BTN-01 Button Cancel Discard changes and
return to previous page

P031-BTN-02 Button Save Save profile changes


```
DPPL-C2C Page 23 from 79
```


```
P031-PHO-02 Photo holder - Profile picture is
displayed
```
```
P031-TXT-01 Text Users name User name is displayed
```
```
P031-ICO-01 Icon - Picture of the e-wallet
logo is displayed
```
```
P031-TXT-02 Text E-wallet name and
E-wallet price
```
```
The name of the
e-wallet and its
balance are displayed.
```
```
P001-LNK-03 Button (link) Top-up E-Wallet Directs to the e-wallet
application for top-up
```
```
P001-SID-01 Sidebar section Inbox Section for user
communication
```
```
P001-LNK-04 Button (link) Chat Directs to the chat
history page.
```
```
P001-LNK-05 Button (link) Review Navigates to the
review history page.
```
```
P001-SID-02 Sidebar section My Profile Section for user profile
and activities.
```
```
P001-LNK-06 Button (link) Wishlist Directs to the wishlist
page.
```
```
P001-LNK-07 Button (link) Favorite store Directs to the favorite
page.
```
```
P001-LNK-08 Button (link) Settings Navigates to the
settings for
application.
```
##### 3.1.3.3 IdentificationObjectand Class Type #3 Personal Profile Information.....................

```
No Object name Object type
```
1. Label name, date of birth, gender, nationality, email, phone
    number, main address

```
Boundary
```
2. Save button Boundary
3. Cancel button Boundary
4. Photo upload component Boundary


```
DPPL-C2C Page 24 from 79
```


5. Pop-up notification Boundary
6. Input field of name, date of birth, gender, nationality, email,
    phone number, main address

```
Entity
```
7. User photo Entity
8. Photo upload controller Controller
9. Profile validation Controller

##### 3.1.3.4 Sequence Diagram #3 Personal Profile Information...............................................


```
DPPL-C2C Page 25 from 79
```




```
DPPL-C2C Page 26 from 79
```



#### 3.1.4 Use Case #4 Searching.....................................................................................................

##### 3.1.4.1 Use Case Scenario #4 Searching.............................................................................

I. Pre-Condition:

- User ppen the preloved web
- User is not login yet / User has logged in
- They are in the searching page or clicked search bar on homepage


```
DPPL-C2C Page 27 from 79
```


```
Ii. Use Case Description: This use case makes the buyer search an active preloved product list
based on a keyword, and can narrow the result by using filters and sorting. The result must be
returned with the default order of relevance and fast display.
No Primary Flow
1 Buyer enter keyword on the search bar and click search button
2 Buyer choose filter (e.g. Brand, category/collection) or sorting criteria e.g. Price
3 Buyer choose one of listing items to see product’s detail
Alternative Flow: Buyer only use the search feature and not the filter feature
1 Buyer enter keyword on the search bar and click search button
2 Buyer choose one of listing items to see product’s detail
```
```
Iii. Post-condition:
Buyer is redirected to the product detail page and see detail information about that product.
```
##### 3.1.4.2 UI Design and UI Object Description #4 Searching...............................................

```
Page Search Result - Success State (P041)
```

```
DPPL-C2C Page 28 from 79
```


```
Page Search Result - Failed State (P041)
```
```
Page Product Detail (P081)
```


```
DPPL-C2C Page 29 from 79
```



_Antarmuka P041: Page Searching/Search Result_

_P081 Interface: Product Detail Page_


```
DPPL-C2C Page 30 from 79
```

###### ID. PAGE PAGE NUMBER DESCRIPTION

```
P041 Searching/Search Result The page where users input keywords and view the list of
products matching the search criteria, along with filtering
and sorting options.
```
```
P081 Product Detail The page displaying complete information about a selected
product listing.
```
```
Object_Id TYPE LABEL Information
```
```
Txt_Search Text Field Search Bar The place where users can input keywords for
product search.
```
```
Btn_Search Button Search Icon If clicked, triggers the search function based on
the keyword input.
```
```
Lbl_Result Label "{Keyword}(X)" Displays the number of products found.
```
```
List_Product Container/List Product Cards Displays the list of product listings matching
the criteria.
```
```
Btn_Filter Button Filter If clicked, opens a modal/drawer for filtering
options (e.g., Brand, Category, Condition).
```
```
Btn_Sort Button Sort If clicked, opens a dropdown/modal for sorting
options (e.g., Relevance, Price, Newest).
```
```
Txt_Zero_R
esult
```
```
Label/Text "0 Result / Match" Message displayed when no products are found
for the search query.
```
```
List_Recom
mendation
```
```
Container/List Recommended
Keywords/Products
```
```
Displays alternative suggestions when the
search yields no results.
```
```
Object_Id TYPE LABEL Information
```
```
Img_Product Image Display Product Image Displays images of the selected product.
```
```
Lbl_Name Label Product Name Displays the name of the product.
```

##### 3.1.4.3 Object Identification and Class Type #4 Searching................................................

```
No Nama Object Object Type
```
```
1 Search Interface Boundary
```
```
2 Product Detail Interface Boundary
```
```
3 Product Listing Entity
```
```
4 Search Controller Controller
```
```
5 Filter/Sort Controller Controller
```
```
6 Recommendation Engine (We use Elastic Search) Controller
```

```
DPPL-C2C Page 31 from 79
```

```
Object_Id TYPE LABEL Information
```
```
Lbl_Price Label Price Displays the selling price of the product.
```
```
Lbl_Descripti
on
```
```
Label Description Displays detailed information about the product.
```
```
Btn_Chat Button Chat Seller Allows the buyer to initiate a chat with the seller.
```
```
Btn_Back Button Back Navigates the user back to the previous page (e.g.,
Search Result, Homepage).
```
```
Btn_Follow Button + If clicked, the buyer will follow the seller account
```
```
Radio_Color Radio Color Choose Color To Checkout Or add to cart
```
```
Radio_Size Radio Size Choose Size To Checkout Or add to cart
```
```
Button_Find_
My_Size
```
```
Link Button Find My Size Redirect user to profile personalization ()
```

##### 3.1.4.4 Sequence Diagram #4 Searching.............................................................................

#### 3.1.5 Use case #5 Management Listing.....................................................................................

##### 3.1.5.1 Use Case Scenario #5 Management Listing...........................................................

Use Case Scenario #5 :
i Pre-Condition: The Seller is already registered and successfully logged into the system.
ii Use Case Description: This use case allows Sellers to create, edit, manage their product listings
on their profile in the marketplace, including product image and description.

```
No Primary Flow: seller save a product
```
1. The seller navigates to the seller’s dashboard and the seller clicks the "add new product"
    button
2. the seller is then directed to the new product listing form page
3. the seller input product’s details (name, description, category, price, stock)
4. the seller uploads product images
5. the seller clicks the "save listing" button

```
Alternative flow: seller delete a product
```
1. The Seller accesses the Management Listing Page and selects a product from the list


```
DPPL-C2C Page 32 from 79
```


2. The Seller clicks the "Delete" button on the selected product
3. The seller is shown a confirmation dialog
4. The Seller confirms the deletion

iii Post-condition: the seller see a notification "Product added successfully"

##### 3.1.5.2 UI Design and UI Object Description #5 Management Listing.............................

If we press the pencil logo we can modify our product


```
DPPL-C2C Page 33 from 79
```


If we press the trash bin logo, the system will confirm if we want to delete the product

We can also press the status filter. We can see which of our product that is active, inactive, sold out,
deleted


```
DPPL-C2C Page 34 from 79
```




```
DPPL-C2C Page 35 from 79
```



if we press “+ add new product”, it will ask for the product’s detail, and will listed in seller’s profile

And up there we got the interface for seller if they want to go back to the dashboard, manage their
settings, or logging out of the application

##### 3.1.5.3 IdentificationObjectand Class Type #5 Management Listing.................................

```
Object
ID
```
```
Type Label Description
```
```
B-002 Button Add
New
Product
```
```
The trigger button that takes the Seller
from P006 to P007 to create a new product
```

```
DPPL-C2C Page 36 from 79
```


I-003 Input
Field

Product Name Accepts the product name. Must be informative
and comply with guidelines
I-004 Input
Field

```
Product
Description
```
Accepts the full item description. Should include
the item's condition
I-005 Input
Field

Product Price Accepts the price (numeric). Includes validation
for reasonable pricing
I-006 Input
Field

Product Stock Accepts the number of units for sale. Stock must
be > 0 for the listing to be active
I-007 Input
Field

Product Images Area for uploading product images. Has file
size (under 5MB) and format (JPG or PNG)
restrictions
B-003 Button Save/Update
Listing

The button to save or update the listing data to
the database
M-002 Message Inline Alert an error message will appears directly
below the input field (e.g. "image size is too
large") if the validation fails
B-004 Button Delete(trash bin) The button available on P006 or P007 (in edit
mode) to permanently remove the product
from the system.


```
DPPL-C2C Page 37 from 79
```


##### 3.1.5.4 Sequence Diagram #5 Management Listing...........................................................


```
DPPL-C2C Page 38 from 79
```


#### 3.1.6 Use Case #6 Make Order..................................................................................................

##### 3.1.6.1 Use Case Scenario #6 Make Order........................................................................

Use Case Scenario #6 :
i. Pre-Condition: User must be logged in and the product available.
ii. Use Case Description: This process involves selecting products, adding products to the cart,
choosing shipping and payment methods, and then placing an order.

```
No Primary Flow
```
1. Buyer selects available products.
2. Buyer adds selected products to carts.
3. Buyer clicks the checkout button.
4. Buyer see the order summary on the screen.
5. Buyer enter address to calculate shipping
6. Buyer makes payment
    Alternative Flow: Buyer cancels checkout
1. Buyer selects available products.
2. Buyer adds selected products to carts.
3. Buyer clicks the checkout button.
4. Buyer see the order summary on the screen.
5. Buyer cancels checkout and returns to the product page.
    Alternative Flow: Buyer payment fails
1. Buyer selects available products.
2. Buyer adds selected products to carts.
3. Buyer clicks the checkout button.
4. Buyer see the order summary on the screen.
5. Buyer enter address to calculate shipping
6. Buyer makes payment
7. Buyer see the notification “payment fails”
8. Buyer retry the payment process

```
iii. Post condition: Order unsuccessful/successful notification sent to buyer.
```

```
DPPL-C2C Page 39 from 79
```


##### 3.1.6.2 UI Design and UI Object Description #6 Make Order............................................

_Make order_

```
ID page Name page Description
P602 Product detail Description product
P603 Cart Add product to cart
P604 Shipping Enter address and count shipping cost
P605 Payment Choose payment method
P606 Payment confirmation Confirm payment or cancel
```
_P602-Product detail_
**Id object Type Labels Description**
C_BAR01 Menu Home If clicked, will show homepage
C_BAR02 Menu Categories Show product category
C_BAR03 Menu Brand Show the available brand product
K_BAR01 Textbox Search To find the desired product.
K_BAR02 Menu Notification Notify customer about promotions, transaction,
and chat
K_BAR03 Menu Chat To communication or ask about product
K_BAR04 Menu Cart Save product before checkout
K_BAR05 Menu Profile User information


```
DPPL-C2C Page 40 from 79
```


```
AS001 Media
Asset
```
```
Product image Image from product
```
```
AS002 RTF Product title Product name
AS003 RTF Price Product price
AS004 RTF Product desc Product explanation
AS005 Option
button
```
```
Size One of the buttons must be clicked
```
```
AS006 button Add to cart If clicked, cart added
```
_P603-cart_
**Id object Type Labels Description**
ASC001 Media
asset

```
Product box Show selected product
```
```
ASC002 Textbox Coupon To get a discount
ASC003 Text box Total Shopping Total price
ASC004 Button Checkout button If clicked, will checkout
```
_P604-shipping_
**Id object Type Labels Description**
ASS001 Text ShippingDetail Information name and address
ASS002 Dropdown List ZipCode Choose one of them based on each region
ASS003 Button Save Contact Save all personal information
ASS004 Button Continue To Payment If clicked, will continue to payment

_P605-payment_
**Id object Type Labels Description**
ASP001 Button Shipment option Select one for shipping
ASP002 Button Payment method Choose one for payment method
ASP003 Button PayNow If clicked, go to payment confirmation page

_P606-payment confirmation_
**Id object Type Labels Description**
ASPC01 RTF Payment detail Payment detail from the product
ASPC02 Button Confirm Payment If clicked, payment confirmed
ASPC03 Button Cancel payment If clicked, payment cancel

##### 3.1.6.3 IdentificationObjectand Class Type #6 Make Order...............................................

```
No Object Name Object Type
1 UI Product detail Boundary
```

```
DPPL-C2C Page 41 from 79
```


```
2 UI cart Boundary
3 UI shipping Boundary
4 UI payment Boundary
5 Buyer Entity
6 Product Entity
7 Cart Entity
8 Order Entity
9 Payment Entity
10 Order controller Controller
11 Payment Controller Controller
12 Stock Controller Controller
13 Shipping controller Controller
```
##### 3.1.6.4 Sequence Diagram #6 Make Order.........................................................................


```
DPPL-C2C Page 42 from 79
```




```
DPPL-C2C Page 43 from 79
```



#### 3.1.7 Use Case #7 Shipping New Order....................................................................................

##### 3.1.7.1 Use Case Scenario #7 Shipping New Order............................................................

Use Case Scenario #7 :
i. Pre-Condition: The seller receives notification when a buyer has made an order and they click
on it.
ii. Use Case Description: Allows sellers to view the status of each product that has been bought
by a customer.

```
Primary Flow
```
1. The seller clicked on the notification alerts when a new customer has ordered
    their products.
2. The seller will be directed to the sales history.
3. The seller accepts the order.
4. The seller packed the product, and when finishes the seller click on “finish
    packing”

```
Alternative Flow 1: Seller decline the new order made by buyer
```
1. The seller clicked on the notification that alerts when a new customer has
    ordered their products.
2. The seller will be directed to the sales history.
3. The seller declined the order.
4. The seller will be directed to the chat page to tell the customer why they decline
    the order.
5. The seller will receive their money back

```
Alternative Flow 2: Order hasn’t arrived within delivery window time
```
1. The seller clicked on the notification alerts when a new customer has ordered
    their products.
2. The seller will be directed to the sales history.
3. The seller accepts the order.
4. The seller see that the order status has not changed to “Arrived” within delivery
    window time
5. The seller contacts the courier


```
DPPL-C2C Page 44 from 79
```


```
iii. Post-condition:
```
- The seller accepted the order, and the order arrived successfully.
- The seller cancels the order
- the order never arrived.

##### 3.1.7.2 UI Design and UI Object Description #7 Shipping New Order..............................

_P101 Homepage - Notification State_


```
DPPL-C2C Page 45 from 79
```


_P071 Transaction Notification Page (Sales History) - Pending_


```
DPPL-C2C Page 46 from 79
```


_P072 Transaction Notification Page (Sales History) - Order processed_


```
DPPL-C2C Page 47 from 79
```


_P073 Transaction Notification Page (Sales History) - On Shipping_


```
DPPL-C2C Page 48 from 79
```


_P074 Transaction Notification Page (Sales History) - Transaction History, Order Cancelled_

```
Page
ID
```
```
Page Name Description
```
```
P101 Homepage - Notification State The user's main page,
displaying an alert or badge
that signals a new customer
order.
```
```
P071 Transaction Notification Page (Sales History) - Pending A view within the sales history
detailing a new order that
requires the seller's action
(accept or decline).
```
```
P072 Transaction Notification Page (Sales History) - Order
processed
```
```
A view within the sales history
for an order that the seller has
```

```
DPPL-C2C Page 49 from 79
```


```
accepted (status is "In
Process").
```
```
P073 Transaction Notification Page (Sales History) - On
Shipping
```
```
A view within the sales history
for an order that has been
packed and is currently in the
shipping process.
```
```
P074 Transaction Notification Page (Sales History) -
Transaction History, Order Cancelled
```
```
A view within the sales history
for a transaction that the seller
has declined (status is
"Cancelled").
```
P101: Homepage - Notification State

```
Object ID (Inferred) Type Label Description
```
```
LBL-NOTIF Notification/Icon New Order Alert Visual cue on the
homepage that a new
order has been placed.
```
```
TBL-SALES List / Table Sales History List A list displaying past
and current transaction
details (to navigate to
the specific order
detail page).
```
P071: Transaction Notification Page (Sales History) - Pending

```
Object ID (Inferred) Type Label Description
```
```
TBL-SALES List/Table Sales History List A list/detail view
displaying the
transaction particulars.
```
```
LBL-WORD-STAT Label/Text Field Order Status Displays the current
status of the order:
Pending.
```
```
BTN-ACCEPT Button Accept Order Button for the seller to
confirm and accept the
new order.
```
```
BTN-DECLINE Button Decline Order Button for the seller to
decline the new order.
```

```
DPPL-C2C Page 50 from 79
```


P072: Transaction Notification Page (Sales History) - Order processed (Status: Packed)

```
Object ID (Inferred) Type Label Description
```
```
TBL-SALES List / Table Sales History List A list/detail view
displaying the
transaction particulars.
```
```
LBL-WORD-STAT Label / Text Field Order Status Displays the current
status of the order: In
Process
(Processed/Ready).
```
P073: Transaction Notification Page (Sales History) - On Shipping

```
Object ID (Inferred) Type Label Description
```
```
TBL-SALES List / Table Sales History List A list/detail view
displaying the
transaction particulars.
```
```
LBL-WORD-STAT Label / Text Field Order Status Displays the current
status of the order: On
Shipping (In Transit).
```
P074: Transaction Notification Page (Sales History) - Transaction History, Order Cancelled

```
Object ID (Inferred) Type Label Description
```
```
TBL-SALES List / Table Sales History List A list/detail view
displaying the
transaction particulars.
```
```
LBL-WORD-STAT Label / Text Field Order Status Displays the current
status of the order:
Cancelled.
```
```
LNK-CHAT Link / Button Go to Chat Directs the seller to the
chat page with the
buyer to provide
information regarding
the cancellation (if
needed).
```

```
DPPL-C2C Page 51 from 79
```


##### 3.1.7.3 IdentificationObjectand Class Type #7 Shipping New Order.................................

```
No Object ID/Name Type and Reason
```
1. LBL-NOTIF Boundary
2. TBL-SALES Boundary
3. LBL-WORD-STAT Boundary
4. BTN-ACCEPT Boundary
5. BTN-DECLINE Boundary
6. LNK-CHAT Boundary
7. Order/Transaction Entity
8. Seller Entity
9. Customer/Buyer Entity
10. Order Processing Controller Controller
11. Transaction Cancellation Controller Controller
12. Notification Controller Controller


```
DPPL-C2C Page 52 from 79
```


##### 3.1.7.4 Sequence Diagram #7 Shipping New Order...........................................................


```
DPPL-C2C Page 53 from 79
```


#### 3.1.8 Use Case #8 Transaction & Payment................................................................................

##### 3.1.8.1 Use Case Scenario #8 Transaction & Payment.......................................................

```
Preconditions:
```
- The buyer has made an order and pressed “check out”.

```
No Primary Flow: Successful product payment
1 The buyer clicked “check out” and directed to the payment page.
2 The buyer selects the payment method.
3 The buyer completes payment through a virtual account or e-wallet.
4 If successful, there will be a pop-up shown to the buyer that the transaction is successful.
5 The buyer will be directed to the purchase history page and the order status is updated to
“Paid”
Alternative Flow: unsuccessful product payment
1 The buyer clicked “check out” and directed to the payment page.
2 The buyer selects the payment method.
3 The buyer completes payment through a virtual account or e-wallet.
4 If unsuccessful, the buyer will see a pop-up order status that remains “Pending payment”.
```
Postcode:

- If payment is successful, then the buyer will see a pop-up order status updated to “Paid”
- If payment is unsuccessful, then the buyer will see a pop-up order status updated to “Expired
    Payment”


```
DPPL-C2C Page 54 from 79
```


##### 3.1.8.2 UI Design and UI Object Description #8 Transaction & Payment.........................

```
Page: P005 (Checkout Page)
```
UI Object Description Table: Transaction & Payment

```
ID PAGE PAGE NUMBER DESCRIPTION
```
```
P005 Payment/Checkout The page where the buyer confirms the order details, selects a
payment method, and initiates the transaction process.
```
_Antarmuka P005: Page Payment/Checkout_


```
DPPL-C2C Page 55 from 79
```

```
Object_Id TYPE LABEL Information
```
```
Lbl_Order_Sum
mary
```
```
Label/Containe
r
```
```
Order Summary Displays the list of items being purchased and
the total amount.
```
```
Radio_Payment
_Method
```
```
Radio Button
Group
```
```
Payment
Method
Selection
```
```
Allows the buyer to choose between Virtual
Account, E-Wallet, or other available
methods.
```
```
Btn_Pay Button Pay Now /
Complete
Payment
```
```
If clicked, initiates the connection to the
payment gateway to finalize the transaction.
```

##### 3.1.8.3 Identification of Objects and Class Types #8 Transaction & Payment...................

```
No Nama Object Object Type
```
```
1 Payment/Checkout Interface Boundary
```
```
2 Payment Success Interface Boundary
```
```
3 Purchase History Interface Boundary
```
```
4 Order Entity
```
```
5 Payment Gateway External System
```
```
6 Transaction Controller Controller
```
```
7 Order Status Manager Controller
```
##### 3.1.8.4 Sequence Diagram #8 Transaction & Payment.......................................................


```
DPPL-C2C Page 56 from 79
```

```
Object_Id TYPE LABEL Information
```
```
Lbl_Total_Amo
unt
```
```
Label Total Displays the final amount to be paid
(including shipping/fees).
```

#### 3.1.9 Use Case #9 Product Detail..............................................................................................

##### 3.1.9.1 Use Case Scenario #9 Product Detail......................................................................

```
I. Preconditions:
```
- Open the preloved web
- Buyer is not login yet / User logged in already is fine
- The buyer are in the homepage/searching page/store (seller) page
II. Use Case Description: Buyer can get complete information about a preloved item before
deciding to buy such us (Desc, Price, Available Size and Color, etc.). And allow users to read
some reviews about that product.
No Primary flow
1 Buyer click on a product card or image or title from the available list.
2 Buyer see product details: images, descriptions, prices, and condition of the item.
3 Buyer see Seller details (name, rating, locations).
4 Buyer decides to close the product details page
Alternative Flow 1: Items sold out
1 Buyer click on a product card or image or title from the available list.
2 Buyer see a “Sold Out” banner in the product picture
Alternative Flow 2: Wishlist
1 Buyer click on a product card or image or title from the available list.
2 Buyer see product details: images, descriptions, prices, and condition of the item.
3 Buyer see Seller details (name, rating, locations).
4 Buyer hit the "Add to Favorite" button
5 Buyer see a short pop-up: "Product added to your wishlist."
Alternative Flow 3: Report product
1 Buyer click on a product card or image or title from the available list.
2 Buyer see product details: images, descriptions, prices, and condition of the item.
3 Buyer see Seller details (name, rating, locations).
4 Buyer hit the “Report product” button because of rule violation

```
III. Post-condition:
```
- Buyer is redirected to the search page
- Buyer can click the pop-up and will be directed to wishlist page
- Buyer make a report on the product


```
DPPL-C2C Page 57 from 79
```


##### 3.1.9.2 UI Design and UI Object Description #9 Product Detail........................................

```
P004 - Product Detail Page
```
UI Object Description Table: Product Detail

_Antarmuka P004: Page Product Detail_


```
DPPL-C2C Page 58 from 79
```

###### ID. PAGE PAGE NUMBER DESCRIPTION

```
P004 Product Detail The page displaying complete information about a selected
product listing.
```

##### 3.1.9.3 Object Identification and Class Type #9 Product Detail.........................................

```
No Nama Object Object Type
```
```
1 Product Detail Interface Boundary
```
```
2 Product Listing Entity
```
```
3 Seller/Account Entity
```
```
4 Review Listing Entity
```
```
5 Product Detail Controller Controller
```
```
6 Wishlist/Favorite Controller Controller
```
```
7 Report Product Interface (Modal) Boundary
```
```
8 Report Controller Controller
```

```
DPPL-C2C Page 59 from 79
```

```
Object_Id TYPE LABEL Information
```
```
Img_Product Image Display Product Image Displays images of the selected product.
```
```
Lbl_Name Label Product Name Displays the name of the product.
```
```
Lbl_Price Label Price Displays the selling price of the product.
```
```
Lbl_Descripti
on
```
```
Label Description Displays detailed information about the product.
```
```
Btn_Chat Button Chat Seller Allows the buyer to initiate a chat with the seller.
```
```
Btn_Back Button Back Navigates the user back to the previous page (e.g.,
Search Result, Homepage).
```
```
Btn_Follow Button + If clicked, the buyer will follow the seller account
```
```
Radio_Color Radio Color Choose Color To Checkout Or add to cart
```
```
Radio_Size Radio Size Choose Size To Checkout Or add to cart
```
```
Button_Find_
My_Size
```
```
Link Button Find My Size Redirect user to profile personalization ()
```

##### 3.1.9.4 Sequence Diagram #9 Product Detail.....................................................................

#### 3.1.10 Use Case #10 Chat..........................................................................................................

##### 3.1.10.1 Use Case Scenario #10 Chat.................................................................................

```
I. Pre-condition:
```
- user has already logged in and
- User is in the home page or
- User is in the product detail page or
II. Description: This process used to communicate and ask about the product.

```
No Primary flow
```
1. Buyer clicks the chat feature
2. Buyer types a message and press send.
3. The seller receives messages sent by the buyer.
    Alternative flow: fail transmission
1. Buyer clicks the chat feature
2. Buyer types a message and press send.
3. Buyer will see "Failed to send" with retry option.


```
DPPL-C2C Page 60 from 79
```


```
III. Post condition:
```
- Buyer and seller is notified every time a new message arrived
- Buyer re-send the message

##### 3.1.10.2 UI Design and Object Description #10 Chat.........................................................

_Chat page_

```
Object ID Type Labels Description
OP90101 RTF Chat To communication and ask
about product
OP90102 Textbox Search chat To search who want to ask
```

```
DPPL-C2C Page 61 from 79
```


```
OP90103 Button Arrow back If clicked, back to home page
OP90201 TextBox Cat bar To communicate
OP90202 Textbox Input chat Write message
OP90203 Button Send button If clicked, message will send
OP90204 Button Attachment Click for send attachment
```
##### 3.1.10.3 Identification Object and Class Type #10 Chat.....................................................

```
No Object Name Object Type
1 UI chat Boundary
2 Chat Entity
3 Chat controller Controller
```

```
DPPL-C2C Page 62 from 79
```


##### 3.1.10.4 Sequence Diagram #10 Chat.................................................................................

_Chat-sequence diagram_

#### 3.1.11 Use Case #11 Notification..............................................................................................

##### 3.1.11.1 Use Case Scenario #11 Notification......................................................................

Use Case Scenario #2 :
i. Pre-Condition:
The seller receive notification on email
ii. Use Case Description


```
DPPL-C2C Page 63 from 79
```


```
Primary flow
```
1. The seller opens email from C2C
2. The email contains a button that will direct the seller to the transaction page
3. The seller will be directed to the transaction page

```
Alternative flow: seller ignore the notification
```
1. The seller opens email from C2C
2. The email contains a button that will direct seller the transaction page.
3. The seller ignores the notification

```
iii. Post-Condition
The user will be directed to the transaction page so that they can check further for the order
details.
```
##### 3.1.11.2 UI Design and Object Description UI #11 Notification........................................


```
DPPL-C2C Page 64 from 79
```


_P111 - Email Page_

_P112 - Transaction Page_

```
Page
ID
```
```
Page Name Description
```
```
P111 Email Page The Email Page (P101) is a notification sent by the
C2C system. This email contains a button that
functions to direct the user (seller) immediately to
the Transaction Page (P102) so they can check the
new order details further.
P112 Transaction Page A consolidated view of the user's transaction history,
categorized by status (new, ongoing, and finished).
This page enables users to access and review
complete details for all their orders, facilitating
actions such as checking new order information and
tracking shipment progress.
```

```
DPPL-C2C Page 65 from 79
```


_Email Page_

```
Object ID
(Inferrred)
```
```
Type Label Description
```
###### MAIL-BUTTO

###### N

```
Button View new
order
```
```
A button that functions to direct the user (seller) to
the Transaction Page (P102) to check the details of
the new order.
```
_Transaction Page_

```
Object ID (Inferred) Type Label Description
```
```
TBL-SALES List / Table Sales History List A list/detail view
displaying the
transaction particulars.
```
```
LBL-WORD-STAT Label Order Status Displays the current
status of the order:
Pending.
```
```
BTN-ACCEPT Button Accept Order Button for the seller to
confirm and accept the
new order.
```
```
BTN-DECLINE Button Decline Order Button for the seller to
decline the new order.
```

```
DPPL-C2C Page 66 from 79
```


##### 3.1.11.3 New Object Identification & Class Type #11 Notification...................................

```
No New Object Name Class Type
```
1. TBL-SALES Boundary
2. LBL-WORD-STAT Boundary
3. BTN-ACCEPT Boundary

4. (^) BTN-DECLINE Boundary
5. (^) MAIL-BUTTON Boundary
6. (^) Order/Transaction Entity

8. User Entity
10. Order Processing Controller Controller
12. Notification Controller Controller


```
DPPL-C2C Page 67 from 79
```


##### 3.1.11.4 Sequence Diagram #11 Notification......................................................................

_Notification - Sequence Diagram_

### 3.2 Class Diagram............................................................................................................................


```
DPPL-C2C Page 68 from 79
```


### 3.3 Detail Class Development..........................................................................................................

##### CLASS TABLE:

```
Class ID Planning Class Name Attribute (visibility) Method / Operation
```
```
M-01 User (Model) - int userID
```
- string username
- int password
- string email

```
+ register()
```
```
+ login()
```
```
+ verifyEmail()
```
```
+ resetPassword()
```
```
M-02 Buyer (Model) - int buyerID + searchProduct()
```
```
+ filterProduct()
```
```
+ viewTransactionHistory()
```
```
M-03 Seller (Model) - int sellerID + viewSalesHistory()
```
```
M-04 Admin (Model) - int adminID + reviewReport()
```
```
+ removeListing()
```
```
+ suspendListing()
```

```
DPPL-C2C Page 69 from 79
```


```
M-05 Searching (Model) - string keyword
```
- string category
- int minPrice
- int maxPrice
- string condition

```
+ searchProduct()
```
```
+ filterProduct()
```
```
M-06 Profile (Model) - string name
```
- string email
- string phoneNumber
- string address
- string photoURL

```
+ updateProfile()
```
```
M-07 Product (Model) - int productID
```
- int sellerID
- int stock
- string size
- string condition
- string productName

```
+ createListing()
```
```
+ editListing()
```
```
+ manageListingStatus()
```
```
+ updateStock()
```
```
+ deleteStock()
```


```
DPPL-C2C Page 70 from 79
```



- string color

```
M-08 Order (Model) - int orderID
```
- string orderStatus
- int trackingNumber
- date createdAt

```
+ createOrder()
```
```
+ confirmOrder()
```
```
+ cancelOrder()
```
```
+ trackOrder()
```
```
M-09 OrderDetail (Model) - int transactionID
```
- int orderID
- int productID
- string paymentMethod
- int amount
- string status

```
+ processPayment()
```
```
+ selectPaymentMethod()
```
```
+ calcPrice()
```
```
M-10 Review (Model) - int reviewID
```
- int rating
- string comment
- date date

```
+ writeReview()
```
```
+ readReview()
```
```
+ likeReview()
```
```
+ replyReview()
```
```
+ deleteReview()
```


```
DPPL-C2C Page 71 from 79
```



```
M-11 Report (Model) - int reportID
```
- string reason
- string description
- date date
- int productID

```
+ createAReport()
```
```
M-12 Message (Model) - int messageID
```
- string content
- time timestamp
- boolean isRead

```
+ sendMessage()
```
```
+ readMessage()
```
```
+ deleteMessage()
```
```
M-13 Notification (Model) - int notificationID
```
- string message
- string type
- boolean isRead

```
(None)
```
```
V-01 LoginView (View) (None) + displayLoginForm()
```
```
+ showLoginResult()
```


```
DPPL-C2C Page 72 from 79
```



```
V-02 ProfileView (View) (None) + displayProfile()
```
```
+ editProfileForm()
```
```
V-03 SearchingView (View) (None) + displaySearchForm()
```
```
+ displaySearchResult()
```
```
V-04 ProductListView (View) (None) + displayProductList()
```
```
+ displayProductDetail()
```
```
V-05 ProductDetailView (None) + displayProductDetail()
```
```
V-06 OrderView (View) (None) + displayOrder()
```
```
V-07 ReviewView (View) (None) + displayReview()
```
```
V-08 ReportView (View) (None) + displayReport()
```
```
V-09 ChatView (View) (None) + displayChat()
```
```
V-10 NotificationView (View) (None) + displayNotification()
```
```
V-11 AdminDashboardView
(View)
```
```
(None) + displahAdminDashboard()
```


```
DPPL-C2C Page 73 from 79
```



```
V-12 SellerDashboardView
(View)
```
```
(None) + displaySellerDashboard()
```
```
V-13 BuyerDashboardView
(View)
```
```
(None) + displayBuyerDashboard()
```
```
C-01 AuthController
(Controller)
```
- User model
- LoginView view

```
+ login()
```
```
+ register()
```
```
+ logout()
```
```
C-02 ProfileController
(Controller)
```
- Profile model
- ProfileView view

```
+ viewProfile()
```
```
+ updateProfile()
```
```
C-03 SearchingController
(Controller)
```
- Searching model
- SearchingView view

```
+ handleSearch()
```
```
+ handleFilter()
```
```
C-04 ProductController
(Controller)
```
- Product model
- ProductListView
viewPrimary
- ProductDetailView
viewSupporting

```
+ listProducts()
```
```
+ addProduct()
```
```
+ editProduct()
```
```
+ removeProduct()
```


```
DPPL-C2C Page 74 from 79
```



```
C-05 OrderController
(Controller)
```
- Order modelPrimary
- OrderDetail
modelSupporting
- OrderView view

```
+ handleOrder()
```
```
+ cancelOrder()
```
```
C-06 ReviewController
(Controller)
```
- Review model
- ReviewView view

```
+ addReview()
```
```
C-07 ReportController
(Controller)
```
- Report model
- ReportView view

```
+ submitReport()
```
```
+ viewReports()
```
```
C-08 MessageController
(Controller)
```
- Message model
- ChatView view

```
+ sendMessage()
```
```
C-09 NotificationController
(Controller)
```
- Notification model
- NotificationView view

```
+ showNotifications()
```
```
C-10 AdminController
(Controller)
```
- Admin model
- AdminDashboardView
view

```
+ suspendUser()
```


```
DPPL-C2C Page 75 from 79
```



```
C-11 BuyerController
(Controller)
```
- Buyer model
- BuyerDashboardView
view

```
+ suspendUser()
```
```
C-12 SellerController
(Controller)
```
- Seller model
- SellerDashboardView
view

```
+ suspendUser()
```
### 3.3.2 Algorithm................................................................................................................................

In this topic, we provide an example of algorithm that we will use for our application, C2C.

**Algorithm#1**
_Class name : Product
Operation name : createListing()
Algorithm :_
BEGIN
// --- Pre-Condition ---
// Seller is logged in
// Seller is on Seller Dashboard

```
Seller navigates to Seller Dashboard
Seller clicks "Add New Product"
```
```
DISPLAY "New Product Listing Form"
```
```
// --- Input Product Details ---
INPUT productName
INPUT productDescription
INPUT category
INPUT price
INPUT stock
UPLOAD productImages
```
```
IF Seller clicks "Save Listing" THEN
```
```
// --- System Validation ---
VALIDATE product data
```
```
IF product data is valid THEN
CREATE new product listing
SET listing status TO "Active"
SAVE listing to database
```

```
DPPL-C2C Page 76 from 79
```


```
DISPLAY "Product listing created successfully"
ELSE
DISPLAY "Error: Invalid product data"
RETURN to "New Product Listing Form"
ENDIF
```
```
ELSE
DISPLAY "Create listing cancelled"
ENDIF
END
```
**Algorithm#2**
_Class name : Product
Nama Operasi : ManageListingStatus(newStatus)
Algorithm :_
BEGIN
// --- Pre-Condition ---
// Seller is logged in
// Seller is on the Manage Listing page

```
DISPLAY "Manage Listing Page"
Seller selects a product from the list
```
```
DISPLAY "Current Listing Status"
DISPLAY "Select New Status"
INPUT newStatus
```
```
IF Seller clicks "Update Status" THEN
```
```
// --- System Validation ---
IF newStatus is valid THEN
UPDATE product.status TO newStatus
SAVE product listing
```
```
DISPLAY "Listing status updated successfully"
ELSE
DISPLAY "Invalid status selected"
RETURN to "Select New Status"
ENDIF
```
```
ELSE
DISPLAY "Status update cancelled"
ENDIF
END
```
**Algorithm#3**
_Class name : Searching
Operation name : SearchProduct()
Algorithm :_
BEGIN
// --- Pre-Condition ---
// User is on the Search Page or Homepage
// User status (Logged in/Guest) does not affect flow


```
DPPL-C2C Page 77 from 79
```


```
// --- Step 1: Input Keyword ---
DISPLAY "Enter search keyword"
INPUT keyword
```
```
IF "Search" button is CLICKED THEN
```
```
Step 2: System Processing (Main Flow) ---
// Query database for items where Status is 'Active'
searchResult = SEARCH_DATABASE(keyword, status="Active")
```
```
// --- Alternative Flow: Check for 0 Results (Step 2) ---
IF searchResult IS EMPTY THEN
DISPLAY "0 Result / Match"
DISPLAY "Keyword Recommendations"
DISPLAY "Related Products" (Correlated to keyword)
```
```
// Flow can go back to Step 1 (Input)
RETURN to "Input Keyword"
```
```
ELSE
// --- Step 2 (Continued): Default Display ---
SORT searchResult BY "Relevance"
DISPLAY searchResult
```
```
// User stays on the page to interact (Filter, Sort, or Select)
uiState = "ViewingResults"
```
```
WHILE uiState == "ViewingResults" DO
```
```
// --- Step 3: User Interaction ---
IF User selects Filter (Brand/Category) OR Sort (Price) THEN
GET filterOption AND/OR sortOption
```
```
// --- Step 4: System Update ---
APPLY filterOption TO searchResult
APPLY sortOption TO searchResult
```
```
// --- Alternative Flow: Check if Filter results in 0 items (Step 4) ---
IF searchResult IS EMPTY THEN
DISPLAY "0 Result / Match"
DISPLAY "Related Products"
// Flow allows user to reset filter (Back to Step 3)
ELSE
DISPLAY updated searchResult
END IF
```
```
ELSE IF User selects an Item (Step 5) THEN
selectedItem = GET_CLICKED_ITEM()
```
```
// --- Step 6: Redirect to Detail ---
REDIRECT to ProductDetailPage(selectedItem)
DISPLAY "Product Detail Information"
uiState = "Finished" // End the search flow
```
```
END IF
```


```
DPPL-C2C Page 78 from 79
```



```
END WHILE
```
```
END IF
```
```
END IF
```
```
END
```
## 4 Requirement Traceability Matrix.........................................................................................................

_Mapping requirements with realized Use Cases_

```
Code FR
Functional Requirement Name Use Case Name
```
```
FR-001 Authentication User login
FR-002 Security Report product
FR-003 Personal Profile Information Personal profile
FR-004 Searching Searching
FR-005 Management Listing Management listing
FR-006 Order Management Make order, shipping new order
FR-007 Transaction & payment Transaction & payment
FR-008 Product details Product details
FR-009 Chat Chat
FR-010 Notification for seller Notification
FR-011 Notification for buyer Notification
FR-012 Transaction History Shipping new order
```

```
DPPL-C2C Page 79 from 79
```