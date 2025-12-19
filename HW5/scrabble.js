/* File: script.js
Author: Katherine Tamayo
Email: katherine_tamayo@student.uml.edu
Date Created: December 18, 2025
Course: COMP 4610 - GUI Programming I
Assignment: HW 5: One-Line Scrabble Game
Instructor: Professor Wenjin Zhou
Description: This JavaScript file contains the game logic for a One-Line Scrabble game, including drag-and-drop functionality, score calculation, and dictionary validation with wildcard support.
SOURCES CITED:
1. Drag and Drop Logic inspired by: https://www.w3docs.com/learn-javascript/drag-and-drop-with-javascript.html
2. Scrabble data structure based on "Scrabble_Pieces_AssociativeArray_Jesse.js" by Jesse M. Heines
*/

// --- DATA STRUCTURE ---
var ScrabbleTiles = [];
ScrabbleTiles["A"] = {
  value: 1,
  "original-distribution": 9,
  "number-remaining": 9,
};
ScrabbleTiles["B"] = {
  value: 3,
  "original-distribution": 2,
  "number-remaining": 2,
};
ScrabbleTiles["C"] = {
  value: 3,
  "original-distribution": 2,
  "number-remaining": 2,
};
ScrabbleTiles["D"] = {
  value: 2,
  "original-distribution": 4,
  "number-remaining": 4,
};
ScrabbleTiles["E"] = {
  value: 1,
  "original-distribution": 12,
  "number-remaining": 12,
};
ScrabbleTiles["F"] = {
  value: 4,
  "original-distribution": 2,
  "number-remaining": 2,
};
ScrabbleTiles["G"] = {
  value: 2,
  "original-distribution": 3,
  "number-remaining": 3,
};
ScrabbleTiles["H"] = {
  value: 4,
  "original-distribution": 2,
  "number-remaining": 2,
};
ScrabbleTiles["I"] = {
  value: 1,
  "original-distribution": 9,
  "number-remaining": 9,
};
ScrabbleTiles["J"] = {
  value: 8,
  "original-distribution": 1,
  "number-remaining": 1,
};
ScrabbleTiles["K"] = {
  value: 5,
  "original-distribution": 1,
  "number-remaining": 1,
};
ScrabbleTiles["L"] = {
  value: 1,
  "original-distribution": 4,
  "number-remaining": 4,
};
ScrabbleTiles["M"] = {
  value: 3,
  "original-distribution": 2,
  "number-remaining": 2,
};
ScrabbleTiles["N"] = {
  value: 1,
  "original-distribution": 6,
  "number-remaining": 6,
};
ScrabbleTiles["O"] = {
  value: 1,
  "original-distribution": 8,
  "number-remaining": 8,
};
ScrabbleTiles["P"] = {
  value: 3,
  "original-distribution": 2,
  "number-remaining": 2,
};
ScrabbleTiles["Q"] = {
  value: 10,
  "original-distribution": 1,
  "number-remaining": 1,
};
ScrabbleTiles["R"] = {
  value: 1,
  "original-distribution": 6,
  "number-remaining": 6,
};
ScrabbleTiles["S"] = {
  value: 1,
  "original-distribution": 4,
  "number-remaining": 4,
};
ScrabbleTiles["T"] = {
  value: 1,
  "original-distribution": 6,
  "number-remaining": 6,
};
ScrabbleTiles["U"] = {
  value: 1,
  "original-distribution": 4,
  "number-remaining": 4,
};
ScrabbleTiles["V"] = {
  value: 4,
  "original-distribution": 2,
  "number-remaining": 2,
};
ScrabbleTiles["W"] = {
  value: 4,
  "original-distribution": 2,
  "number-remaining": 2,
};
ScrabbleTiles["X"] = {
  value: 8,
  "original-distribution": 1,
  "number-remaining": 1,
};
ScrabbleTiles["Y"] = {
  value: 4,
  "original-distribution": 2,
  "number-remaining": 2,
};
ScrabbleTiles["Z"] = {
  value: 10,
  "original-distribution": 1,
  "number-remaining": 1,
};
ScrabbleTiles["_"] = {
  value: 0,
  "original-distribution": 2,
  "number-remaining": 2,
};

// Global Game State
var scrabbleBag = [];
var totalScore = 0;
// Dictionary: Use a Set for fast lookup
var dictionary = new Set();
var isDictionaryLoaded = false;

// --- GAME INITIALIZATION ---
$(function () {
  // 1. Initialize the Game
  initGame();

  // 2. Setup Buttons
  $("#restart-btn").click(restartGame);
  $("#next-word-btn").click(playWord);
});

// Initializes the game by creating the bag, loading the dictionary, and dealing initial tiles
function initGame() {
    // 1. Create the Bag
    createBag();
    // 2. Load the Dictionary
    loadDictionary();
    // 3. Deal Initial Tiles
  dealTiles();
}

// Loads the dictionary from a text file and populates a Set for fast lookup
function loadDictionary() {
  // Reads dictionary.txt from your root folder
  $.get("dictionary.txt", function (textData) {
    // Split file by new lines
    var words = textData.split("\n");

    // Add each word to the Set (UPPERCASE for easy matching)
    words.forEach(function (word) {
      dictionary.add(word.trim().toUpperCase());
    });

    isDictionaryLoaded = true;
    console.log("Dictionary loaded. Total words: " + dictionary.size);
  }).fail(function () {
    console.warn("Could not load dictionary.txt. Validation disabled.");
    $("#message-area").text(
      "Note: dictionary.txt not found. Word validation is disabled."
    );
  });
}

// Creates the Scrabble bag with all tiles according to the original distribution
function createBag() {
  scrabbleBag = [];
  for (var letter in ScrabbleTiles) {
    if (ScrabbleTiles.hasOwnProperty(letter)) {
      var details = ScrabbleTiles[letter];
      var amount = details["original-distribution"];
      for (var i = 0; i < amount; i++) {
        var fileNameChar = letter === "_" ? "Blank" : letter;
        scrabbleBag.push({
          letter: letter,
          value: details.value,
          image:
            "graphics_data/Scrabble_Tiles/Scrabble_Tile_" +
            fileNameChar +
            ".jpg",
        });
      }
    }
  }
  scrabbleBag.sort(() => Math.random() - 0.5);
}

// Deals tiles from the bag to the player's rack
function dealTiles() {
  var currentTiles = $("#rack .tile").length;
  var tilesNeeded = 7 - currentTiles;

  for (var i = 0; i < tilesNeeded; i++) {
    if (scrabbleBag.length === 0) {
      $("#message-area").text("Bag is empty!");
      break;
    }

    var piece = scrabbleBag.pop();
    var tileImg = $('<img class="tile">');
    tileImg.attr("src", piece.image);
    tileImg.attr("data-letter", piece.letter);
    tileImg.attr("data-value", piece.value);
    tileImg.attr("id", "tile-" + Math.random().toString(36).substr(2, 9));

    $("#rack").append(tileImg);
  }
  enableDragAndDrop();
}

/* * enableDragAndDrop()
 * Implements draggable and droppable functionality.
 * Concept adapted from: https://www.w3docs.com/learn-javascript/drag-and-drop-with-javascript.html
 */
function enableDragAndDrop() {
  $(".tile").draggable({
    revert: "invalid",
    stack: ".tile",
    start: function () {
      $(this).css("z-index", 1000);
    },
  });

  $(".board-slot").droppable({
    accept: ".tile",
    drop: function (event, ui) {
      var droppedTile = ui.draggable;
      var slot = $(this);

      if (slot.children().length > 0) {
        ui.draggable.draggable("option", "revert", true);
        return;
      }

      droppedTile.css({ top: 0, left: 0, position: "relative" }).appendTo(slot);
      calculateScore();
      $("#message-area").text("");
    },
  });

  $("#rack").droppable({
    accept: ".tile",
    drop: function (event, ui) {
      var droppedTile = ui.draggable;
      droppedTile
        .css({ top: 0, left: 0, position: "relative" })
        .appendTo($("#rack"));
      calculateScore();
    },
  });
}

// Calculates the score of the word on the board
function calculateScore() {
  var roundScore = 0;
  var wordMultiplier = 1;

  $(".board-slot").each(function () {
    var slot = $(this);
    var bonus = slot.attr("data-bonus");
    if (slot.find(".tile").length > 0) {
      var tile = slot.find(".tile");
      var letterVal = parseInt(tile.attr("data-value"));

      if (bonus === "double-letter") roundScore += letterVal * 2;
      else roundScore += letterVal;

      if (bonus === "double-word") wordMultiplier *= 2;
    }
  });

  var currentTotal = roundScore * wordMultiplier;
  $("#score").text(currentTotal);
  return currentTotal;
}

// Checks if the tiles on the board form a contiguous word
function isWordContiguous() {
  var firstIndex = -1;
  var lastIndex = -1;
  var tileCount = 0;

  $(".board-slot").each(function (index) {
    if ($(this).children(".tile").length > 0) {
      if (firstIndex === -1) firstIndex = index;
      lastIndex = index;
      tileCount++;
    }
  });

  if (tileCount === 0) return true;

  // Span from first to last tile must match the number of tiles (no gaps)
  var span = lastIndex - firstIndex + 1;
  return span === tileCount;
}

// Plays the word on the board, validates it, and updates the score
function playWord() {
  // Helper to set message with class
  function showMessage(msg, isError) {
    var area = $("#message-area");
    area.text(msg);
    if (isError) {
      area.removeClass("success-msg").addClass("error-msg");
    } else {
      area.removeClass("error-msg").addClass("success-msg");
    }
  }

  // 1. Check if board has tiles
  if ($(".board-slot .tile").length === 0) {
    showMessage("Please place tiles on the board first.", true);
    return;
  }

  // 2. CHECK: Is the word separated?
  if (!isWordContiguous()) {
    showMessage(
      "Error: Word cannot be separated! Please close the gaps.",
      true
    );
    return;
  }

  // 3. Dictionary Validation with Wildcard Support
  if (isDictionaryLoaded) {
    var wordString = "";
    $(".board-slot").each(function () {
      if ($(this).children(".tile").length > 0) {
        wordString += $(this).children(".tile").attr("data-letter");
      }
    });

    if (!checkDictionaryWithWildcards(wordString.toUpperCase())) {
      showMessage(
        "Invalid Word: '" + wordString + "' is not in the dictionary.",
        true
      );
      return;
    }
  }

  // 4. Success!
  var roundPoints = calculateScore();
  totalScore += roundPoints;

  // Clear the board
  $(".board-slot").empty();

  // Deal new tiles
  dealTiles();

  // Update Score
  $("#score").text(totalScore);

  // Show Success Message (Green)
  showMessage("Word Accepted! Added " + roundPoints + " points.", false);
}

// Checks if a word with wildcards matches any word in the dictionary
function checkDictionaryWithWildcards(wordPattern) {
  // Base Case: If no blanks left, check the dictionary directly
  if (!wordPattern.includes("_")) {
    return dictionary.has(wordPattern);
  }

  // Recursive Step: Replace the first '_' with A-Z and check again
  var index = wordPattern.indexOf("_");
  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (var i = 0; i < alphabet.length; i++) {
    var letter = alphabet[i];
    // Replace the first underscore with the current letter
    var newPattern =
      wordPattern.substring(0, index) +
      letter +
      wordPattern.substring(index + 1);

    // Check if this new pattern works (recursively handles multiple blanks)
    if (checkDictionaryWithWildcards(newPattern)) {
      return true; // Found a match!
    }
  }

  // If we tried all letters and found no match
  return false;
}

// Restarts the game by resetting the board, rack, and score
function restartGame() {
  $(".board-slot").empty();
  $("#rack").empty();
  $("#score").text("0");

  // Reset message and remove formatting classes
  $("#message-area").text("").removeClass("error-msg success-msg");

  totalScore = 0;

  createBag();
  dealTiles();
}
