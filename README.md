# Cryptotrends Server

## Requirements
- Git
- Node.js
- MongoDB

## Installing the application

```git clone```  
```cd cryptotrends-backend```  
```npm install```  
```cp .env.dist .env```

Adjust .env parameters according to your local installation of MongoDB.

### Google NLP API
In order to use the API a token is necessary. The token is in the `google_nlp_key.json.aes` file, which is encrypted. 
The key for decryption can be found in slack in the backend channel as a pinned message.
With the key you can decrypt the file (in Unix systems):

`openssl aes256 -d -in google_nlp_key.json.aes -out google_nlp_key.json`

Same goes for the twitter api keys:

`openssl aes256 -d -in twitter_key.json.aes -out twitter_key.json`

Make sure the .env file has the following property and that the path to the `.json` file is correct (an example of this can be found in the `.env.dist` file:

`GOOGLE_APPLICATION_CREDENTIALS=google_nlp_key.json`

## MongoDB setup

Starting the database:
`mongod`

Creating the database with the required collections:

```mongo```
```use crypto-trends```
```db.createCollection('cryptos')```
```db.createCollection('tweets')```

## Running the application

``` npm run dev```

## Deploying the application

### Prerequisites

- Register on heroku: https://signup.heroku.com/
- Send E-Mail to Tim
- Wait for Invitation
- Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
- Login to heroku:  ```heroku login```
- Set remote heroku: ```heroku git:remote -a cryptotrends-backend```

### Deploy

```git push heroku master```  
This deploys the current master branch to heroku.

  

