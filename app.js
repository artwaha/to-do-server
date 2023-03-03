var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const { default: mongoose } = require('mongoose');

// Routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tasksRouter = require('./routes/tasks')
const collaboratorRouter = require('./routes/collaborators')

var app = express();

app.use(cors())


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);
app.use('/collaborators', collaboratorRouter)

mongoose.set('strictQuery', false);

const uri = "mongodb+srv://Abdul-razak:351998zaki@cluster-abdul-razak.mxwdzjt.mongodb.net/todo-db"
// const uri = "mongodb://localhost:27017/tododb"

const main = async function () {
  try {
    await mongoose.connect(uri)
    console.log("Success");
  } catch (error) {
    console.log(error);
  }
}

main()

module.exports = app;
