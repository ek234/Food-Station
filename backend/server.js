const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 4000;
const MONGO_PORT = 27017;
const DB_NAME = "foodorderer"

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connection to MongoDB
mongoose.connect('mongodb://127.0.0.1:' + MONGO_PORT + '/' + DB_NAME, { useNewUrlParser: true });
const connection = mongoose.connection;
connection.once('open', function() {
	console.log("MongoDB connected");
})

// routes
var UserRouter = require("./routes/api/user")
var FoodRouter = require("./routes/api/food")
var OrderRouter = require("./routes/api/order")
// setup API endpoints
app.use("/api/user", UserRouter);
app.use("/api/food", FoodRouter);
app.use("/api/order", OrderRouter);

app.listen(PORT, function() {
	console.log("server is running on port: " + PORT);
});
