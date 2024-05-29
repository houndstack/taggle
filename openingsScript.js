//Initializing Variables
//var dailyArray = [];
var input = document.getElementById("guess");
var guesses = 0;
var correct = false;
var tags = [];
var season = [];
var score = [];
var studios = [];
var genres = [];
var popularity = [];
var names = [];
var answers = [];
var openingName = "";
var allAnime;
var opening;
var id;
var correctGuesses = 0;
var gameOver = false;
var modal = document.getElementById("myModal");
var gameType;
var now = new Date();
var time = Math.floor(now.getTime()/86400000)%356
var finalResult = false;

if(noneCheck(document.getElementById("dailyNav").getAttribute("class"))=="active"){gameType="daily";}
else if(noneCheck(document.getElementById("unlimitedNav").getAttribute("class"))=="active"){gameType="unlimited";}
else if(noneCheck(document.getElementById("openingNav").getAttribute("class"))=="active"){gameType="opening";}

if(getCookie("time")!=time){
  setCookie("dailyDone", 0, 365);
  setCookie("dailyResult", 0, 0);
}
setCookie("time", time, 365);
   
/*Fetch random list
fetch('./taggle/dailies.json')
  .then(response => response.json())
  .then(data => {
    dailyArray = data;
    console.log("why aint i first")
    console.log(dailyArray)
    
  })
  .catch(error => console.log(error));*/

//Generate random show and fetch necessary data
fetch('./taggle/allDataOpenings.json')
  .then(response => response.json())
  .then(allData => {
    allData = filtering(allData, gameType);
    console.log(allData.length);
    var index = Math.floor(Math.random() * allData.length);
    console.log("TIME" + time)
    //console.log(dailyArray);
    if(gameType=="daily"){index = dailyArray[time]; console.log("index: " + index)}
    console.log(typeof allData);
    console.log(allData);
    console.log("Index: " + index)
    console.log(allData[index]['tags'])
    for(var i = 0;i<Object.keys(allData[index]['tags']).length;i++){
      console.log("tatging")
      tags.push([allData[index]['tags'][i]['name'], allData[index]['tags'][i]['rank']]);
    }
    opening = allData[index]['opening']
    console.log(opening)
    console.log(tags)
    if(gameType=="opening"){postOpenings();}
    else{postTags();}
    id = allData[index]['id']
    openingName = allData[index]['openingTitle']
    if(allData[index]['openingArtist']!=""){
      openingName = openingName + ' - ' + allData[index]['openingArtist']
    }
    names = allData[index]['synonyms']
    names.push(allData[index]['title']['romaji'] + ' - ' + noneCheck(allData[index]['title']['english']) )
    for(var i = 0;i<names.length;i++){
        names[i] = names[i].toLowerCase();
    }
    if(allData[index]["season"]!=null){
      season = allData[index]["season"] + " " + allData[index]["seasonYear"];
    }
    score = allData[index]["averageScore"];
    for(var i = 0;i<allData[index]['studios']['edges'].length;i++){
      studios.push(allData[index]["studios"]['edges'][i]['node']['name']);
    }
    console.log(studios)
    genres = allData[index]["genres"];
    popularity = allData[index]["popularity"];
    answers.push(allData[index]['title']['romaji'])
    if(allData[index]['title']['english']!=null){answers.push(allData[index]['title']['english']);}
    if(getCookie("dailyDone")!="0"&&gameType=="daily"){
  if(getCookie("dailyResult")=="correct"){fin(true, answers[0], answers[1])}
  else{fin(false, answers[0], answers[1])}
}
  })
  .catch(error => console.log(error));

//Fetch list of possible answers
fetch('./taggle/allAnimeSequels.json')
  .then(response => response.json())
  .then(allAnime => {
    $.each(allAnime, function(i, p) {
      $('#submission').append($('<option></option>').val(p).html(p));
    });
  })
  .catch(error => console.log(error));




//Check if null
function noneCheck(value){
  if(value === null){
    return "";
  }  
  else{
    return value;
  }
}

//Populate the list of possible answers
function populate() {
  
  $.each(allAnime, function(i, p) {
      $('#submission').append($('<option></option>').val(p).html(p));
  });
}



// Submit guess if enter key is pressed
document.getElementById("guess").addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    console.log(correct)
    console.log(guesses)
    if (correct==false) {
      console.log("submitting")
      document.getElementById("submit").click();
      console.log("submitting")
    }
    else{
      document.getElementById("modalHeader").innerHTML = "LOADING...";
      console.log("resetting")
      document.getElementById("reset").click();
    }
    document.getElementById('guess').value = ''
  }
});

//Reloads the page when new game is pressed
function postData() {
  document.getElementById("modalHeader").innerHTML = "LOADING...";
  console.log("resetting")
  console.log("huh")
  window.top.location = window.top.location
  //$("html").load("/");

}

//Tags are displayed on screen
function postOpenings() {
  let addParagraph = document.createElement("ul");
  //document.getElementById("resultLeft").innerHTML = "";
  console.log("uo");
  console.log(tags)
  console.log(season)
  var audio = document.getElementById('audio');

  var source = document.getElementById('audioSource');
  source.src = opening;

  audio.load(); //call this to just preload the audio without playing
  audio.play(); //call this to play the song right away
  
}

function postTags() {
  let addParagraph = document.createElement("ul");
  document.getElementById("resultLeft").innerHTML = "";
  console.log("uo");
  console.log(tags)
  console.log(season)
  var tagString = ""
  for (var i = 0;i<tags.length;i++) {
    tagString = tagString.concat(tags[i][0] + " - " + tags[i][1] + "\n");
  };
  document.getElementById("resultLeft").innerHTML = tagString;
}

//Takes guess and runs checks
function guess() {
  console.log(correct + "HOLY SHIT")
  console.log("bruh")
  console.log(names)
  genreText = genretize(genres);
  console.log(typeof genreText)
  var guess = document.getElementById("guess").value;
  document.getElementById('guess').value = ''
  for(var i = 0;i<names.length;i++){
    if (guess.toLowerCase() == names[i]){
      correct = true;
      correctGuesses++;
      console.log("righyoo")
    }
    console.log(guess.toLowerCase())
    console.log(names[i])
  }
  console.log(correct + "DAMN SON")
  if(!gameOver){sec+=10; console.log(sec);}
  if(correct==true){
    finalResult = true;
    if(!gameOver&&gameType!="opening"){
      console.log("Incrementing Cookies");
      checkCookie(guesses+1)
      setCookie(guesses+1, parseInt(getCookie(guesses+1))+1, 365)
    }
    
    if(getCookie("dailyDone")=="0"&&gameType=="daily"){
      setCookie("dailyResult", "correct", 365);
      checkCookie("dailyDone");
      setCookie("dailyDone", 1, 365);
      console.log("DAILY COOKIES SET" + getCookie("dailyDone"))
    }
    
    console.log(correct); console.log("FUCK YOU"); fin(true, answers[0], answers[1])}
  else{guesses+=1;}
  switch(guesses) {
  case 0:
    break;
  case 1:
    document.getElementById("season").innerHTML = season + "\n";// + "\n\nGuess: " + guess;
    document.getElementById("wing").style.display = "block";
    document.getElementById("seasonTitle").style.display = "block";
    break;
  case 2:
    document.getElementById("score").innerHTML = score + "\n";// + "\n\nGuess: " + guess;
    document.getElementById("scoreTitle").style.display = "block";
    break;
  case 3:
    document.getElementById("popularity").innerHTML = popularity;// + "\n\nGuess: " + guess;
    document.getElementById("popularityTitle").style.display = "block";
    break;
  case 4:
    document.getElementById("genres").innerHTML = genreText + "\n";// + "\n\nGuess: " + guess;
    document.getElementById("wing2").style.display = "block";
    document.getElementById("genresTitle").style.display = "block";
    break;
  case 5:
    document.getElementById("studios").innerHTML = studios;// + "\n\nGuess: " + guess;
    document.getElementById("studiosTitle").style.display = "block";
    break;
  default:
    if(!gameOver&&gameType!="opening"){
      console.log("Incrementing Cookies");
      checkCookie(guesses+1)
      setCookie(guesses+1, parseInt(getCookie(guesses+1))+1, 365)
    }
    
    if(getCookie("dailyDone")=="0"&&gameType=="daily"){
      setCookie("dailyResult", "incorrect", 365);
      checkCookie("dailyDone");
      setCookie("dailyDone", 1, 365);
    }
    correct = true;
    fin(false, answers[0], answers[1]);
}
  
}

//Displays all clues on screen (for skips and early guesses)
function displayClues(){
  genreText = genretize(genres);
  console.log("Displaying Clues");
  console.log(season)
  document.getElementById("season").innerHTML = season + "\n";// + "\n\nGuess: " + guess;
    document.getElementById("wing").style.display = "block";
    document.getElementById("seasonTitle").style.display = "block";
    document.getElementById("score").innerHTML = score + "\n";// + "\n\nGuess: " + guess;
    document.getElementById("scoreTitle").style.display = "block";
    document.getElementById("popularity").innerHTML = popularity;// + "\n\nGuess: " + guess;
    document.getElementById("popularityTitle").style.display = "block";
    document.getElementById("genres").innerHTML = genreText + "\n";// + "\n\nGuess: " + guess;
    document.getElementById("wing2").style.display = "block";
    document.getElementById("genresTitle").style.display = "block";
    document.getElementById("studios").innerHTML = studios;// + "\n\nGuess: " + guess;
    document.getElementById("studiosTitle").style.display = "block";
}

//Concludes the current game
function fin(result, romaji, english){
  document.getElementById("guess").disabled = true; 
  console.log(result);
  console.log("Daily Result:" + getCookie("dailyResult"))
  clearInterval(timer);
  gameOver = true;
  if(gameType=="daily"&&getCookie("dailyDone")!="0"){
    if(getCookie("dailyResult")=="correct"){
      result = true;
    }
    else{result = false;}
  }
  displayClues();
  if(result){
    
    
    document.getElementById("modalHeader").innerHTML = "Correct!"
    changeCSS('green', 'modal-header', 'background-color');
    changeCSS('green', 'modal-footer', 'background-color');
  }
  else{
    
    document.getElementById("modalHeader").innerHTML = "Failed!";
    changeCSS('red', 'modal-header', 'background-color')
    changeCSS('red', 'modal-footer', 'background-color');
  }
  document.getElementById("answer").innerHTML = romaji + " - " + english;
  if(gameType=="opening"){document.getElementById("songAnswer").innerHTML = openingName;}
  var yourElement = document.getElementById('answer');
 yourElement.setAttribute('href', 'https://anilist.co/anime/' + id);
  
    if(gameType!="opening"){document.getElementById("correctGuesses").innerHTML = "Guess Distribution: \n1: " + getCookie(1) + "\n2: " + getCookie(2) + "\n3: " + getCookie(3) + "\n4: " + getCookie(4) + "\n5: " + getCookie(5) + "\n6: " + getCookie(6) + "\nFailed: " + getCookie(7);
}
  displayModal();
  console.log("rbuh")
  document.activeElement.blur();
}

//Changes the CSS value of a specified element
function changeCSS(color, element, value){
  var stylesheet = $('link#mainStyle')[0].sheet;
  let elementRules;
  console.log(stylesheet);
  // looping through all its rules and getting your rule
  for(let i = 0; i < stylesheet.cssRules.length; i++) {
    if(stylesheet.cssRules[i].selectorText === '.' + element) {
      elementRules = stylesheet.cssRules[i];
    }
  }
  
  // modifying the rule in the stylesheet
  console.log(elementRules);
  elementRules.style.setProperty(value, color);
  }

//Turns genres into a string
function genretize(genres){
  console.log(genres)
  var gen = ""
  gen = genres[Object.keys(genres)[0]];
  
  for(var i = 1;i<genres.length;i++){
    gen = gen.concat("\n"+genres[i]);
  }
  return gen;
}

//Skips current game
function skip(){
  if(!gameOver&&gameType!="opening"){
    checkCookie(7)
    setCookie(7, parseInt(getCookie(7))+1, 365)
  }
  
  if(getCookie("dailyDone")=="0"&&gameType=="daily"){
    setCookie("dailyResult", "incorrect", 365);
    checkCookie("dailyDone");
    setCookie("dailyDone", 1, 365);
  }
  fin(finalResult, answers[0], answers[1]);
  displayModal();
}

// Get the button that opens the modal
//var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
function displayModal() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  console.log(decodedCookie)
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  console.log("yo cookie dont exist")
  return "0";
}

function checkCookie(cname) {
  let key = getCookie(cname);
  if (key != "") {
   return true;
  } else {
      setCookie(cname, 0, 365);
      return false;
  }
}

function resetDistribution(){
  var retVal = confirm("Are you sure you want to reset your guess statistics?");
  if(retVal){
    setCookie(1, 0, 365);
    setCookie(2, 0, 365);
    setCookie(3, 0, 365);
    setCookie(4, 0, 365);
    setCookie(5, 0, 365);
    setCookie(6, 0, 365);
    setCookie(7, 0, 365);
    postData();
  }
}

var sec = 0;

function pad(val) {
    return val > 9 ? val : "0" + val;
}
var timer = setInterval(function () {
    if(gameType=="opening"){document.getElementById("seconds").innerHTML = pad(++sec % 60);
    document.getElementById("minutes").innerHTML = pad(parseInt(sec / 60, 10));}
}, 1000);

if(gameType!="daily"){document.getElementById('populationSlider').value = getCookie("threshold");}

$('#pops').text("Popularity Threshold: "+getCookie("threshold"));
sliderChange=function(n)
{
  var e=n;
  
  $('#pops').text("Popularity Threshold: "+e);
  setCookie("threshold", e, 365)
  console.log("Threshold: " + e)
}

function filtering(allData, gameType){
  if(gameType!="daily"){
    newData = []
    console.log(allData.length)
    for(var i = 0;i<allData.length;i++){
      if(allData[i]['popularity']>=getCookie("threshold")){
        newData.push(allData[i])
      }
    }
    console.log(newData.length)
    return newData
  }
  return allData;
}
