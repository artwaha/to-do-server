# Repository 
1. [Github](https://github.com/artwaha/to-do-server) 
2. [cyclic](https://app.cyclic.sh/#/app/artwaha-to-do-server/overview)
3. [MongoDB Atlas database server](mongodb+srv://Abdul-razak:351998zaki@cluster-abdul-razak.mxwdzjt.mongodb.net/todo-db)

# Setup
Clone the project: `git clone https://github.com/artwaha/to-do-server.git`
Then navigate to the project directory and install dependencies by `npm install`

# Running the Project
Run the project by  `npm start` (port configured to **3001**, but you can change it in the **/bin/www** file on the line `var port = normalizePort(process.env.PORT || '3001');)`


# Running Fully Locally
Go to **_app.js_** and _uncomment_ this line  **const uri = "mongodb://localhost:27017/todo"**  and then comment the line **const uri = "mongodb+srv://Abdul-razak:351998zaki@cluster-abdul-razak.mxwdzjt.mongodb.net/todo-db"** . 

This will switch the database from the online MongoDB atlas database server to your local MongoDBdatabase server. You can choose to edit the **URI** connection string to match your local Mongodb Server if needed. 

The database files containing initial sample data are in the **databases** directory, simply import them into your local database server (easily done in **MongoDB Compass** Application) 

then when you run the project (npm start) - you will be fully running locally.

# Running locally but with MongoDB Atlas
If you dont want the hasle of importing the database files to your local MongoDB Server, then you dont have to edit anything, just simply run `npm start` and the project will refer to the hosted database on MongoDB Atlas - although it can get a bit slow especially when your internet is not strong. 

`I recommend  you just import the database files to your local server for maximum perfomance`

# NODEMON  (Optional)
For speedy development, you can switch to using `nodemon` package by editing the `package.json` file.
Just replace the line **`"start": "node ./bin/www"`** with **`"start": "nodemon ./bin/www"`**

