// // To grab the articles as a json //
// $.getJSON("/articles", function(data){
//   // For each article //
//   for (var i = 0; i < data.length; i++){
//     // Now to display the information on the page //
//     $("#articles").append("<p data-id=" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>")
//   }
// });


// // When a p tag is clicked //
// $(document).on("click", "p", function() {
//   // We will first empty the notes from the note section //
//   $("#notes").empty();
//   var thisId = $(this).attr("data-id");

//   // We will now make an AJAX call for the Article //
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })

//   // Now we can add the note information to the page //
//   .then(function(data){
//     console.log(data);

//     // Article Title //
//     $("#notes").append("<h2>" + data.title + "<h2>");
//     // Input to enter new title
//     $("#notes").append("<input id='titleinput' name='title' >");
//     // Text area to add a new note // 
//     $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//     // A button to submit a new note, with the ID article saved to it
//     $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
//   // If there's currently a note in the article // 
//   if(data.note) {
//     // Put the note title in the in title input //
//     $("#titleinput").val(data.note.title);
//     //Place the body of the note in the body textarea //
//     $("#bodyinput").val(data.note.body);
//     }
//   });
// });

// // When the save note button is clicked //
// $(document).on("click", "#savenote", function() {
//   var thisId = $(this).attr("data-id");

//   // POST request to change the note, using the inputted data //
//   $.ajax({
//     method: "POST",
//     url: "/articles/" + thisId,
//     data: {
//       title: $("#titleinput").val(),
//       body: $("#bodyinput").val()
//     }
//   })

//   .then(function(data){
//     console.log(data);
//     $("#notes").empty();
//   });
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });


// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + this.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + this._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (this.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(this.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(this.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  event.preventDefault();
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
