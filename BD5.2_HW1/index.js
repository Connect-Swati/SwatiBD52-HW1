//npm install express sequelize sqlite3
let express = require("express");
let app = express();
let port = 3000;
// Import the Post model and Sequelize instance from the previously defined paths
let Post = require("./models/post.model");
let { sequelize_instance } = require("./lib/index");
app.listen(port, () => {
  console.log("Server is running on port " + port);
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD5.2 - HW1" });
});

let postData = [
  {
    id: 1,
    name: "Post1",
    author: "Author1",
    content: "This is the content of post 1",
    title: "Title1",
  },
  {
    id: 2,
    name: "Post2",
    author: "Author2",
    content: "This is the content of post 2",
    title: "Title2",
  },
  {
    id: 3,
    name: "Post3",
    author: "Author1",
    content: "This is the content of post 3",
    title: "Title3",
  },
];

// end point to see the db
app.get("/seed_db", async (req, res) => {
  try {
    // Synchronize the database, forcing it to recreate the tables if they already exist

    await sequelize_instance.sync({ force: true });
    // Bulk create entries in the book table using predefined data

    // self study
    /*
    capture the result of the bulkCreate method, which returns an array of the created instances
    */

    let insertedPost = await Post.bulkCreate(postData);
    // Send a 200 HTTP status code and a success message if the database is seeded successfully
    res.status(200).json({
      message: "Database Seeding successful",
      recordsInserted: insertedPost.length,
    }); // Displays the number of post inserted
  } catch (error) {
    // Send a 500 HTTP status code and an error message if there's an error during seeding

    console.log("Error in seeding db", error.message);
    return res.status(500).json({
      code: 500,
      message: "Error in seeding db",
      error: error.message,
    });
  }
});

/*
Exercise 1: Fetch all posts

Create an endpoint /posts that’ll return all the posts in the database.

Create a function named fetchAllPosts to query the database using the sequelize instance.

API Call

http://localhost:3000/posts

Expected Output:

{
  posts: [
    {
	  id: 1,
	  name: 'Post1',
	  content: 'This is the content of post 1',
    },
    // Rest of the posts in the database using same format
  ],
}
*/
//fucntion to fetch all posts
async function fetchAllPosts() {
  try {
    let allPosts = await Post.findAll();
    if (!allPosts || allPosts.length == 0) {
      throw new Error("No posts found");
    }
    return { posts: allPosts };
  } catch (error) {
    console.log("Error in fetching all posts", error.message);
    throw error;
  }
}

//endpoint to fetch all posts
app.get("/posts", async (req, res) => {
  try {
    let allPosts = await fetchAllPosts();
    return res.status(200).json(allPosts);
  } catch (error) {
    if (error.messaage === "No posts found") {
      return res.status(404).json({
        code: 404,
        message: "No posts found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in fetching all posts",
        error: error.message,
      });
    }
  }
});

/*
Exercise 2: Fetch post details by ID

Create an endpoint /posts/details/:id that’ll return post details based on the ID.

Declare a variable named id to store the path parameter passed by the user.

Create a function named fetchPostById to query the database using the sequelize instance.

API Call

http://localhost:3000/posts/details/2

Expected Output:

{
  'post': {
    'id': 2,
    'name': 'Post2',
    'author': 'Author2',
    'content': 'This is the content of post 2',
    'title': 'Title2'
  }
}


*/
//function to fetch post details by id
async function fetchPostById(id) {
  try {
    let post = await Post.findOne({ where: { id: id } });
    if (!post) {
      throw new Error("No post found");
    }
    return { post: post };
  } catch (error) {
    console.log("Error in fetching post by id", error.message);
    throw error;
  }
}
//endpoint to fetch post details by id
app.get("/posts/details/:id", async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let post = await fetchPostById(id);
    return res.status(200).json(post);
  } catch (error) {
    if (error.message === "No post found") {
      return res.status(404).json({
        code: 404,
        message: "No post found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in fetching post by id",
        error: error.message,
      });
    }
  }
});

/*
Exercise 3: Fetch all posts by an author

Create an endpoint /posts/author/:author that’ll return all the posts by an author.

Declare a variable named author to store the path parameter passed by the user.

Create a function named fetchPostsByAuthor to query the database using the sequelize instance.

API Call

http://localhost:3000/posts/author/Author1

Expected Output:

{
  posts: [
    {
      id: 1,
      name: 'Post1',
      author: 'Author1',
      content: 'This is the content of post 1',
      title: 'Title1'
    },
    {
      id: 3,
      name: 'Post3',
      author: 'Author1',
      content: 'This is the content of post 3',
      title: 'Title3'
    }
  ],
}
*/
//function to fetch post details by author
async function fetchPostsByAuthor(author) {
  try {
    let posts = await Post.findAll({ where: { author: author } });
    if (!posts || posts.length == 0) {
      throw new Error("No posts found");
    }
    return { posts: posts };
  } catch (error) {
    console.log("Error in fetching posts by author", error.message);
    throw error;
  }
}
//endpoint to fetch post details by author
app.get("/posts/author/:author", async (req, res) => {
  try {
    let author = req.params.author;
    let posts = await fetchPostsByAuthor(author);
    return res.status(200).json(posts);
  } catch (error) {
    if (error.message === "No posts found") {
      return res.status(404).json({
        code: 404,
        message: "No posts found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in fetching posts by author",
        error: error.message,
      });
    }
  }
});

/*
Exercise 4: Sort all the posts by their name

Create an endpoint /posts/sort/name that’ll return all the posts sorted by their name.

Declare a variable named order to store the query parameter passed by the user.

order can only hold asc OR desc.

Create a function named sortPostsByName to query the database using the sequelize instance.

API Call

http://localhost:3000/posts/sort/name?order=desc

Expected Output:

{
  posts: [
    {
      id: 3,
      name: 'Post3',
      author: 'Author1',
      content: 'This is the content of post 3',
      title: 'Title3'
    },
    {
      id: 2,
      name: 'Post2',
      author: 'Author2',
      content: 'This is the content of post 2',
      title: 'Title2'
    },
    {
      id: 1,
      name: 'Post1',
      author: 'Author1',
      content: 'This is the content of post 1',
      title: 'Title1'
    }
  ],
}
*/
//function to sort posts by name
async function sortPostsByName(order) {
  try {
    let posts = await Post.findAll({
      order: [["name", order]],
    });
    if (!posts || posts.length == 0) {
      throw new Error("No posts found");
    }
    return { posts: posts };
  } catch (error) {
    console.log("Error in sorting posts by name", error.message);
    throw error;
  }
}
//endpoint to sort posts by name
app.get("/posts/sort/name", async (req, res) => {
  try {
    let order = req.query.order;

    let posts = await sortPostsByName(order);
    return res.status(200).json(posts);
  } catch (error) {
    if (error.message === "No posts found") {
      return res.status(404).json({
        code: 404,
        message: "No posts found",
        error: error.message,
      });
    } else {
      return res.status(500).json({
        code: 500,
        message: "Error in sorting posts by name",
        error: error.message,
      });
    }
  }
});
