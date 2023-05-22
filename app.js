const express = require('express');
const app = express();
const SignUp = require('./db/SignUp');
const DelUser = require('./db/DelUser');
const Login = require('./db/Login');
const CheckDB = require('./db/CheckDB');
const generateJWT = require('./jwt')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  await CheckDB.connect();
  res.status(200).json('Welcome to Sample Website for user managing with cookies...');
});

app.post('/SignUp', async (req, res) => {
  await SignUp(req, res);
});

app.get('/Login', async (req, res) => {
  await Login(req, res);
  await generateJWT(req,res)
});

app.post('/DelUser', async (req, res) => {
  await DelUser(req, res);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
