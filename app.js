const faker = require('faker');
const mysql = require('mysql');
const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');

app.use(express.urlencoded({ extended: true }))

var con = mysql.createConnection({
    host: "localhost",
    user: "username",
    password: "password",
    database: 'join_us',
    port: 3306,
    insecureAuth: true
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

//Basic queries
// var q = 'select * from users';
// con.query(q, function (error, results, fields) {
//     if (error) throw error;
//     console.log(results[0]);
// })


//inserting manually
// var q = 'insert into users(email) values("helapa@gmail.com")';
// con.query(q, function (error, results, fields) {
//     if (error) throw error;
//     console.log("user registered!")
// })


// Intserting fake email
// var person_email = { email: faker.internet.email() };
// con.query('insert into users set?', person_email, function (err, res) {
//     if (err) throw err;
//     console.log("user registered!");
// })

// con.end();



// console.log(faker.date.past());
// 2021-03-11T14:36:51.110Z (java script date format) comes as output but 
//mysql package convert it into yyyy-mm-dd HH:ii:ss 
// thats what we need to insert in our database 

// intserting fake email and created_at
// var person = {
//     email: faker.internet.email(),
//       age:faker.random.number({min:18, max:70});
//     created_at: faker.date.past()
// };
// con.query('insert into users set?', person, function (err, res) {
//     if (err) throw err;
//     console.log("user registered!");
// })
// con.end();




//INSERTED 500 USERS
// var data = [];
// for (var i = 0; i < 500; i++) {
//     data.push([
//         faker.internet.email(),
//         faker.datatype.number({ min: 18, max: 75 }),
//         faker.date.past()
//     ]);
// }
// console.log(data);

// var q = 'insert into users (email,age,created_at) values ?';
// con.query(q, [data], function (err, res) {
//     if (err) throw err;
//     console.log("user registered!")
// })

// con.end();




app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    var q = "select count(*) as count from users"
    con.query(q, function (err, results) {
        if (err) throw err;
        let l = results[0].count;
        // console.log(l);
        res.render('index.ejs', { users: l });
    });
});
app.post('/', (req, res) => {
    // console.log(req.body);
    const { email, age } = req.body;
    var q = "insert into users set ?";
    con.query(q, { email, age }, function (err, results) {
        if (err) {
            console.log(err.sqlMessage);
            res.send(err.sqlMessage);
            return;
        }
        res.redirect('/');
    })
})
app.listen(3000, () => {
    console.log(`YOU ARE LISTENING PORT: 3000`);
})
