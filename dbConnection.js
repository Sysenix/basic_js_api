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
CREATE DATABASE node-app
 
CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  user_name varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  password varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY username (username)
 ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

 CREATE TABLE `my-node`.`new_table` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(50) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `user_name_UNIQUE` (`user_name` ASC) VISIBLE);


*/