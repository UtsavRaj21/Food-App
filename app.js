//npm init -y
//npm install express
//npm i nodemon -g  -->> then -->> nodemon app (in terminal) -->> -g for(global)
// npm install nodemailer

const express = require('express');

//server creation 
const app = express();
let port = '8000'
app.listen(port,function(){
    console.log(`server is Listening on port ${port}`)
});

//types of request -> get,post,put,delete
app.get('/' , (req,res)=>{
    console.log('<h1>hi hlo</h1>')
    res.send('<h1>hello</h1>');
})
// app.get('/home',(req,res)=>{               //http://localhost:8000/home
//     console.log(req.hostname);
//     console.log(req.path);
//     console.log(req.method);
//     res.send('<h1>hello</h1>');
// });

let obj = {
    'name' : 'Utsav'
}

app.get('/user1' , (req,res)=>{
    console.log('<h1>hi hlo</h1>')
    console.log('de')
    res.send(obj);
})
//json  
app.get('/user2' , (req,res)=>{
    console.log('<h1>hi hlo</h1>')
    console.log('de')
    res.json(obj);
})

app.get('/home', (req,res)=>{
    console.log('sendFile')
    res.sendFile('./views/index.html',{root : __dirname});     // for html file
});