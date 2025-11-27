# **----------------------------- *MIDHUNA MASALA* -------------------------------**



### **AIM**

###### Midhuna Masala is an initiative taken by my MOM, this is an full-fledged e-commerce web application for selling homemade masalas, enabling customers to browse, purchase, and track products online with secure payment integration and an intuitive shopping experience. The system also provides an admin dashboard to manage products, stock, and orders efficiently in real time.



### **TECH STACK**

###### Next JS (Frontend)

###### Node JS, Express JS (Backend)

###### Firebase (Authentication and DB) - may be changed as per need

###### Payment Gateway - RazorPay(India)



### **FLOW OF THE APPLICATION**

* ###### The application contains two websites one for users and another one for admin. In users website, where users can browse, purchase, and track products efficiently. In Admin website, the admin will update the stock, manages users and payment and all basic needs. This segregation is done because to keep the application safety from 3rd person.
* ###### There will be role based authentication in backend too because the API will also be connected with admin site and users site so to keep safer this approach is decided.
* ###### This application follows **TWO Frontend(Users \& Admin) and ONE Backend** logic, That is like there will be an 1 API key for example POST request in orders page this can be accessed by all users but in POST request in products(that is creating or adding products) in this request the backend should **validate** the user whether the person is user or admin, if it is user "Access Denied", else "Access Granted".









use some se tools like SonarQube (code quality) and some more

