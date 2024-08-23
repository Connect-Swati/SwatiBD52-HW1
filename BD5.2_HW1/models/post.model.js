const { sequelize_instance, DataTypes } = require("../lib/index");
/*
Create a model for post in the folder ./models/post.model.js

Define the Datatypes for each column based on the structure of the dummy data

Don’t define id in the model. Sequelize will automatically assign id’s to each record
*/
const Post = sequelize_instance.define("post", {
  name: DataTypes.TEXT,
  author: DataTypes.TEXT,
  content: DataTypes.TEXT,
  title: DataTypes.TEXT,
});
module.exports = Post;
