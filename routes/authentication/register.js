const router = require('express').Router();
/* 
HTTP request that used;
201 - Created
400 - Bad Request
500 - Internal Server Error
*/
router.post('/register', async (req, res) => {
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
    return res.status(500).end();

});

//data base check if exists sql query
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