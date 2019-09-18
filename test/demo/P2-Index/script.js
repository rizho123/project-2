// May or may not load all images

// var $imgs = $('img.lazy');
// var $container = $('.availableCardsContainer');
// var $window = $(window);

// $imgs.lazyload({
//     failure_limit : Math.max($imgs.length-1, 0)
// });

$("img.lazy").lazyload({         
    effect : "fadeIn",
    container: $(".availableCardsContainer")
});

var $filterButtons = $(".filterButtons").click(function() {
    if (this.id == "all") {
      $(".cardsHolder > div").fadeIn(450);
    } else {
      console.log(this.id)  
      var filter = "." + this.id;
      console.log(filter)
      $(".cardsHolder > div").hide();  
      $(".cardsHolder").find("." + this.id).fadeIn(450);
    }
  })

  $(".clearB").on("click", function() {
      $("#search_cards").val("");
      $(".cardsHolder > div").fadeIn(450)
  })

  function hovered() {
      $(".hoverimage").addClass("hoveredimage")
  }

  function unhovered() {
      $(".hoverimage").removeClass("hoveredimage")
  }

  $(document).mousemove(function(e) {
    $(".hoveredimage").offset({"left": event.pageX, "top": event.pageY + 20});
  });

  $(document).ready(function() {
      $("#search_cards").on("keyup", function() {
          var value = $(this).val().toLowerCase();
          console.log(value)
          $(".cardsHolder > div").hide()
          $(".cardsHolder > div").filter(function () {
            return this.className.match(value);
        }).fadeIn(450);
      })
  })

  