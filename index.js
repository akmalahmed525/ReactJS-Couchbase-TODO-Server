const express = require('express')
const jwt = require('jsonwebtoken')
const exjwt = require('express-jwt')
const bodyParser = require('body-parser');
const app = express()
const dbconn = require('./db')
const port = 5500

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const jwtMW = exjwt({
    secret: 'TESTING_SERVER_SECRET'
});

app.post('/api/login', (req,res)=>{
    const { username, password } = req.body;
    dbconn.bucket.query(dbconn.N1qlQuery.fromString('SELECT `username`, `password`, META(TODO).id FROM `TODO` WHERE `username`="'+username+'" AND `type`="user"'),
        (err, rows)=>{
            var dbUname = rows[0].username
            var dbPassword = rows[0].password
            var dbID = rows[0].id
            if (password == dbPassword && username == dbUname) {
                let token = jwt.sign({ id: dbID, un: dbUname }, 'TESTING_SERVER_SECRET', { expiresIn: 129600 })
                res.json({
                    success: true,
                    err: null,
                    token
                });
            } else {
                res.status(401).json({
                    success: false,
                    token: null,
                    err: 'Username or password is incorrect'
                });
            }
        }
    )
})

app.post('/api/profile/i',(req,res)=>{
    const { id, token, title, date, note } = req.body
    jwt.verify(token,'TESTING_SERVER_SECRET',(err, decodedToken)=>{
        var upsertData = {name:decodedToken.un, title:title, date:date, note:note, type:'todo'}
        dbconn.bucket.upsert(id, upsertData, (err2, res2)=>{
            res.json({
                success: true,
                err: null,
            })
        })
    })
})

app.post('/api/profile/r',(req, res)=>{
    const {token} = req.body
    jwt.verify(token,'TESTING_SERVER_SECRET', (err,decToken)=>{
        var username = decToken.un
        dbconn.bucket.query(dbconn.N1qlQuery.fromString('SELECT *, META(TODO).id FROM `TODO` WHERE `TODO`.`name`="'+username+'" AND `TODO`.`type`="todo"'),
            (err, rows)=>{
                var arr = rows.rows
                res.json(rows)
            })
    })
})


app.get('/api/profile', jwtMW, (req, res) => {
    res.send('You are authenticated');
});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError'){
        res.status(401).send(err);
    }
    else {
        next(err);
    }
});

app.listen(port,()=>{
    console.log('Server started on port number',port)
})