const express = require('express'); 
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
//const db = require("./dbConnection.js");
const register = require('./routes/authentication/register.js');
const login = require('./routes/authentication/login.js');

const sdb = require('./models');
const User = sdb.User;

/*
t
sdb.sequelize.sync({force: true}).then(()=> {
    console.log('Drop and Resync database');
});*/


const app = express();
app.use(express.json());

const config = {
    port: 5555, // default port to listen on
    host: '127.0.0.1', // default host to connect to
};

console.log('================================= [ Starting ] =================================');
console.log('Server started at http://%s:%d/', config.host, config.port);          

app.get('/', (req, res) => {
    res.send("Everything is working...").status(200);
    const query = req.query
    if(query.length > 0){console.log(query);};
});

//Register
app.use(register);

//Login
app.use(login);

async function verifyToken(req, res, next) {
    const token = req.headers
    if(
        !req.headers.authorization ||
        !req.headers.authorization.startsWith('Bearer') ||
        !req.headers.authorization.split(' ')[1]
        ){
            return res.status(422).json({
                message: "Please provide the token",});
        }
    try {
        const decoded = jwt.verify(token.authorization.split(' ')[1], 'secretkey');
        req.decoded = decoded
        next();
    } catch (e){
        return res.status(401).send({success: false, message:'Invalid token !'})
    }

}

app.post('/test', verifyToken, (req, res) => {
    User.findOne({where: {username: req.decoded.username}}).then((response) => {
        if(response){
            const {id, username, createdAt, updatedAt} = response
            return res.send({ success: true, data: {id, username, createdAt, updatedAt}, message: 'Fetch Successfully.' });
        }else{
            return res.send({ success: false, message: 'Something went wrong !'})
        }
    });
    /*
    db.query('SELECT * FROM users where user_name=?', req.decoded.username, function (error, results) {
    if (error) throw error;
    return res.send({ success: true, data: results[0], message: 'Fetch Successfully.' });
    });*/
});

app.listen(config.port,config.host, () =>{
    console.log('================================= [ Listening ] ================================');
});