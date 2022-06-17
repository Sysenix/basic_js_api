const express = require('express'); 

const app = express();

const config = {
    port: 5555, // default port to listen on
    host: '127.0.0.1', // default host to connect to
};

console.log('================================= [ Starting ] =================================');
console.log('Server started at http://%s:%d/', config.host, config.port);          

app.get('/', (req, res) => {
    res.send("Everything is working...").status(200);
    try {
        if (res.statusCode >= 200){
            res.send(" Try to send query string parameters");
        };
    } catch (error) {
        console.log(error.message);
    }
    const query = req.query
    if(query.length > 0){console.log(query);};
});

app.listen(config.port,config.host, () =>{
    console.log('================================= [ Listening ] ================================');
});