const router = require('express').Router();
const bcrypt = require ('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../../models');
/* 
HTTP request that used;
200 - OK
400 - Bad Request
401 - Unauthorized
404 - Not Found
500 - Internal Server Error
*/

async function getuser(user_name) {  
    try {
    User.findOne({where: {username: user_name}}).then(user => {
        if(user){
            return user
        }else{ 
            return null;
        }
    }
    );} catch(e){
        console.log('Probably there was an error trying to connect to database !', e);
    }
};

router.post('/login', (req, res) => {
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
            return res.status(404).send({
                success: false,
                message: 'User name does not exist'
            });
        }

    });
 
    return res.status(500);

});
module.exports = router;


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