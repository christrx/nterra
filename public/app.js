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

function googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(function () {
            var user = firebase.auth().currentUser;
            window.location.href = 'pages/datenbankverwaltung.html';
        });
    console.log(user.displayName);

}

//Sign-out

function googleLogout() {
    firebase.auth().signOut();
}

//Initiate Firebase Auth

function initFirebaseAuth() {
    firebase.auth().onAuthStateChanged(authStateObserver);
}

//Returns true if User is signed-in

function isUserSignedIn() {
    return !!firebase.auth().currentUser;
}

//Returns User name
function getUserName() {
    return firebase.auth().currentUser.displayName;
}

//Triggers when the Auth State changes for instance when the user signs in or out

function authStateObserver(user) {
    console.log('Authi');
    if (user) {
        var username = getUserName();
        //TODO: profile pic und user name
        //TODO: SI button ausblenden SO button einblenden
        document.getElementById('lobutton').removeAttribute('hidden');
        document.getElementById('libutton').setAttribute('hidden', 'true');
        document.getElementById('username').style.display = 'inline';
        document.getElementById('username').textContent = username;
    }
    else {
        document.getElementById('libutton').removeAttribute('hidden');
        document.getElementById('lobutton').setAttribute('hidden', 'true');
        document.getElementById('username').setAttribute('hidden', 'true');
    }
}

//Test Kommentar

//Reference Firestore Database
var db = firebase.firestore();

//Reference Firmenwagen collection
var fahrzeugeRef = db.collection('Fahrzeuge');

document.getElementById('firmenwagen').addEventListener('click', changeFormFirm);

function changeFormFirm(e) {
    document.getElementsByClassName('üdatum')[0].style.visibility = 'hidden';
    document.getElementsByClassName('fklasse')[0].style.display = 'none';
    document.getElementsByClassName('vnummer')[0].style.display = 'block';
}

document.getElementById('mietwagen').addEventListener('click', changeFormMiet);

function changeFormMiet(e) {
    document.getElementsByClassName('üdatum')[0].style.visibility = 'visible';
    document.getElementsByClassName('fklasse')[0].style.display = 'block';
    document.getElementsByClassName('vnummer')[0].style.display = 'none';
}
// Listen for form submit
document.getElementById('carform').addEventListener('submit', submitForm);

// Submit Form
function submitForm(e) {
    e.preventDefault();

    //Get values
    if (getRadioValues() == "Firmenwagen") {
        var art = getRadioValues();
        var model = getInputValues('model');
        var kennzeichen = getInputValues('kennzeichen');
        var fahrer = getInputValues('fahrer');
        var blp = getInputValues('blp');
        var vnummer = getInputValues('vnummer');
        var zuzahlung = getInputValues('zuzahlung');

        // Save Firmenwagen

        saveFirmenwagen(art, model, kennzeichen, fahrer, blp, vnummer, zuzahlung);
    }
    else {
        var art = getRadioValues();
        var üdate = getInputValues('üdatum');
        var model = getInputValues('model');
        var kennzeichen = getInputValues('kennzeichen');
        var fahrer = getInputValues('fahrer');
        var blp = getInputValues('blp');
        var fklasse = getInputValues('fklasse');
        var zuzahlung = getInputValues('zuzahlung');

        saveMietwagen(art, üdate, model, kennzeichen, fahrer, blp, fklasse, zuzahlung);
    }

    // Show alert
    document.querySelector('.alert').style.display = 'block';

    // Hide alert after 3 seconds

    setTimeout(function () {
        document.querySelector('.alert').style.display = 'none';
    }, 3000);

    // Clear Document

    document.getElementById('carform').reset();

    // Reset the form fields

    resetCarform();

}

// Function to get form values
function getInputValues(id) {
    return document.getElementById(id).value;
}

// Function to get radio values
function getRadioValues() {
    return document.querySelector('input[name="fahrzeugart"]:checked').value;
}

// Save company car to firestore
function saveFirmenwagen(art, model, kennzeichen, fahrer, blp, vnummer, zuzahlung) {
    fahrzeugeRef.doc(kennzeichen).set({
        Fahrzeugart: art,
        Modell: model,
        Kennzeichen: kennzeichen,
        Fahrer: fahrer,
        Bruttolistenpreis: blp + " €",
        Versicherungsnummer: vnummer,
        Zuzahlung: zuzahlung + " €"
    });
}

function saveMietwagen(art, üdate, model, kennzeichen, fahrer, blp, fklasse, zuzahlung){
    fahrzeugeRef.doc(kennzeichen).set({
        Fahrzeugart: art,
        Modell: model,
        Kennzeichen: kennzeichen,
        Übergabedatum: üdate,
        Fahrer: fahrer,
        Bruttolistenpreis: blp + " €",
        Fahrzeugklasse: fklasse,
        Zuzahlung: zuzahlung + " €"
    })
}

// reset the fields

function resetCarform(){
    document.getElementsByClassName('üdatum')[0].style.visibility = 'hidden';
    document.getElementsByClassName('fklasse')[0].style.display = 'none';
    document.getElementsByClassName('vnummer')[0].style.display = 'block';
}

initFirebaseAuth();