## BitcoinMeetup API ##

### User actions ####

#### Subscribe ####

Used to create new users in the system

_URL:_ users/subscribe
_Method:_ POST
_Content Type:_ application/json
_Params:_
* firstName - First name of the user
* lastName - Surname of the user
* password - User password for login
* type - Array, The array can contain one of the 2 following options:
 * buy - The user is a bitcoin buyer
 * sell - The user is a bitcoin seller

_Eample:_
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

#### Login ####

Used to login a user to the system

_URL:_ /users/login/<em>username</em>/<em>password</em>
_Method:_ GET

* The username and the password for the login in the URL


### Notifications actions ###

### Notify ###

Used to send notifications between users on transactions

_URL:_ /notifications/notify
_Method:_ POST
_Content Type:_ application/json
_Params:_
* to - Id of the user the notification is sent to
* bitcoinsAmount - How many bitcoins are in the transaction
* rate - The exchange rate

_Eample:_
```json
{ 
"to": "520d15c35156cc4912d10f08", 
"bitcoinsAmount": 3, 
"rate": 111 
}
```
