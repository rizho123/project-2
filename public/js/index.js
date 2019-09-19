// Get references to page elements
var $cardSearch = $("#search_cards");
var $exampleDescription = $("#example-description");
var $submitBtn = $("#submit");
var $exampleList = $("#example-list");

// The API object contains methods for each kind of request we'll make
var API = {
  saveExample: function(example) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/examples",
      data: JSON.stringify(example)
    });
  },
  getExamples: function() {
    return $.ajax({
      url: "api/examples",
      type: "GET"
    });
  },
  deleteExample: function(id) {
    return $.ajax({
      url: "api/examples/" + id,
      type: "DELETE"
    });
  }
};

// refreshExamples gets new examples from the db and repopulates the list
var refreshExamples = function() {
  API.getExamples().then(function(data) {
    var $examples = data.map(function(example) {
      var $a = $("<a>")
        .text(example.text)
        .attr("href", "/example/" + example.id);

      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": example.id
        })
        .append($a);

      var $button = $("<button>")
        .addClass("btn btn-danger float-right delete")
        .text("ｘ");

      $li.append($button);

      return $li;
    });

    $exampleList.empty();
    $exampleList.append($examples);
  });
};

// handleFormSubmit is called whenever we submit a new example
// Save the new example to the db and refresh the list
var handleFormSubmit = function(event) {
  event.preventDefault();

  var example = {
    text: $exampleText.val().trim(),
    description: $exampleDescription.val().trim()
  };

  var results = {
    text: $cardSearch.val().trim(),
    color: ["W", "G", "R", "B", "U"]
  };

  if (!(example.text && example.description)) {
    alert("You must enter an example text and description!");
    return;
  }

  if (!results.text) {
    alert("Please enter a card name!");
    return;
  }

  API.saveExample(example).then(function() {
    refreshExamples();
  });

  API.getCards(results).then(function() {
    searchResults();
  });

  $exampleText.val("");
  $exampleDescription.val("");
};

// handleDeleteBtnClick is called when an example's delete button is clicked
// Remove the example from the db and refresh the list
var handleDeleteBtnClick = function() {
  var idToDelete = $(this)
    .parent()
    .attr("data-id");

  API.deleteExample(idToDelete).then(function() {
    refreshExamples();
  });
};

// Add event listeners to the submit and delete buttons
$submitBtn.on("click", handleFormSubmit);
$exampleList.on("click", ".delete", handleDeleteBtnClick);

// LAZYLOAD //
// May or may not load all images

// var $imgs = $('img.lazy');
// var $container = $('.availableCardsContainer');
// var $window = $(window);

// $imgs.lazyload({
//     failure_limit : Math.max($imgs.length-1, 0)
// });

$("img.lazy").lazyload({
  effect: "fadeIn",
  container: $(".availableCardsContainer")
});

// FILTER

var $filterButtons = $(".filterButtons").click(function() {
  if (this.id == "all") {
    $(".cardsHolder > div").fadeIn(450);
  } else {
    console.log(this.id);
    var filter = "." + this.id;
    console.log(filter);
    $(".cardsHolder > div").hide();
    $(".cardsHolder")
      .find("." + this.id)
      .fadeIn(450);
  }
});

$(".clearB").on("click", function() {
  $("#search_cards").val("");
  $(".cardsHolder > div").fadeIn(450);
});

function hovered() {
  $(".hoverimage").addClass("hoveredimage");
}

function unhovered() {
  $(".hoverimage").removeClass("hoveredimage");
}

$(document).mousemove(function(e) {
  $(".hoveredimage").offset({ left: event.pageX, top: event.pageY + 20 });
});

$(document).ready(function() {
  $("#search_cards").on("keyup", function() {
    var value = $(this)
      .val()
      .toLowerCase();
    console.log(value);
    $(".cardsHolder > div").hide();
    $(".cardsHolder > div")
      .filter(function() {
        return this.className.match(value);
      })
      .fadeIn(450);
  });
});
