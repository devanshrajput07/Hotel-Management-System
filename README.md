# Hotel-Management-System

**Authentication:**
Implement user registration and login for hotel managers and customers.
Use JWT for secure authentication.

**Password Hashing:**
Hash and salt passwords before storing them in the database.

**Protected Routes:**
Use middleware to control access to routes. For example, only hotel managers can update room availability, and customers can book rooms.

**Email Notifications:**
Send email notifications to customers to confirm their room bookings and to hotel managers when new bookings are made.

**Middleware:**
Implement middleware for logging, error handling, and input validation.

**User Schema:**
First Name
Last Name
Email
Password (hashed)
Salt (string of characters)
Account Type: enum[Customer, Hotel Manager, Admin] (default: Customer)

**Room Schema:**
Hotel ID
Room Number
Room Type
Price
Availability: enum[Available, Booked]
Bookings: Array of Booking

**Booking Schema:**
Customer ID
Room ID
Check-In Date
Check-Out Date
Status: enum[Reserved, Checked-In, Checked-Out]

**Hotel Management System Routes:**

/signup
Method: POST
Description: Add a user.
Mandatory: Implement reCaptcha for the signup process.

/login
Method: POST
Description: Return an authorization token (JWT token).

/password/reset
method : POST  
body : { email }
description : It should send an email with a password reset link.

/password/reset/:token
method : POST
params : token
body : { new_password }
description : If the token is verified then it should reset the password

/room/list
Method: GET
Description: List all available rooms.

/room/book
Method: POST
Query parameter: Hotel id
Description: Accessible to customers. Books a room.

/room/update
Method: PUT
Query parameter: Room id
Description: Accessible to hotel managers. Updates room availability and details.

/room/checkout
Method: POST
Description: Accessible to customers. Checks out from a room.

/booking/list
Method: GET
Description: List all bookings for a customer.

/booking/all
Method: GET
Description: List all bookings for a hotel manager.

/booking/cancel
Method: DELETE
Description: Accessible to customers. Cancels a booking.

/admin/delete
Method: DELETE
Description: Accessible only to administrators.
Query Parameter: User Email
Description: Delete a particular user.
