const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

const users = []; 

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

app.get('/', (req, res) => {
     res.render('index', { user: req.session.user });
   });

   app.get('/register', (req, res) => {
     res.render('register');
   });
   
   app.post('/register', async (req, res) => {
     const { username, email, password } = req.body;
     const hashedPassword = await bcrypt.hash(password, 10);
     users.push({ username, email, password: hashedPassword });
     res.redirect('/signin');
     console.log("username:", username);
     console.log("email:", email);
     console.log("password:", password);
   });

   app.get('/signin', (req, res) => {
     res.render('signin');
   });
   
   app.post('/signin', async (req, res) => {
     const { email, password } = req.body;
     const user = users.find((u) => u.email === email);
   
     if (user) {
       const isPasswordCorrect = await bcrypt.compare(password, user.password);
   
       if (isPasswordCorrect) {
         // Successful login
         req.session.user = { username: user.username, email: user.email };
         return res.redirect('/');
       } else {
         // Incorrect password
         return res.render('signin', { errorMessage: 'Incorrect password' });
       }
     } else {
       // No user found with this email
       return res.render('signin', { errorMessage: 'Email not found' });
     }
   });
   
   
   app.get('/logout', (req, res) => {
     req.session.destroy((err) => {
       if (err) return res.send('Error logging out');
       res.redirect('/');
     });
   });
   

   function isAuthenticated(req, res, next) {
     if (req.session.user) {
       next();
     } else {
       res.redirect('/signin');
     }
   }
   

   app.get('/dashboard', isAuthenticated, (req, res) => {
     res.render('dashboard', { user: req.session.user });
   });
   