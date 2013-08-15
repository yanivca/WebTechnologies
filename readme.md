## BitcoinMeetup API ##

### User actions ####

#### Subscribe ####

Used to create new users in the system

**URL:** users/subscribe <br />
**Method:** POST <br />
**Content Type:** application/json <br />
**Params:** <br />
* firstName - First name of the user
* lastName - Surname of the user
* password - User password for login
* type - Array, The array can contain one of the 2 following options:
 * buy - The user is a bitcoin buyer
 * sell - The user is a bitcoin seller

**Example:** <br />
```json
{ 
"firstName": "Itzik", 
"lastName": "Levi", 
"username":"itzikl", 
"password": "1234567", 
"type": [ 
  "buy", 
  "sell"
  ] 
}
```

#### Logout ####

Used to logout a user to the system

**URL:** /users/logout <br />
**Method:** GET

#### Login ####

Used to login a user to the system

**URL:** /users/login/<em>:username</em>/<em>:password</em> <br />
**Method:** GET

* The username and the password for the login in the URL

#### minRating ####

Used to query for users that has higher rating than specified

**URL:** /users/minRating/<em>\:rating</em> <br />
**Method:** GET

### Notifications actions ###

### Notify ###

Used to send notifications between users on transactions

**URL:** /notifications/notify <br />
**Method:** POST <br />
**Content Type:** application/json <br />
**Params:** <br />
* to - Id of the user the notification is sent to
* bitcoinsAmount - How many bitcoins are in the transaction
* rate - The exchange rate

**Example:** <br />
```json
{ 
"to": "520d15c35156cc4912d10f08", 
"bitcoinsAmount": 3, 
"rate": 111 
}
```
