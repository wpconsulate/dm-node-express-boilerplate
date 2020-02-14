var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var flash = require("connect-flash");
var userInViews = require("./middleware/userInViews");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var emailRouter = require("./routes/email");
var authRouter = require("./routes/auth");
// var mysql = require('mysql');
var mysql = require("promise-mysql");

const C = require("./config");

var app = express();

//----------------------------------------------------------------------------------------------------------------------------------------------
// view engine setup and other settings
//----------------------------------------------------------------------------------------------------------------------------------------------
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// config express-session
var sess = {
	secret: "CHANGE THIS SECRET",
	cookie: {},
	resave: false,
	saveUninitialized: true
};

if (app.get("env") === "production") {
	sess.cookie.secure = true; // serve secure cookies, requires https
}

app.use(session(sess));
app.use(express.static(path.join(__dirname, "public")));

app.use(flash());

app.use(userInViews());

//----------------------------------------------------------------------------------------------------------------------------------------------
// Set App Routes
//----------------------------------------------------------------------------------------------------------------------------------------------
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/email", emailRouter);
app.use("/api/auth", authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
