var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var session      = require('express-session');
var port     = process.env.PORT || 3000;
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());


//DB connection

var configDB=require('/home/ubuntu/workspace/todo_Login/config/database.js');

mongoose.connect(configDB.url);

require('/home/ubuntu/workspace/todo_Login/config/passport')(passport);

//Set up the express application

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // set up ejs for templating

	// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



//model

var Todo=mongoose.model('Todo',{text:String});

//api
//get all todos

app.get('/api/todos',function(req,res)
{
	//use mongoose to get all todos
	Todo.find({},function(err,todos)
	{
		if(err){res.send(err)}
		res.json(todos);
	});
});

//crete a post and return all todos 
app.post('/api/todos',function(req,res)
{
	Todo.create({text:req.body.text,done:false},
	function(err)
	{
		if (err){res.send(err)}
		
		Todo.find({},function(err,todos)
	{
		if(err){res.send(err)}
		res.json(todos);
	});
	});
});

//delete a todo

app.delete('/api/todos/:todo_id',function(req,res)
{
	Todo.remove(
		{_id:req.params.todo_id},
			function(err)
			{
					if(err){res.send(err)}
			
			Todo.find({},function(err,todos)
			{
				if(err){res.send(err)}
				res.json(todos);
			});	
				
			});

			
		
});




//routes

require('/home/ubuntu/workspace/todo_Login/routes.js')(app,passport);


app.listen(port);
console.log('The magic happens on port ' + port);
