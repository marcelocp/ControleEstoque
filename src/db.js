const mysql = require('mysql')

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "julingerie"
})

function getConnection(){
  return connection
}

module.exports = {getConnection}

