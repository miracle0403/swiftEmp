var mysql = require ('mysql');
var server = require ('./app.js');

connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "rootdb"
});

connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (error, results, fields){
  if (error) throw error;
  console.log ("the result is: results[0], solution")
});
  
module.exports = connection