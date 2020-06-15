const express = require('express');
const app = express();
const router = express.Router();

const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const path = require('path')
const flash = require('connect-flash');


app.use(express.static(path.join(__dirname, 'build')));


app.use(cors());

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true
// }))

app.use(cookieParser());

app.use(session({secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 24 }, unset: "destroy",}))

// app.use(cookieSession({
//     name: 'MyAppName',
//     keys: ['very secret key'],
//     maxAge: 30 * 24 * 60 * 60 * 1000 ,// 30 days
// }));

require('./config/passport')(passport);



// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



app.use(flash());

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


app.use('/api',router);
router.use('/users', require('./routers/userRouter.js'));
router.use('/camps', require('./routers/campRouter.js'));
router.use('/admins', require('./routers/adminRouter.js'));
router.use('/orders', require('./routers/orderRouter.js'));

const port = process.env.PORT || '4000';


//
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname+'/build/index.html'));
// });

app.listen(port, function() {
    console.log("Server is running on Port: " + port);
});
