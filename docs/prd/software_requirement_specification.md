```
SOFTWARE REQUIREMENTS SPECIFICATION
C2C (Consumer-To-Consumer)
```
#### to:

#### Second-hand Items Seller

## 3. List of Contents

- 1. Daftar Perubahan
- 2. Daftar Halaman Perubahan
- 3. List of Contents
- 1. Introduction
   - 1.1 Purpose of Writing Documents
   - 1.2 Scope of Document
   - 1.3 Definition, Abbreviations and Acronyms
   - 1.4 Reference
- 2. Global Software Description
   - 2.1 Software Objective Statement
   - 2.2 Software Perspective and Goal
   - 2.3 User Profile and Class
   - 2.4 Operating Environment
   - 2.5 Software / System Limitations
   - 2.6 Assumptions and Dependence
- 3. Software Detail Description
   - 3.1 Requirement Description
      - 3.1.1 Functional Requirement
      - 3.1.2 Nonfunctional Requirement
   - 3.2 Analysis Modeling
      - 3.2.1 Usecase Diagram
         - 3.2.1.1 Usecase Scenario #1 “REGISTER BARANG”
         - 2. Menampilkan pengelolaan barang
         - 3.2.1.2 Usecase Scenario #2 <nama usecase>
      - 3.2.2 Class Diagram:
- 4. Other Requirements
   - 4.1 User Interface
      - 4.1.1 Consistency and Design (General)
      - 4.1.2 Buyer UI
      - 4.1.3 Seller UI
      - 4.1.4 Additional UI
   - 4.2 Hardware Interface
      - 4.2.1 Client Interface
   - 4.3 Software Interface
   - 4.4 Communication Interface
   - 4.5 Smart System Features


## 1. Introduction

### 1.1 Purpose of Writing Documents

This document we made is to specify the software we need for the C2C (Customer-to-Customer)
Marketplace(a web based platform that is designed for user to buying and selling second hand items).
The main purpose of this document is for defining the system’s functionalities, constraints, and the
requirements for guiding software development in a way that is structured
this document we made also serve as a reference for all development team members, including the
project manager, system analyst, backend developer, frontend developer, UI/UX designer, tester, and
documentation specialist. To ensure that our system is built to be secure, user friendly, and capable of
supporting safe and comfortable online platform for second hand transactions

### 1.2 Scope of Document

This document covering all of the requirement for the C2C Marketplace platform. Including the core
functionalities, such as registration and authentication of user, product management for sellers,
product searching and filtering for users, transparent order and checkout processes, payment
integration, shipping tracking, review and rating for ordered item system, and reporting features
Our system focuses on two main users type: Buyer and Seller, with an additional Admin role thats
responsible for report handling, and transaction security on our platform.
Our platform is designed for supporting safe and transparent transactions through a mediation system,
so we can reduce the risk of fraud and providing an efficient and user-friendly second-hand shopping
experience

### 1.3 Definition, Abbreviations and Acronyms

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

### 1.4 Reference

```
SOK_C2C Report , Software Analysis and Design — Telkom University (2025)
Reference Website: preloved.co.id — used as design and feature inspiration for the C2C platform
Google Forms – Buyer and Seller Questionnaire Results (2025)
Seller Interview Documentation – Pasar Cimol Gedebage, Bandung
API References:
● RajaOngkir API – for shipping cost estimation
● Xendit/Midtrans Payment Gateway – for secure online payments
```
## 2. Global Software Description

### 2.1 Software Objective Statement

This software is intended to provide a safe, accessible, and user-friendly online marketplace for
buying and selling second-hand items. The main purpose of the platform is as a mediator of
transactions between buyers and sellers to reduce fraud, increase trust, and support sustainable
consumption practices.


Unlike informal buying and selling activities that occur through social media, where transactions are
often risky and lack accountability, the system acts as a secure intermediary to ensure that product
delivery, payment processes, and user interactions occur safely and transparently.
The product is **a new web-based system** that mitigates gaps and limitations from existing
second-hand marketplace. The C2C is aimed to improve the quality of existing marketplace by:
● Recommending alternative for customers who want high-quality second-hand goods at
affordable prices.
● Recommending items that suit their preference.
● Offer protection and support when disputes or product mismatches occur.
● Offer customer service when there is troubleshooting in a transaction.
● Encourage sustainable lifestyle choices through reuse and recycling.
The existence of administrators for this platform manage the database system as well as maintain a
safe buying process, ensuring that the platform is trusted with administrator as the mediator.

### 2.2 Software Perspective and Goal

This software is aimed to support the enhancement of customer experience in online second-hand
items shopping, including listing, searching by filter, ordering, interactions with sellers, payments,
delivery updates, and review interactions.
The primary goals of the software are:
**Goal Functional Requirement Explanation**
Offering maximal protection
and support.
Security (FR-002) When a problem with an order,
transaction or delivery process occurs,
the system must give satisfactory
customer service to ensure trust.
Ensure safe and secure
transactions.
Authentication (FR-001),
Transaction & Payment
(FR-007)
Users must be verified, protected from
scams, and payments must be handled
securely.
Ease the process of buying and
selling items
Searching (FR-004),
Management listing (FR-005),
Order management (FR-006),
Product details (FR-008)
Users must be able to search and
manage products efficiently and
effectively through the system
interface.
Offering transparency and
convenience.
Order management (FR-006),
Transaction & Payment
(FR-007), Transaction History
(FR-012)
Provide clear information, transaction
records, and timely order status
updates.
Enhance buyer experience Personal Profile Information
(FR-003), Chat (FR-009),
Direct communication helpful guidance
with the seller to increase trust and


```
Notification for Buyer
(FR-011)
satisfaction.
Enhance seller experience Chat (FR-009), Notification for
Seller (FR-010)
Immediate notification when a buyer
orders a certain product, or requests a
message to increase seller satisfaction.
```
### 2.3 User Profile and Class

The system identifies several types of users, each with different characteristics, roles and specific
requirements:
**User Class Profile and Characteristics Role in System Specific Requirements
Buyer** Individuals who look for
affordable second-hand
goods. No specific technical
experience required.
Search products, make
orders, make payments,
and review products.
Needs clear product
information, secure and
safe payment flow. The
user must also be able to
report issues, review
products and chat with
sellers.
**Seller** Individuals who have unused
items to sell. Frequent users
who manage listings often.
Upload and edit product
listings, set prices,
manage sales, manage
orders, and update
shipping status.
Needs an efficient
dashboard in transaction
history, real-time
notifications and income
tracking.
**Admin** System operator responsible
for platform security and
customer service satisfaction.
Higher technical and decision
authority.
Review reports, remove
violating listings, suspend
fraudulent accounts,
handle transaction and
shipping problems.
Needs direct access to
monitoring tools,
products management
system and user
management functions.
**New Buyer
(Not Logged
In)**
Visitors browsing available
items without account access.
Can view product listings
but cannot purchase or
chat.
Needs to be encouraged
to sign up with easy
registration flow.
**System** Performs automated tasks
such as updating order status,
sending notifications, and
returning payments.
Background mediator for
transactions and
communication.
Must maintain
reliability, data accuracy,
and real-time updates for
notification or products
bought.


### 2.4 Operating Environment

### 2.5 Software / System Limitations

The limitations that restrict the functions and scope of the C2C Marketplace system development,
include technical aspects, policies, and external provisions that must be complied with by the
development team so that the system can operate in accordance with the established security and
compatibility standards.

1. Interface for Other Applications
    The C2C Marketplace system interacts with several external services that limit design and
    implementation flexibility:
       - The payment system is integrated with Payment Gateway, midtrans, or xendit using a
          JSON-based REST API. The request and response formats must follow the API
          documentation standards of the service provider.
       - The shipping cost calculation system uses a courier service API. Developers must use
          the provided endpoint and cannot manually modify the shipping cost calculation
          logic.
       - All communication between systems is conducted via the HTTPS protocol to ensure
          transaction data security.
2. Database Used


- The system uses MySQL 8.0 as its primary database.
- The maximum number of simultaneous connections to the database is limited to 200
    active connections to ensure stability and prevent overload.
- Developers are not permitted to change the database type without the approval of the
    system architecture team.
- Database backups must be performed automatically every 24 hours.
3. Parallel Operations
- The system must be able to handle at least 100 simultaneous transactions without
significantly reducing server performance.
- Due to server resource limitations, developers need to optimize parallel processes to
avoid bottlenecks.
- Thread and session management must consider thread safety to prevent race
conditions during simultaneous data access.
4. Communication Access
- Communication between clients and servers can only be done via HTTPS (SSL/TLS).
- Developers are not allowed to use unencrypted protocols such as HTTP, FTP, or
Telnet in a production environment.
- All external API requests must have a maximum timeout policy of 10 seconds to
prevent transaction process hanging.
5. Security Considerations
- All sensitive data such as passwords, tokens, and account numbers must be encrypted
using bcrypt or an equivalent hash algorithm.
- Cross-Site Request Forgery (CSRF) and Cross-Site Scripting (XSS) protection must
be enabled in the Laravel framework.
- User authentication tokens have a maximum validity period of 60 minutes and are
automatically renewed via refresh tokens.
- Developers are not permitted to disable the framework's default security features.
- Admin access to the system panel is restricted with multi-factor authentication
(MFA).
6. Design Conventions and Programming Standards
- All PHP backend code must follow PSR-12 Coding Standards.
- Variable, function, and comment naming must use English and follow the camelCase
or PascalCase format according to convention.
- User interface design must follow the UI/UX Design Guide created by the design
team, including consistency in colors, icons, and layout.
- Each module must be accompanied by internal documentation in the form of code
comments and README.md to facilitate future maintenance by the maintenance
team.
- All code files must be stored and managed through the project's official repository.
7. Device and Operating Environment Restrictions
- The application can only be run on modern browsers such as Google Chrome,
Mozilla Firefox, and the latest version of Microsoft Edge.
- The application server runs on Ubuntu 22.04 LTS with PHP 8.2 and Nginx Web
Server.
- The system does not yet support offline mode because all of its functions require an
active internet connection.
- The system has not been developed for native mobile platforms (Android/iOS), but it
can be accessed via a mobile browser.


### 2.6 Assumptions and Dependence

The function of the system will not work if there are assumptions and dependence requirements which
have not been fulfilled. The development and operational of the system is based on the given
assumptions and dependence:
**a) Assumptions**

1. Users have access to a stable internet connection.
    Since the platform can only be accessed using the internet connection, users are expected to
    have a stable internet connection. If they don’t have a stable internet connection, then the user
    flow will not be optimal.
2. Users are able to operate website based platforms through browsers.
    Assuming all users have basic knowledge of using the internet and the web browser, the user
    experience, such as inputting personal information, will be optimal.
3. The customer will read the product's details first before doing the transaction.
    Assuming that buyers understand the limitations and deficiency of the products before
    deciding to buy.
4. The seller will provide honest information regarding the items.
    Assuming the seller inputs honest information in the product's detail, the buyer will also be
    satisfied with the products and systems.
5. Transactions only made through the available payment methods.
    The system will be dependent on the payment methods available in the country.
6. Users are willing to comply with the platform’s rules and policies.
    Assuming that the users will agree to follow every rule and condition in the system, other
    users will be satisfied with the system.
**b) Dependence**
1. Integration to the payment gateway
The system will be dependent on either E-Wallet or Bank Virtual Account payment gateway
for payment and revenue.
2. Server
The existence of a stable hosting server, will maintain the data integrity, privacy as well as
allowing users to make an order concurrently.
3. Email verification
The system is dependent on users email as the transaction and shipping process will be
integrated to email.
4. Integration to the courier API
To update the delivery status, the system relies on courier API. Therefore, the availability of
courier API determines the accuracy of the shipping status.
5. Browser and device
The system is expected to run on a modern browser that supports the latest web technologies.

## 3. Software Detail Description


### 3.1 Requirement Description

#### 3.1.1 Functional Requirement

```
Code Name and Description Type
FR-001 Authentication
The system shall allow users to register, verify email, and
log in securely using valid credentials. The system shall
allow users to reset forgotten passwords via email
verification.
Must have
FR-002 Security
The system shall allow buyers to report products. The
system shall allow admins to review reports and suspend or
remove violating listings.
Must have
FR-003 Personal Profile Information
The system shall allow users to update their personal profile
information (name, email, photo, phone, address).
Must have
FR-004 Searching
The system shall allow users to search, filter, and sort
product listings.
Must have
FR-005 Management Listing
The system shall allow sellers to create, edit, and manage
product listings with images and descriptions. The system
Must have
```

shall validate uploaded product images and reject
unsupported formats or oversized files. The system shall
allow sellers to manage listing status (active, inactive,
deleted).
FR-006 Order Management
The system shall allow sellers to update order status, input
shipment tracking number, and mark as shipped. The system
shall allow buyers to create and confirm orders through a
checkout process. The system shall allow buyers to track,
confirm, or cancel their orders before shipment.
Must have
FR-007 Transaction & Payment
The system shall support multiple payment methods and
automatically update order status upon successful payment.
Must have
FR-008 Product details
The system shall display detailed product information,
including name, price, stock, and seller details. The system
shall allow buyers to rate and review products or sellers
after purchase.
Must have
FR-009 Chat
The system shall allow buyers and sellers to communicate
through real-time chat.
FR-010 Notification for Seller
The system shall send notifications every time a new buyer
makes an order.
Must have
FR-011 Notification for buyer Satisfier


```
The system shall send notifications for new messages, order
updates, and status changes.
FR-012 Transaction History
The system shall display user transaction history (buyer
purchase history and seller sales history).
Satisfier
FR-013 Size Recommendations
The system shall give users clothing size recommendations
based on user input of their clothing preference.
Delighter
```
#### 3.1.2 Nonfunctional Requirement

```
Quality Criteria Requirement
Code
Description
Performance NFR-PER-01 The system response time for displaying product
search results (FR-004), including filtering and
sorting, must not exceed 2 seconds ..
Performance NFR-PER-02 The product image validation and upload process
(FR-005) must be completed within 5 seconds per
image (assuming < 5MB).
Performance NFR-PER-03 The product details page (FR-008), including
loading images and reviews, must load completely
within 3 seconds.
Performance NFR-PER-04 The real-time chat (FR-009) message sending and
receiving latency must not exceed 1 second under
stable network conditions.
```

**Security** NFR-SEC-01 All **user passwords** (FR-001) must be stored in the
database using a strong hashing algorithm (e.g.,
bcrypt) with a unique salt.
**Security** NFR-SEC-02 All user sessions, especially during **login** (FR-001)
and **payment** (FR-007), must be secured using an
encrypted HTTPS (SSL/TLS) connection.
**Security** NFR-SEC-03 The system **must not store** sensitive credit
card/payment data (FR-007). The process must be
handled by a third-party, PCI-DSS certified
payment gateway.
**Usability** NFR-USA-01 Users must be able to successfully **update their
profile** (FR-003) within a maximum of **3 steps
(clicks)** from the main profile page.
**Usability** NFR-USA-02 The **_checkout_** **flow** (FR-006) must be completable
by a new user in less than **90 seconds** (from cart to
confirmation).
**Reliability** NFR-REL-01 The delivery success rate for **notifications**
(FR-010, FR-011) must reach **99.9%**. Critical
notifications (new order) must be received in < 30
seconds.
**Availability** NFR-AVL-01 The overall system must have **99.5% uptime** per
month, excluding announced scheduled
maintenance windows.

### 3.2 Analysis Modeling

#### 3.2.1 Usecase Diagram


##### 3.2.1.1 Usecase Scenario #1 “REGISTER BARANG”

```
Nama Use Case Register Barang
Deskripsi Fungsi ini digunakan oleh user untuk menginputkan
data barang baru ke sistem
Pre-Kondisi User telah memiliki akun dan sudah melakukan login
Post-Kondisi Data Barang baru telah tersimpan di basisdata Barang
Skenario Utama
Aktor Sistem
Membuka Menu
Barang
```

##### 2. Menampilkan pengelolaan barang

```
Pilih menu input
barang
```
4. Menampilkan
    form data
    barang
Menginputkan data
barang
6. Sistem
    menyimpan
    data barang ke
    basis data
    Barang
Skenario Eksepsional
(Alternative flow)
Aktor Sistem
...
2. ...

##### 3.2.1.2 Usecase Scenario #2 <nama usecase>

Nama Usecase ...
Deskripsi ...
Pre-Kondisi ...
Post-Kondisi ...
Skenario Utama


```
Aktor Sistem
2.
4.
6.
Skenario Eksepsional
(Alternative flow)
Aktor Sistem
2.
```
#### 3.2.2 Class Diagram:

<Gambarkan kelas diagram model domain untuk sistem yang akan dikembangkan. Tuliskan lengkap
keterhubungan antar class dengan atribut minimal dan multiplicitynya >

## 4. Other Requirements


### 4.1 User Interface

The system must provide an intuitive, responsive interface that fosters user confidence in
secondhand goods transactions. The design should focus on consistency, clarity of product
information (including item condition), and a checkout process that minimizes friction.

#### 4.1.1 Consistency and Design (General)

```
Code UI Requirement Descriptions
UI-001 Responsiveness The interface must function optimally and maintain a
suitable layout on desktop (resolution >1024px), tab
devices (between 768 and 1024 resolutions) and mobile
devices (resolution <768px).
UI-002 Brand Design (Color
and Font)
The system should use a consistent color palette
(Primary color: Black; Secondary color and
Background Color: White), easy-to-read font across
platforms (Poppins and Sohne).
UI-003 Element Consistency All interactive elements (buttons, links, input fields)
must have a uniform appearance and behavior (All the
primary buttons must be colored with primary color and
all secondary buttons must have the same color as the
background and a border with a thickness of 2 px)
```
#### 4.1.2 Buyer UI

```
ID UI Requirement Description
```

**UI-B01 Fast Search and
Advanced Filter**
The main page feature a clear search bar. The search
results page should have advanced filters (Sidebar
Filters) for: Category, Price Range, Location, Item
Condition (New/Used Like New/Good Condition),
Brand, Product Type, Sort, Promotion and Size.
**UI-B02 Detail Product UI** The product detail page should clearly display these
main elements at the top: High Resolution Photo,
Seller Information (Name and Rating), Item Condition
(like a label), Price, Buy Now and Chat Seller Button.
**UI-B03 Checkout flow in 3
steps**
The checkout process should be simplified to a
maximum of 3 steps after the cart: 1. Confirm Address
& Courier, 2. Select Payment (Redirect To
Xendit/Midtrans Payment Gateway), 3. Confirm
Order.
**UI-B04 Homepage** The system displays product recommendations
according to user interests, displays newly added
products, discounted products, several category cards,
several brand cards, featured products, best-selling
products, and unlimited product scrolling. With a clean
search bar and shopping cart button positioned at the
top (sticky position)
**UI-B05 Cart Page** Display a checkout-ready item (where it should
display the item image, price, quantity, and store
information) at the top. Just below it, the UI also
provides two lists of recommendations for the user:
"Your likes" (previously liked items) and "Recently
viewed" (browsing history) for easy navigation back.
**UI-B06 Profile Page** Display all navigation in easily accessible visual cards
in the center of the screen. These cards should lead to:
Order History, Address List, My Reviews, Account
Information, and Wishlist.


#### 4.1.3 Seller UI

```
ID UI Requirement Description
UI-S01 Listing Form The form for listing should be kept as minimal as
possible, simple, clear, and should provide detailed
information (such as subscripts to explain the
information in an input field).
UI-S02 Seller Dashboard Sellers should have a Dashboard that displays the
main Key Performance Indicators (KPIs): Number of
New Orders, Total Revenue for each section (Month,
Week, Year, YTD), and Items That have to be
Shipped.
UI-S03 Order Management
Page
There should be a filterable table based on order
status: Awaiting Payment, Ready to Ship, In Shipping,
Completed, Canceled.
UI-S04 Store Public
Appearance and
Ratings
Seller profiles must have a public view accessible to
buyers. This view must include: Store Name, Store
Rating Badge (e.g., 4.8/5.0), Average Chat Response
Time, and a Product Catalog that buyers can filter by.
UI-S05 Financial, Analytics
and Statistics
Dashboard
Viewable only to sellers, this dashboard should
provide a visual summary analytics (chart, etc.) in the
form of a monthly, weekly or yearly sales trend graph
and details of the Withdrawal Balance. This ensures
sellers have centralized business information.
UI-S06 Store Shipping
Management Page
Sellers must have a dedicated form to set the shipping
options available for their store (e.g., enable/disable
```

```
JNE, J&T, or Cash on Delivery options) and set the
default pickup address.
```
#### 4.1.4 Additional UI

```
ID UI Requirement Description
UI-A01 Toast Notification All important actions (Like "Product added
successfully", "Password changed") should display a
short confirmation message (toast notification) in the
corner of the screen.
UI-A02 Inline Alert (Input
Validation Alert)
Form input errors (validation errors) should be
displayed directly below the problematic field (inline
error).
```
### 4.2 Hardware Interface

#### 4.2.1 Client Interface

```
ID Interface
Requirements
Description
HI-C01 Browser
Compatibility
The system must be accessible and fully functional on
popular browsers (Chrome, Firefox, Safari, Edge) on
desktop, tab and mobile devices.
```

```
HI-C02 Device
Specification
for Client
The system must be able to operate smoothly on mobile
devices (iOS/Android) with a minimum specification of
2GB RAM and a stable internet connection (use telkomsel
for better internet connection).
```
#### 4.2.2 Server Requirement

For server requirements, we'll be using Amazon Web Services, a platform that offers a variety of
cloud server services, such as hosting. Due to the volatile nature of user demand, AWS is the right
answer.
**Problems AWS Solutions Descriptions
Erratic
users
Auto Scaling Group
(ASG) + Elastic Load
Balancer (ELB)
ASG** will automatically add servers (EC2 Instances)
when traffic spikes and reduce them when it is quiet,
thus saving costs and ensuring high availability.
**Volume
Foto
Produk
Tinggi
Amazon S3 (Simple
Storage Service)**
S3 is a virtually unlimited object storage solution
that's highly reliable for storing all product images.
It offloads the storage load from the main server.

### 4.3 Software Interface

In this project, we’re going to use additional service like payment gateway (xendit/midtrans) and
logistic and shipping (raja ongkir to check shipping cost). All integrations must used HTTPS/TLS for
data security. Why we choose additional services, because they’re documented well and it’s safe
(xendit/midtrans) and trusted by other big company

#### 4.3.1 Payment Gateway Requirement


```
ID Integration
Requirements
Descriptions
SI-P01 API Payment Gateway
Integrations
The system must be integrated with a third-party
Payment Gateway (Xendit or Midtrans) to process
payments from Buyers.
SI-P02 Realtime Notification
Systems
The system must receive and process callbacks from
the Payment Gateway in real-time to update the order
status (for instance from “Waiting for Payment” to
“Payment Successful”).
SI-P03 Dukungan Refund The system must support the Payment Gateway API
endpoint to process partial or full refunds in case of
cancellation of an approved transaction.
```
#### 4.3.2 Logistic and Shipping Requirement

```
ID Integration
Requirements
Descriptions
SI-L01 Shipping Cost
Calculation
The system must be integrated with a Courier Service
API RajaOngkir to get accurate shipping cost
calculations based on the Seller's address, Buyer's
address, and product weight.
SI-L02 Tracking The system must periodically query or receive
webhooks from the Logistics API to update the
package tracking status (Tracking Number) until the
package is received by the Buyer.
```

### 4.4 Communication Interface

```
ID Kebutuhan
Komunikasi
Deskripsi & Tujuan
CI-001 Modern Web Protocol Web server supported HTTP2/3 to optimize the page
loading and reduce latency
CI-002 Format Data All data that sent from backend to frontend, frontend
to backend, and while communicate antar service in
AWS must use JSON (Javascript Object Notation)
CI-003 API Design Standard All API endpoints must follow the standard rules of
API (HTTP Methods such as GET, POST, PUT,
PATCH, DELETE)
CI-004 Real-Time
Communication
(Chat)
The chat feature between Buyers and Sellers must
use the WebSocket protocol so message exchange
occurs in real-time.
CI-005 Email Email delivery (order confirmation, verification and
notification) use (Simple Email Service such as
AWS SES) so we can ensure high delivery rates.
CI-006 Encrypt Key User passwords should never be sent in plaintext and
should be hashed using a modern and secure
algorithm (bcrypt) before being stored in the
database.
```
### 4.5 Smart System Features


**ID Smart System
Requirements
Descriptions
IS-001 Personalized Product
Recommendations**
The system must implement a recommendation
algorithm to present products on the main page and
detail pages that are relevant to: the user's view history,
purchase history, and wishlisted items.
**IS-002 Personalized Size
Recommendations**
Based on the user input data (height, weight, commonly
worn brand size), the system should be able to suggest
the most suitable size for the used item being sold,
taking into account the size chart variations between
brands.
**IS-003 Smart Tagging** To enhance our search, system must have logic to
analyze description or category (and also we can
implement Elastic Search in our searching system)
**IS-004 Seller Trust Scoring** The system must calculate a dynamic Seller Trust Score
based on: Transaction Success Percentage, Average
Chat Response Speed, and the number of Negative
Feedbacks received. This score must be publicly
displayed.
**IS-005 Illegal Items
Detector**
The system should implement advanced keyword
matching to automatically block listings that use words
that refer to prohibited or illegal products, and flag
those listings for review by the Admin.