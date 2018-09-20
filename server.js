//Dependencies//
var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars")
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");

//Intializing Express
var app = express();
var databaseUrl= "news";
var collections = ["posts"]

//Hooking mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error){
    console.log("Database Error:", error);
})

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
    // Find all results from the posts collection in the db
    db.posts.find({}, function(error, found) {
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
  
  // Scrape data from one site and place it into the mongodb db
  app.get("/scrape", function(req, res) {
    // Make a request for the data to be scraped
    request("https://sneakernews.com/", function(error, response, html) {
      // Load the html body from request into cheerio
      var $ = cheerio.load(html);
      // For each element with a "title" class
      $("h4").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        var title = $(element).children("a").text();
        var link = $(element).children("a").attr("href");
  
        // If this found element had both a title and a link
        if (title && link) {
          // Insert the data in the db
          db.posts.insert({
            title: title,
            link: link
          },
          function(err, inserted) {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            }
            else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
          });
        }
      });
    });
  
    // Send a "Scrape Complete" message to the browser
    res.send("Scrape Complete");
});
  // Listen on port 3000
  app.listen(3000, function() {
    console.log("App running on port 3000!");
  });