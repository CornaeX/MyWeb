var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var encryptHash = '';

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'db4free.net',
  user: 'cornaex',
  password: '7@@b#E8Ahjgg-yT',
  database: 'mydbcnx'
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

//----------------------------------------------------------------------------------------

app.post('/register', function(req, res, next){
  const { username, password } = req.body;

  bcrypt.hash(password, saltRounds, function(err, hash) {
    
    encryptHash = hash;

    console.log(encryptHash);

    // Create an SQL query to insert the data into a table
    const sql = `INSERT INTO test (username, password) VALUES (?, ?)`;
  
    // Execute the query with the data
    connection.query(sql, [username, encryptHash], function(error, results, fields) {
      if (error) {
        console.error('Error inserting data: ' + error.stack);
        return;
      }
      console.log('Data inserted successfully');
      res.render('RegisPage', { title: 'Express' });
    });
  });  
});

//----------------------------------------------------------------------------------------

app.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  
  // Create an SQL query to check the username and password in the database
  const sql = `SELECT * FROM test WHERE username = ?`;  
  
  // Execute the query with the provided username and password
  connection.query(sql, [username], function(error, results, fields) {
    if (error) {
      console.error('Error executing the query: ' + error.stack);
      return;
    }

    if (results.length === 1) {

      bcrypt.compare(password, results[0].password, function(err, result) {
        if (result) {
          // User exists, redirect to a success page or perform other actions
          res.redirect('/success');
        } else {
          // User does not exist or invalid credentials, redirect to an error page or perform other actions
      res.redirect('/error');
        }
      });      
    }
  });
});

//----------------------------------------------------------------------------------------

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.post('/register', function(req, res, next){
  console.log(req.body);
  res.render('RegisPage', { title: 'Express' });

});

//----------------------------------------------------------------------------------------

app.get('/login', (req, res) => {
  res.render('LoginPage');
});

app.get('/register', (req, res) => {
  res.render('RegisPage');
});

app.get('/success', (req, res) => {
  res.render('success');
});

//----------------------------------------------------------------------------------------

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
