// Initialize Firebase
var config = {
    apiKey: "AIzaSyB3q1AjHKr1LguKsDgJAjKzfdouS71w-dY",
    authDomain: "nterra-fuhrpark.firebaseapp.com",
    databaseURL: "https://nterra-fuhrpark.firebaseio.com",
    projectId: "nterra-fuhrpark",
    storageBucket: "nterra-fuhrpark.appspot.com",
    messagingSenderId: "95164735355"
  };
  firebase.initializeApp(config);

//Sign-in to Google

function googleLogin(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(function(result){
        var user = result.user;
        console.log(user.displayName);
    })
}

//Sign-out

function googleLogout(){
    firebase.auth().signOut();
    console.log(user.displayName);
}

//Initiate Firebase Auth

function initFirebaseAuth(){
    firebase.auth().onAuthStateChanged(authStateObserver);
}

//Returns true if User is signed-in

function isUserSignedIn(){
    return !!firebase.auth().currentUser;
}

//Triggers when the Auth State changes for instance when the user signs in or out

function authStateObserver(user){
    if(user){
        //TODO: profile pic und user name
        //TODO: SI button ausblenden SO button einblenden
        getElementsByClassName("lobutton").removeAttribute("hidden");
        getElementsByClassName("libutton").syle.display = "hidden";
    }
    else{
    }
}



//Reference Firestore Database
  var db = firebase.firestore();

//Reference Firmenwagen collection
var firmenwagenRef = db.collection('Fahrzeuge');

// Listen for form submit
document.getElementById('carform').addEventListener('submit', submitForm)

// Submit Form
function submitForm(e){
    e.preventDefault();

     //Get values
     var model = getInputValues('model');
     var kennzeichen = getInputValues('kennzeichen');
     var fahrer = getInputValues('fahrer');
     var blp = getInputValues('blp');
     var vnummer = getInputValues('vnummer');
     var zuzahlung = getInputValues('zuzahlung');

     // Save Firmenwagen

     saveFirmenwagen(model,kennzeichen,fahrer,blp,vnummer,zuzahlung);

     // Show alert
     document.querySelector('.alert').style.display = 'block';

     // Hide alert after 3 seconds

     setTimeout(function(){
        document.querySelector('.alert').style.display = 'none';
     },3000);

     // Clear Document

     document.getElementById('carform').reset();

}

// Function to get form values
function getInputValues(id){
    return document.getElementById(id).value;
}

// Save car to firestore
function saveFirmenwagen(model,kennzeichen,fahrer,blp,vnummer,zuzahlung){
    firmenwagenRef.add({
        Modell: model,
        Kennzeichen: kennzeichen,
        Fahrer: fahrer,
        BLP: blp + " €",
        Versicherungsnummer: vnummer,
        Zuzahlung: zuzahlung + " €"
    });
}

initFirebaseAuth();