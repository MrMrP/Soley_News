var express = require("express");
var mongoose = require("mongoose");


// Scraping Tools //
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models //
var db = require("./models");
var PORT = 3000;

// Initializing Express //
var app = express();

// Parse requests body as JSON //
app.use(express.urlencoded({ extend: true}));
app.use(express.json());

// Make public a static folder //
app.use(express.static("public"));

//Connection to the Mongo DB //
// Reminder to change once deployed via Heroku //
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/news";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// mongoose.connect("mongodb://127.0.0.1:27017/news", { useNewURlParser: true
// });

// Routing //
// Scraping the sneakernews website //
app.get("/scrape", function(req, res){
  axios.get("http://www.sneakernews.com/").then(function(response){
    var $ = cheerio.load(response.data);
    $("h4").each(function(i, element){
      // Save an empy results object //
      var result = {};

      // Now to add the href link and text, for every link scraped, and saved them as properties of the result object //
      result.title = $(this)
      .children("a")
      .text();
      result.link = $(this)
      .children("a")
      .attr("href");

      // Now to create a new Article using the news properites (pushed into the array) from scraping //

      db.Article.create(result)
      .then(function(dbArticle){
        console.log(dbArticle)
      })
      .catch(function(err){
        return res.json(err)
      });
    });

    // If scraping and saving an Article was successful, the client will receive the below message //
    res.send("Scrape Complete")
  });
});


// Route to pull all Articles from the db //
app.get("/articles", function(req, res){
  db.Article.find({})
  .then(function(dbArticle){
    //Once articles are found send to the client //
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

// Route for grabbing a specific Artilce by id and adding it's attached note //
app.get("/articles/:id", function(req, res){
  db.Article.findOne({ _id: req.param.id})
  // to populate the html //
  .populate("note")
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

// Route for saving/updapting an Articles Note //
app.post("/articles/:id", function(req, res){
  db.Note.create(req.body)
  .then(function(dbNote){
    return db.Article.findOneAndUpdate({ _id: req.param.id}, { note: dbNote._id }, { new: true});
  })
  .then(function(dbArticle){
    res.json(dbArticle);
  })
  .catch(function(err){
    res.json(err);
  });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
})