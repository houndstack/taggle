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
//var allData;
var allAnime;
fetch('./taggle/allData.json')
  .then(response => response.json())
  .then(allData => {
    var index = Math.floor(Math.random() * 350);
    console.log(typeof allData);
    console.log(allData);
    console.log(allData[index]['tags'])
    for(var i = 0;i<Object.keys(allData[index]['tags']).length;i++){
      console.log("tatging")
      tags.push([allData[index]['tags'][i]['name'], allData[index]['tags'][i]['rank']]);
    }
    console.log(tags)
    postTags()
    names = allData[index]['synonyms']
    names.push(noneCheck(allData[index]['title']['english']) + ' - ' + allData[index]['title']['romaji'])
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
  })
  .catch(error => console.log(error));

fetch('./taggle/allAnime.json')
  .then(response => response.json())
  .then(allAnime => {
    $.each(allAnime, function(i, p) {
      $('#submission').append($('<option></option>').val(p).html(p));
    });
  })
  .catch(error => console.log(error));
console.log("aUHHH")
console.log(typeof allData)
//populate(submissions)
//$('#populator').click();

function noneCheck(value){
  if(value === null){
    return "";
  }  
  else{
    return value;
  }
}

function populate() {
  
  $.each(allAnime, function(i, p) {
      $('#submission').append($('<option></option>').val(p).html(p));
  });
}

// Execute a function when the user presses a key on the keyboard
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

function postData() {
  document.getElementById("modalHeader").innerHTML = "LOADING...";
  console.log("resetting")
  console.log("huh")
  $("html").load("/");

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
      console.log("righyoo")
    }
    console.log(guess.toLowerCase())
    console.log(names[i])
  }
  console.log(correct + "DAMN SON")
  if(correct==true){document.getElementById("result").innerHTML = "CORRECT\nGuesses Needed: " + guesses; console.log(correct); console.log("FUCK YOU"); fin(true, answers[0], answers[1])}
  else{guesses+=1; document.getElementById("result").innerHTML = "INCORRECT";}
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
    document.getElementById("result").innerHTML = "YER OUT\n" + answers;
    correct = true;
    fin(false, answers[0], answers[1]);
    // code block
}
  
}

function fin(result, romaji, english){
  if(result){
    document.getElementById("modalHeader").innerHTML = "Correct!"
    changeCSS('green', 'modal-header', 'background-color');
    changeCSS('green', 'modal-footer', 'background-color');
  }
  else{
    document.getElementById("modalHeader").innerHTML = "Failed!"
    changeCSS('red', 'modal-header', 'background-color')
    changeCSS('red', 'modal-footer', 'background-color');
  }
  document.getElementById("answer").innerHTML = "Correct Answer: " + romaji + " - " + english;
  displayModal();
  document.activeElement.blur();
}

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

function genretize(genres){
  console.log(genres)
  var gen = ""
  gen = genres[Object.keys(genres)[0]];
  
  for(var i = 1;i<genres.length;i++){
    gen = gen.concat("\n"+genres[i]);
  }
  return gen;
}
var modal = document.getElementById("myModal");

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