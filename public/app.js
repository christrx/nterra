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

var db = firebase.firestore();

function googleLogin(){
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)

        .then(result => {
            const user = result.user;

            

            console.log(user)
        })
        .catch(console.log)
};

function googleLogout(){
    firebase.auth().signOut().then(result =>{
        document.write("Sign Out Successful")


    }).catch(function(error){

});}

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