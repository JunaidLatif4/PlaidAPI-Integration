// Modules Imports :
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const plaid = require('plaid')

const { PLAID_CLIENT_ID, PLAID_SECRET } = require('./keys')
const { response } = require('express')

// Creating App :
const app = express();


const handleError = (err) => {
  console.error(err)
}

// Defining Cliend For Plaid :
const client = new plaid.Client({
  clientID: PLAID_CLIENT_ID,
  secret: PLAID_SECRET,
  env: plaid.environments.sandbox,
})

// App Configurations :
app.use(bodyParser.json());   // For parsing Application/Json
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// MongoDB Connection :
// mongoose.connect('mongodb://localhost:27017/users?authSource=admin', { user: "root", pass: "example", useNewUrlParser: true })
mongoose.connect('mongodb://localhost:27017/plaid', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;

// DB Schema
let userSch = mongoose.Schema({
  email: String,
  pass: String,
  plaidData: Array
})
let plaidUser = mongoose.model('User', userSch)

db.on('error', console.error.bind(console, "Connection ERROR !!!!!!!!!!!!!!!!!!"))
db.once('open', () => {

  app.get('/', (req, res) => {
    res.json({
      message: "Hellow Jarviz"
    });
  });

  app.post('/register', (req, res) => {
    console.log("The Comming Body Data=====", req.body)
    let { email, pass } = req.body

    let newPlaidUser = new plaidUser({ email, pass })
    newPlaidUser.save((err, suss) => { res.send({ message: `User Created With ID = ${suss._id}` }) })

  })

  app.post('/create_link_token', async (req, res) => {
    let userId = "60ee87e65ad1d61ec4286734";

    try {
      const tokenResponse = await client.createLinkToken({
        user: {
          client_user_id: userId,
        },
        client_name: 'Junaid',
        products: ["auth"],
        country_codes: ['US'],
        language: 'en',
        webhook: 'https://webhook.sample.com',
      });
      res.json(tokenResponse);
    } catch (e) {
      return res.send({ error: e.message });
    }
  });

  app.post('/get_access_token' , async (req , res)=>{
    let { public_token } = req.body

    const access_token = await client.exchangePublicToken(public_token , (err , res)=>{
      if (err){
        return res.json({ERROR : "EXCHANGING TOKEN FAILED"})
      }


      
    })

    console.log("The RES From EXCHANGETOKEN ==== " , access_token)

  })



  app.listen(8080, () => console.log("Server is Started at localhost:8080 ")
  );

})





// app.post('/plaid_token_exchange', async (req, res) => {
//   const { publicToken } = req.body;

//   const { access_token } = await client.exchangePublicToken(publicToken).catch(handleError);
//   const { accounts, item } = await client.getAccounts(access_token).catch(handleError)

//   console.log({
//     accounts,
//     item
//   })
// })

// app.post('/create_link_token', async (request, response) => {
//   try {
//     // Get the client_user_id by searching for the current user
//     //   const user = await User.find(...);
//     const clientUserId = "45";
//     // Create the link_token with all of your configurations
//     const tokenResponse = await client.createLinkToken({
//       user: {
//         client_user_id: clientUserId,
//       },
//       client_name: 'Junaid',
//       products: ["auth"],
//       country_codes: ['US'],
//       language: 'en',
//       webhook: 'https://webhook.sample.com',
//     });
//     response.json(tokenResponse);
//   } catch (e) {
//     // Display error on client
//     return response.send({ error: e.message });
//   }
// });
