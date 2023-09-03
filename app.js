var createError = require('http-errors')
var express = require('express')
const session = require('express-session')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

// custom
const flash = require(require('./config/paths').functions).flashMessage

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(session({
	secret: 'edtyroApp',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}))

app.use(flash())

app.use(function (req, res, next) {

	res.locals.hasPermission = {}
	next()

})

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, 'public')))

// dynamic api processing
var routes = require('./routes/api')
routes.map((route, index) => {

	app.use('/api' + route.path, require('./app/Api/' + route.to))

})

// dynamic router processing
routes = require('./routes/web')
routes.map((route, index) => {

	app.use(route.path, require('./app/Controllers/' + route.to))

})

// catch 404 and forward to error handler
app.use(function (req, res, next) {

	next(createError(404))

})

// error handler
app.use(function (err, req, res, next) {

	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')

})

module.exports = app
