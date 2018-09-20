//Dependencies//
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars")
// var mongojs = require("mongojs");
// var request = require("request");
var axios = require("axios")
var cheerio = require("cheerio");
var mongoose = require("mongoose");

//Intializing Express
var app = express();

// //Hooking mongojs configuration to the db variable
// var databaseUrl= "news";
// var collections = ["posts"]
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error){
//     console.log("Database Error:", error);
// })

//Require all models
var db = require("./models");

// Connect to the Mongo DB
mongoose.connect("mongodb://127.0.0.1:27017/news", { useNewUrlParser: true });

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//Main route 

app.get("/", function(req, res){
    res.send("Welcome to Soley News");
});

// Retrieve data from the db
app.get("/all", function(req, res) {
    // Find all results from the post collection in the db
    db.Post.find({}, function(error, found) {
      // Throw any errors to the console
      if (error) {
        console.log(error);
      }
      // If there are no errors, send the data to the browser as json
      else {
        res.json(found);
      }
    });
  });

  app.get("/scrape", function(req, res){
      axios.get("http://sneakernews.com/")
      .then(function(response){

        var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("h4").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Post.create(result)
        .then(function(dbPost) {
          // View the added result in the console
          console.log(dbPost);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});
  

// Route for getting all Posts from the db
app.get("/articles", function(req, res) {
    // Grab every document in the Post collection
    db.Post.find({})
      .then(function(dbPost) {
          
        // If we were able to successfully find Posts, send them back to the client
        res.json(dbPost);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
//   // Scrape data from one site and place it into the mongodb db
//   app.get("/scrape", function(req, res) {
//     // Make a request for the data to be scraped
//     request("https://sneakernews.com/", function(error, response, html) {
//       // Load the html body from request into cheerio
//       var $ = cheerio.load(html);
//       // For each element with a "title" class
//       $("h4").each(function(i, element) {
//         // Save the text and href of each link enclosed in the current element
//         var title = $(element).children("a").text();
//         var link = $(element).children("a").attr("href");
  
//         // If this found element had both a title and a link
//         if (title && link) {
//           // Insert the data in the db
//           db.posts.insert({
//             title: title,
//             link: link
//           },
//           function(err, inserted) {
//             if (err) {
//               // Log the error if one is encountered during the query
//               console.log(err);
//             }
//             else {
//               // Otherwise, log the inserted data
//               console.log(inserted);
//             }
//           });
//         }
//       });
//     });
  
//     // Send a "Scrape Complete" message to the browser
//     res.send("Scrape Complete");
// });
  // Listen on port 3000
  app.listen(3000, function() {
    console.log("App running on port 3000!");
  });