var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [
	
	];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('TO-DO API Root');
});

// GET /todos?completed=true
app.get('/todos', function(req, res){
	var queryParams = req.query;
	var filteredTodos = todos;
	
	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
		filteredTodos = _.where(filteredTodos, {completed: false});
	}
	
	
	
	res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id);
	
	var matchedToDo = _.findWhere(todos, {id: todoId});
	
	
	console.log(matchedToDo);
	
	if(matchedToDo){
		
	res.json(matchedToDo);
	}
	else{
	res.status(404).send();
	}
	
});


// POST /todos
app.post('/todos', function(req, res){
	var body = _.pick(req.body, 'description', 'completed');
	
	
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		
		return res.status(400).send();
	}
	
	body.description = body.description.trim();
	
	// add id field
	body.id = todoNextId++;
	
	// push body into array
	todos.push(body);
	res.json(body);
});


// DELETE /todos/:id

app.delete('/todos/:id', function (req, res){
	
	var todoId = parseInt(req.params.id);
	
	var matchedToDo = _.findWhere(todos, {id: todoId});
	
	if(matchedToDo){
		todos = _.without(todos, matchedToDo);
		res.json(matchedToDo);
	} else{
		res.status(404).json({"error": "no todo found with that Id"});
	}
	
});


// PUT /todos/:id

app.put('/todos/:id', function(req, res){
	
	var todoId = parseInt(req.params.id);
	var matchedToDo = _.findWhere(todos, {id: todoId});
	
	if(!matchedToDo){
		return res.status(404).send();
	}
	
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};
	
	
	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		validAttributes.completed = body.completed;
	} else if(body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}
	
	if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
		validAttributes.description = body.description;
	} else if(body.hasOwnProperty('description')) {
		res.status(400).send();
	}
	
	_.extend(matchedToDo, validAttributes);
	res.json(matchedToDo);
	
});

app.listen(PORT, function(){
	console.log('Express listening on port ' + PORT);
});