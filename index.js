const express = require('express');
const helmet = require('helmet');
const expressEnforcesSSL = require('express-enforces-ssl');
const sqlite3 = require('sqlite3').verbose();
const PORT = process.env.PORT || 3001;

const app = express();

// Initialize an express app with some security defaults
app
  .use(https)
  .use(helmet());

let db = new sqlite3.Database('./db/transactions.sqlite', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the okc database.');
});
   
// Application-specific routes
// Add your own routes here!
app.get('/query', async (req, res, next) => {
  db.serialize(() => {
    db.all(`SELECT PLAYER as name,
                    YEAR as year
             FROM TRANSACTIONS
             WHERE NewTeam = 'Bucaneros'
             ORDER BY Year`, (err, row) => {
      if (err) {
        console.error(err.message);
      } else {
        res.send(row);
      }
    });
  });
});

// Serve static assets built by create-react-app
app.use(express.static('build'));

// If no explicit matches were found, serve index.html
app.get('*', function(req, res){
  res.sendFile(__dirname + '/build/index.html');
});

app
  .use(notfound)
  .use(errors);

function https(req, res, next) {
  return next();
}

function notfound(req, res, next) {
  res.status(404).send('Not Found');
}

function errors(err, req, res, next) {
  console.log(err);
  res.status(500).send('something went wrong');
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
 

function closedb() {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
}