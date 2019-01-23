$(document).ready(function () {

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDb9kXFLdGmbLfMZjmBwuTPvFSkKXoTREY",
    authDomain: "nw-demo-2.firebaseapp.com",
    databaseURL: "https://nw-demo-2.firebaseio.com",
    projectId: "nw-demo-2",
    storageBucket: "",
    messagingSenderId: "283415403641"
  };

  firebase.initializeApp(config);

  // Create a variable to reference the database.
  var database = firebase.database();



  // -------------------------------------------
  // Button for adding train
  $("#add-train").on("click", function (event) {
    event.preventDefault();

    // Get the input values
    var trainName = $("#train-name-input").val().trim();
    var trainDest = $("#destination-input").val().trim();
    var trainTime = $("#time-input").val().trim();
    var trainFreq = $("#freq-input").val().trim();

    console.log(trainTime);

    // Save the new train data in Firebase
    database.ref("/trainData").push({
      trainName: trainName,
      trainDest: trainDest,
      trainTime: trainTime,
      trainFreq: trainFreq
    });

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#freq-input").val("");

  });


  // -------------------------------------------
  // Firebase event for adding train to the database and to html page
  database.ref("/trainData").on("child_added", function (snapshot) {

    var newData = snapshot.val()
    console.log(newData);

    // Store data to vars
    trainName = newData.trainName;
    trainDest = newData.trainDest;
    trainTime = newData.trainTime;
    // assume input is in minutes
    trainFreq = newData.trainFreq;

    // convert time input to unix timestamp
    trainTime = moment(trainTime, "HH:mm").format("X");

    // Calculate minutes away and next arrival
    var currentTime = moment();
    // difference between current time and first train time in minutes
    var diffTime = currentTime.diff(moment(trainTime, "X"), "minutes");
    var minsPassed = diffTime % trainFreq;

    var minsAway = trainFreq - minsPassed;
    var nextArrival = currentTime.add(minsAway, "m").format("hh:mm A");

    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(trainDest),
      $("<td>").text(trainFreq),
      $("<td>").text(nextArrival),
      $("<td>").text(minsAway)
    );

    // Append the new row to the table
    $("#train-table > tbody").append(newRow);

    // If any errors are experienced, log them to console.
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

});
