var mysql = require('mysql2');
var conn = mysql.createConnection({
  host: '172.17.0.2', 
  user: 'root',
  port: '3306',
  password: '123456',      // Replace with your database password
  database: 'my-node' // // Replace with your database Name
}); 
 
conn.connect(function(err) {
  if (err) throw err;
  console.log('Database is connected successfully !');
});
module.exports = conn;

/*      
CREATE DATABASE my-node

 CREATE TABLE `my-node`.`new_table` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(50) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_name_UNIQUE` (`user_name` ASC) VISIBLE);


*/