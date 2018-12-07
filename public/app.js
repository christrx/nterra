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

// Sign-in to Google
function googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(){
        var user = firebase.auth().currentUser;
        window.location.hash = "home";
    })
}

// Sign-out
function googleLogout() {
    firebase.auth().signOut();
}

// Initiate Firebase Auth
function initFirebaseAuth() {
    firebase.auth().onAuthStateChanged(authStateObserver);
}

// Returns true if User is signed-in
function isUserSignedIn() {
    return !!firebase.auth().currentUser;
}

// Returns User name
function getUserName() {
    return firebase.auth().currentUser.displayName;
}

// Returns user pic
function getUserPicUrl() {
    return firebase.auth().currentUser.photoURL;
}

// Triggers when the Auth State changes for instance when the user signs in or out
function authStateObserver(user) {
    console.log('hi');
    if (user) {
        var username = getUserName();
        var userPicUrl = getUserPicUrl();

        document.getElementById('username').textContent = username;
        document.getElementById('userpic').style.backgroundImage = 'url(' + userPicUrl + ')';

        document.getElementById('libutton').style.display = 'none';
        document.getElementById('lobutton').style.display = 'inline';
        document.getElementById('userpic').style.display = 'inline-block';
        document.getElementById('username').style.display = 'inline';
    }
    else {
        document.getElementById('libutton').style.display = 'inline';
        document.getElementById('lobutton').style.display = 'none';
        document.getElementById('username').style.display = 'none';
        document.getElementById('userpic').style.display = 'none';
        hideAllPages();
        window.location.hash = "welcome";
    }
}
// TODO: Funktion, die bei angeklicktem Datensatz Codewort + ID des Datensatzes als hash setzt

// Triggers when the windows hash value changes and updates the ui accordingly
window.onhashchange = function() {
    hideAllPages();
    var currentHash = window.location.hash;
    if(!firebase.auth().currentUser){
        currentHash = "#welcome";
    }
    if(currentHash == '#home'){
        document.getElementsByClassName('home')[0].style.display = 'grid';
    }
    else if(currentHash == '#fahrzeuge'){
        document.getElementsByClassName('fahrzeuge')[0].style.display = 'grid';
    }
    else if(currentHash == '#fuehrerschein'){
        document.getElementsByClassName('fuehrerschein')[0].style.display = 'grid';
    }
    else if(currentHash == '#datenbank'){
        document.getElementsByClassName('datenbank')[0].style.display = 'grid';
    }
    else if(currentHash == '#welcome'){
        return;
    }
    else{
        document.getElementsByClassName('error')[0].style.display = 'grid';
    }
};

// Sets the windows hash value according to which button is pressed in the bavigation bar
function setHash(page) {
    if (!isUserSignedIn()) {
        // Show alert
        document.querySelector('.useralert').style.display = 'block';

        // Hide alert after 3 seconds
        setTimeout(function () {
            document.querySelector('.useralert').style.display = 'none';
        }, 5000);
        return;
    }
    else {
        window.location.hash = page;
    }
}

// Hides all pages
function hideAllPages(){
    var pages = document.getElementsByClassName("page")
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
}
// Reference Firestore Database
var db = firebase.firestore();

// Reference Firmenwagen collection
var fahrzeugeRef = db.collection('Fahrzeuge');

// Listen for click on the form radio buttons
document.getElementById('firmenwagen').addEventListener('click', changeFormFirm);

// Updates the form if the Firmenwagen radio is clicked
function changeFormFirm(e) {
    document.getElementsByClassName('uedatum')[0].style.visibility = 'hidden';
    document.getElementsByClassName('fklasse')[0].style.display = 'none';
    document.getElementsByClassName('vnummer')[0].style.display = 'block';
    document.getElementsByClassName('vdaten')[0].style.display = 'block';
    document.getElementsByClassName('cnummer')[0].style.display = 'block';
    document.getElementsByClassName('cende')[0].style.display = 'block';
    document.getElementsByClassName('mileage')[0].style.display = 'block';
    document.getElementsByClassName('odatum')[0].style.display = 'block';
}

// Listen for click on the form radio buttons
document.getElementById('mietwagen').addEventListener('click', changeFormMiet);

// Updates the form if the Mietwagen radio is clicked
function changeFormMiet(e) {
    document.getElementsByClassName('uedatum')[0].style.visibility = 'visible';
    document.getElementsByClassName('fklasse')[0].style.display = 'block';
    document.getElementsByClassName('vnummer')[0].style.display = 'none';
    document.getElementsByClassName('vdaten')[0].style.display = 'none';
    document.getElementsByClassName('cnummer')[0].style.display = 'none';
    document.getElementsByClassName('cende')[0].style.display = 'none';
    document.getElementsByClassName('mileage')[0].style.display = 'none';
    document.getElementsByClassName('odatum')[0].style.display = 'none';
}

// Listen for form submit
document.getElementById('carform').addEventListener('submit', submitForm);

// Submit Form
function submitForm(e) {
    e.preventDefault();

    // Get values of the input fields
    if (getRadioValues() == "Firmenwagen") {
        var art = getRadioValues();
        var model = getInputValues('model');
        var kennzeichen = getInputValues('kennzeichen');
        var fahrer = getInputValues('fahrer');
        var blp = getInputValues('blp');
        var vnummer = getInputValues('vnummer');
        var zuzahlung = getInputValues('zuzahlung');
        var odatum = getInputValues('odatum');
        var mileage = getInputValues('mileage');
        var cende = getInputValues('cende');
        var cnummer = getInputValues('cnummer');

        // Save Firmenwagen to the database
        saveFirmenwagen(art, model, kennzeichen, fahrer, blp, vnummer, zuzahlung, odatum, mileage, cende, cnummer);
    }
    else {
        var art = getRadioValues();
        var uedate = getInputValues('uedatum');
        var model = getInputValues('model');
        var kennzeichen = getInputValues('kennzeichen');
        var fahrer = getInputValues('fahrer');
        var blp = getInputValues('blp');
        var fklasse = getInputValues('fklasse');
        var zuzahlung = getInputValues('zuzahlung');

        // Save mietwagen to the database
        saveMietwagen(art, uedate, model, kennzeichen, fahrer, blp, fklasse, zuzahlung);
    }

    // Show alert
    document.querySelector('.formalert').style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function () {
        document.querySelector('.formalert').style.display = 'none';
    }, 3000);

    // Clear Document after submission
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

// Save company car and its contract information to firestore
function saveFirmenwagen(art, model, kennzeichen, fahrer, blp, vnummer, zuzahlung, odatum, mileage, cende, cnummer) {
    fahrzeugeRef.doc(kennzeichen).set({
        Fahrzeugart: art,
        Modell: model,
        Kennzeichen: kennzeichen,
        Fahrer: fahrer,
        Bruttolistenpreis: blp + " €",
        Versicherungsnummer: vnummer,
        Zuzahlung: zuzahlung + " €"
    });
    fahrzeugeRef.doc(kennzeichen).collection('Vertrag').doc(cnummer).set({
        Bestelldatum: odatum,
        Laufleistung: mileage + " km",
        Vertragsende: cende,
        Vertragsnummer: cnummer
    })
}

// Save rented car to firestore
function saveMietwagen(art, uedate, model, kennzeichen, fahrer, blp, fklasse, zuzahlung) {
    fahrzeugeRef.doc(kennzeichen).set({
        Fahrzeugart: art,
        Modell: model,
        Kennzeichen: kennzeichen,
        Übergabedatum: uedate,
        Fahrer: fahrer,
        Bruttolistenpreis: blp + " €",
        Fahrzeugklasse: fklasse,
        Zuzahlung: zuzahlung + " €"
    })
}

// reset the fields after successful submission
function resetCarform() {
    document.getElementsByClassName('uedatum')[0].style.visibility = 'hidden';
    document.getElementsByClassName('fklasse')[0].style.display = 'none';
    document.getElementsByClassName('vnummer')[0].style.display = 'block';
    document.getElementsByClassName('vdaten')[0].style.display = 'block';
    document.getElementsByClassName('cnummer')[0].style.display = 'block';
    document.getElementsByClassName('cende')[0].style.display = 'block';
    document.getElementsByClassName('mileage')[0].style.display = 'block';
    document.getElementsByClassName('odatum')[0].style.display = 'block';

}

//gets the InputWindow for the key of the desired Dataset
function getDataMask(Datensatz) {
    if (Datensatz == "Mitarbeiter") {
        document.getElementById("insertKey").style.display = 'block';
        document.getElementById("keyLabel").innerHTML = "Name";
    }
    if (Datensatz == "Fahrzeug") {
        document.getElementById("insertKey").style.display = 'block';
        document.getElementById("keyLabel").innerHTML = "Kennzeichen";
    }
    if (Datensatz == "Führerschein") {
        document.getElementById("insertKey").style.display = 'block';
        document.getElementById("keyLabel").innerHTML = "Name des Besitzers";
    }
    if (Datensatz == "Vertrag") {
        document.getElementById("insertKey").style.display = 'block';
        document.getElementById("keyLabel").innerHTML = "Vertragsnummer";
    }
}

initFirebaseAuth();