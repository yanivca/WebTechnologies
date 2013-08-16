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
**Params:**
* username - The username of the user
* password - The users password

* The username and the password for the login in the URL

#### minRating ####

Used to query for users that has higher rating than specified

**URL:** /users/minRating/<em>\:rating</em> <br />
**Method:** GET

#### findTopCloseUsers ####

Used to find users, with the distance criteria

**URL:** /users/near/<em>:maxItems</em>/<em>:maxDistance</em> <br />
**Method:** GET
**Params:**
* maxItems  (Optional) - Maximum number of items to return
* maxDistance (Optional) - Max distance from the current location, 
measured against the last known location of the online users

#### getUsers ####

Userd to get list of users, or a single user

**URL:** /users/<em>:id</em> <br />
**Method:** GET
**Params:**
* id  (Optional) - The ID of the user we look for

-----------------------------
### Notifications actions ###

#### Notify ####

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

#### Update ####

Used to update the rate on a transaction

**URL:** /notifications/update
**Method:** POST <br />
**Content Type:** application/json <br />
**Params:** <br />
* _id - Id of the notification we want to update
* rate - The new exchange rate

**Example:** <br />
```json
{
    _id: "520d15c35156cc4912d10f07",
    rate: 50
}
```

#### getNotifications ####

Used to get all the notifications for the user

**URL:** /notifications<br />
**Method:** GET

-----------------------------

### Broadcasts ####

#### publishOrUpdate ####

Used to publish or update a broadcast about a transaction. If the user already have a broadcast it will update it, otherwise it will create one.

**URL:** /broadcasts/publish
**Method:** POST <br />
**Content Type:** application/json <br />
**Params:** <br />
* bitcoinsAmount - The new exchange rate
* rate - The rate of the broadcast
* type - Type of the broadcast (Either "buy" or "sell"
 

**Example:** <br />
```json
{
   "bitcoinsAmount": 10,
   "rate": 100,
   "type": "buy"
}
```

#### getBroadcasts ####

Used to get all the broadcasts for the user

**URL:** /broadcasts<br />
**Method:** GET

#### deleteBroadcast ####

Delete a broadcast the user has posted

**URL:** /broadcasts/cancel<br />
**Method:** DELETE
**Content Type:** application/json <br />
**Params:** <br />
* _id - The id of the broadcast to cancel

**Example:** <br />
```json
{
    "_id": "520e77268ed85c8021000002"
}
```

-----------------------------

### Comments ###

* All tests were maid with the chrome extention Postman (https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en)
* During the pupulate table function there is a use with the _ensureIndex_ function
