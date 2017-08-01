  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCKWplt5rICZPTlJyiCPuG1ZmeStKvaokw",
    authDomain: "my-train-scheduler-eec70.firebaseapp.com",
    databaseURL: "https://my-train-scheduler-eec70.firebaseio.com",
    projectId: "my-train-scheduler-eec70",
    storageBucket: "",
    messagingSenderId: "194230330742"
  };
  firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
var database = firebase.database();
var trainName = "";
var trainDest = "";
var trainFTT = "";
var trainFreq = 0;

// Whenever a user clicks the add train button
$("#trainSubmit").on("click", function(event) {
  // Prevent form from submitting
  event.preventDefault();

  // Get users inputs
  var trainName = $("#trainName").val().trim();
  var trainDest = $("#trainDest").val().trim();
  var trainFTT = moment($("#trainFTT").val().trim(), "HH:mm").subtract(10, "years").format("X");
  var trainFreq = $("#trainFreq").val().trim();

  // Log the inputs 
  console.log(trainName);
  console.log(trainDest);
  console.log(trainFTT);
  console.log(trainFreq);

  // Local temporary object holding train data
  var newTrain = {
    name:  trainName,
    destination: trainDest,
    firstTrain: trainFTT,
    frequency: trainFreq
  }

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination); 
  console.log(trainFTT);
  console.log(newTrain.frequency)

  // Alert
  alert("Train successfully added");

  // Clears user-input fields
  $("#trainName").val("");
  $("#trainDest").val("");
  $("#trainFTT").val("");
  $("#trainFreq").val("");

  // Ends the on-click.
  return false;

});

// Create firebase event for adding trains to the database.
database.ref().on("child_added", function(childSnapshot, prevChildKey){

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var tName = childSnapshot.val().name;
  var tDestination = childSnapshot.val().destination;
  var tFrequency = childSnapshot.val().frequency;
  var tFirstTrain = childSnapshot.val().firstTrain;

  // Calculate the minutes remaining.
  var differenceTimes = moment().diff(moment.unix(tFirstTrain), "minutes");
  var tRemainder = moment().diff(moment.unix(tFirstTrain), "minutes") % tFrequency ;
  var tMinutes = tFrequency - tRemainder;

  // To calculate the arrival time, add remainder to the currrent time
  var tArrival = moment().add(tMinutes, "m").format("hh:mm A"); 
  console.log(tMinutes);
  console.log(tArrival);

  console.log(moment().format("hh:mm A"));
  console.log(tArrival);
  console.log(moment().format("X"));

  // Add each train's data into the table 
  $("#trainTable > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" + tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");

});
