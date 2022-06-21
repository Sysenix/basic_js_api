const dbConfig = require("../config/db.config.js");
const Sequelize = require('sequelize');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    logging: false
});
const db = {}
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.model.js")(sequelize,Sequelize);


sequelize
  .authenticate()
  .then(() => {
    console.log('Database is connected successfully ! Sq');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = db;