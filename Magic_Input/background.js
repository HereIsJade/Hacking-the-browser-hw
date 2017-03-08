// Initialize Firebase
var config = {
    apiKey: "AIzaSyA5cShEwD6YEBWFLibD5t9gQlZKrJ09Zn4",
    authDomain: "myextension-bf3dc.firebaseapp.com",
    databaseURL: "https://myextension-bf3dc.firebaseio.com",
    storageBucket: "myextension-bf3dc.appspot.com",
    messagingSenderId: "1078955169253"
};

firebase.initializeApp(config);

var userId;
var userByIdRefName;
var userByIdRef;
var activeTabUrl;
var collectionRef;
var userData=[];

function fuzzySearch(searchTerm,callback){
  var options = {
    include: ["score"],
    shouldSort: true,
    threshold: 0.45,
    location: 0,
    distance: 200,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["thoughts"]
  };
  var fuse = new Fuse(userData, options);
  //*****further modification: regular exp to match more delimiters
  var terms=searchTerm.split(/[ ,]+/).filter(Boolean);
  var results=[];
  terms.forEach((item,index)=>{
    var resultsByTerm = fuse.search(searchTerm);
    console.log('result for ',item,resultsByTerm);
    resultsByTerm.forEach((obj,rIndex)=>{
      results.push(obj.item.tabUrl);
    });
  });

  //reduce repetitive urls
  var resultSet = new Set(results);
  for (value of resultSet) {
    console.log(value);
  }
  callback(resultSet);
}

function writeData(Id, currentTabUrl, inputThoughts){
  userByIdRefName='Users/'+'ID_'+userId;
  userByIdRef = firebase.database().ref(userByIdRefName);
  userByIdRef.set({
    // user: Id,
    tabUrl: currentTabUrl,
    thoughts: inputThoughts
  });
  userByIdRef.on('value',gotData,errData);
}

function writeCollection(){
  collectionRef = firebase.database().ref('Collection');
  var allUserRef = firebase.database().ref("Users");

  allUserRef.once('value').then(function(snapshot) {
    var allUser = snapshot.val();
    console.log(allUser);
    var keys=Object.keys(allUser);

    //*********modification: now it's pushing data whenever submitted, including old data
    //maybe put inside onMessage, when user submits new data, push to userData --solution: change for loop starting index
    //retrieve each user's data
    //could be optimized, using DFS or something?
    for(var i=0;i<keys.length;i++){
      var id =keys[i];
      var url= allUser[id].tabUrl;
      var texts=allUser[id].thoughts;
      var userByIdObj={
        userId:id,
        tabUrl: url,
        thoughts: texts
      }
      userData.push(userByIdObj);
    }
  });
  console.log('userData',userData,'length',userData.length,typeof(userData));
  collectionRef.set({
    // data: [{a:1,v:2},{d:3}]
    data:userData
  });
  console.log("collectionRef built");
  console.log(collectionRef);
}

function gotData(data){
	var users=data.val();
  // console.log(users.tabUrl,users.thoughts);
}
function errData(err){
	console.log("Error!");
}

var submitRefName = 'submitCount';

// Creates a firebase value watcher.
// The callback gets called every time the click count changes
function watchClickCount(callback) {
  var clickCountRef = firebase.database().ref(submitRefName);
  clickCountRef.on('value', function(snapshot) {
    var value = snapshot.val();
    if (value === null) {
      value = { count: 0 };
    }
    // console.log('watched value:',value);
    callback(value);
  });
}

// Set up the watcher. Give it a callback that updates the browser
// badge text whenever the count changes
watchClickCount(function(value) {
  var countString = '' + value.count;
  chrome.browserAction.setBadgeText({text: countString});
  if (value.count > 9999) {
    resetCount();
  }
});

function resetCount() {
  writeClickCount(0);
}

// Reads the click count one time.
// This is used to figure out the current count before incrementing it.
function readClickCountOnce(callback) {
  var clickCountRef = firebase.database().ref(submitRefName);
  clickCountRef.once('value').then(function(snapshot) {
    var value = snapshot.val();
    if (value === null) {
      value = { count: 0 };
    }
    callback(value);
  });
}

function writeClickCount(int) {
  console.log('setting click count to:',int);
  var clickCountRef = firebase.database().ref(submitRefName);
  userId=int;
  clickCountRef.set({count: int});
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting !== ""){
      readClickCountOnce(function(value) {
        console.log('submitted ->',value.count);
        writeClickCount(value.count + 1);
        chrome.tabs.query({active: true, currentWindow: true}, function(arrayOfTabs) {
           // since only one tab should be active and in the current window at once
           // the return variable should only have one entry
           activeTabUrl = arrayOfTabs[0].url;
           writeData(userId,activeTabUrl,request.greeting);
           writeCollection();
        });
      });

      fuzzySearch(request.greeting,(urlSet)=>{
        //*******BUG******???weird...why can't I access global variable activeTabUrl
        //console.log("activeTabUrl",activeTabUrl);
        //********modification:add if (activeTabUrl!==value) create tab
        console.log("entered callback");
        for (value of urlSet) {
          console.log(value);
          chrome.tabs.create({url: value});
        }
      });
      sendResponse({
        msg: "Enjoy your new tabs!"
      });
    }
  });
