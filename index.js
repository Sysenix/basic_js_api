const express = require('express'); 
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
//const db = require("./dbConnection.js");

const sdb = require('./models');
const User = sdb.User;
/*
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


async function getuser(username) {  

    db.query(`SELECT * FROM users WHERE user_name = '${username}'`,async (error, result)=> {
        if(error)throw error;
        if(result.length > 0){
            console.log("result:" + result);
            return result;
        }else{
            return null;
        }
    })

}

async function checkUser(username, password){
    /* 
    
    fetch user from database
    const user = await db.get(username)
    
    db.query(`SELECT * FROM users WHERE username = '${username}'`,(error, result)=> {
        if(result.length > 0){
            return res.status(409).send({message: 'This user name already exists'})
        }
    })*/
    console.log(username)

    const user = await getuser(username);
    if (user){
        

        const match = await bcrypt.compare(password, user[0].password);
        if(match){
            console.log("user: " + user);
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}
   


//Register
app.post('/register', async (req, res) => {
    console.log(req.body);
    const {user_name, password} = req.body;
    if (!user_name && !password) {
        res.status(400).send('All input required');
    }
    // database chech if exists
    User.findOne({where: {username: user_name}}).then(async(user) => {
        if(user){
            return res.status(400).send({message: 'This user name already exists.'});

        }else{
            const passwordHash = await bcrypt.hash(password, 10);
            User.create({username: user_name, password: passwordHash}).then((user) => {
                const token = jwt.sign(
                    {username: user_name}, "secretkey", {expiresIn: "1h"}
                );
                return res.status(201).send({success: true, message: {username: user_name, token: token}})

            })
        }
    });
    //data base check if exists
    /* here is pure sql query you can use that one also
    db.query(`SELECT * FROM users WHERE user_name = '${user_name}'`,async (error, result)=> {
        if (error) throw error;
        if(result.length > 0){
            return res.status(409).send({message: 'This user name already exists'})
        }else{ // if user does not exist then
            const passwordHash = await bcrypt.hash(password, 10);
            db.query(`INSERT INTO users (user_name, password) VALUES ('${user_name}', '${passwordHash}')`,(error, result)=>{
                if(error){
                    throw error;
                    return res.status(400).send({
                        message: error,
                    });

                }
                const token = jwt.sign(
                    {username: user_name}, "secretkey", {expiresIn: "1h"}
                );
                return res.status(201).send({success: true, message: {username: user_name, token: token}})
            });
        }
    });*/

});

//Login
app.post('/login', (req, res) => {
    const {user_name, password} = req.body;
    if (!user_name && !password) {
        res.status(400).send('All input required');
    }

    User.findOne({where: {username: user_name}}).then((user) => {
        if(user){
            bcrypt.compare(password, user.password, (bErr, bbResult)=>{
                if(bErr){
                    throw bErr;
                    return res.status(401).send({success: false, message: 'Email or password incorrect!'});
                    
                }
                if(bbResult){
                    const token = jwt.sign(
                        {username: user_name}, "secretkey", {expiresIn: "1m"}
                    );
                    return res.status(200).send({success: true, message: {username: user_name, token: token}})
                }
                return res.status(401).send({success: false, message:'User name or password incorrect !'})
            });
        }else{
            return res.status(400).send({
                success: false,
                message: 'User name does not exist'
            });
        }

    });
    /*
    db.query(`SELECT * FROM users WHERE user_name = '${user_name}'`,
    (error, result) => {    
        if (error){
            throw error;
            return res.status(400).send({
                message: error,
            });
        }
        if (!result.length){
            return res.status(400).send({
                message: 'User name does not exist'
            }
            )
        }

        bcrypt.compare(password, result[0]['password'], (bErr, bbResult)=>{
            if(bErr){
                throw bErr;
                return res.status(401).send({success: false, message: 'Email or password incorrect!'});
                
            }
            if(bbResult){
                const token = jwt.sign(
                    {username: user_name}, "secretkey", {expiresIn: "1m"}
                );
                return res.status(200).send({success: true, message: {username: user_name, token: token}})
            }
            return res.status(401).send({success: false, message:'User name or password incorrect !'})
        });
        
        if(checkUser(user_name, password)){
            //login success
            const token = jwt.sign(
                {username: user_name}, "secretkey", {expiresIn: "1h"}
            );
            res.status(200).json({success: true, message: {
                username: user_name,
                token: token
            }})
        }


    });
    */

    return res.status(500);

});

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