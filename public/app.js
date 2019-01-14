var config = {
    apiKey: "AIzaSyB3q1AjHKr1LguKsDgJAjKzfdouS71w-dY",
    authDomain: "nterra-fuhrpark.firebaseapp.com",
    databaseURL: "https://nterra-fuhrpark.firebaseio.com",
    projectId: "nterra-fuhrpark",
    storageBucket: "nterra-fuhrpark.appspot.com",
    messagingSenderId: "95164735355"
};
firebase.initializeApp(config);
const db = firebase.firestore();

// Sign-in to Google
function googleLogin() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function () {
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
window.onhashchange = function () {
    hideAllPages();
    var currentHash = window.location.hash;
    if (!firebase.auth().currentUser) {
        currentHash = "#welcome";
    }
    if (currentHash == '#home') {
        document.getElementsByClassName('home')[0].style.display = 'grid';
    }
    else if (currentHash == '#fahrzeuge') {
        document.getElementsByClassName('fahrzeuge')[0].style.display = 'grid';
    }
    else if (currentHash == '#fuehrerschein') {
        document.getElementsByClassName('fuehrerschein')[0].style.display = 'block';
    }
    else if (currentHash == '#editor') {
        document.getElementsByClassName('editor')[0].style.display = 'grid';
    }
    else if (currentHash == '#uebersicht') {
        document.getElementsByClassName('uebersicht')[0].style.display = 'grid';
    }
    else if (currentHash == '#datenbank') {
        document.getElementsByClassName('datenbank')[0].style.display = 'grid';
    }
    else if (currentHash == '#welcome') {
        return;
    }
    else {
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
function hideAllPages() {
    var pages = document.getElementsByClassName("page")
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
}

// Reference Firmenwagen collection
var fahrzeugeRef = db.collection('Fahrzeuge');

// Reference Mitarbeiter collection
var mitarbeiterRef = db.collection('Mitarbeiter');

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
        Zuzahlung: zuzahlung + " €",
        Vertragsbestelldatum: odatum,
        Vertragslaufleistung: mileage + " km",
        Vertragsende: cende,
        Vertragsnummer: cnummer
    });
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


var licenseRef = db.collection('Fuehrerschein');

var licenseCounter = 1;

var data = null;

var currentGuy = null;

document.getElementById('license-search').addEventListener('click', searchLicenses);

function searchLicenses() {
    licenseCounter = 1;
    licenseRef.get().then(function (querySnapshot) {
            data = querySnapshot.docs.map(function (documentSnapshot) {
                return documentSnapshot.data();
            })
            console.log(data.length);
            loadNext();
    })
}

document.getElementById('yesbutton').addEventListener('click', acceptLicense);

function acceptLicense() {
    var currentMitarbeiterID = data[licenseCounter].MitarbeiterID;
    var oldLicenseID = currentGuy.AktuellerFuehrerschein;
    var newLicenseID = String(parseInt(currentGuy.AktuellerFuehrerschein) + 1);
    mitarbeiterRef.doc(currentMitarbeiterID).collection('Fuehrerscheine').doc(newLicenseID).set({
        MitarbeiterID: currentMitarbeiterID,
        URLFront: data[licenseCounter].URLFront,
        URLBack: data[licenseCounter].URLBack,
        Datum: data[licenseCounter].Datum.toLocaleDateString(),
        Aktuell: true
    })
    if(newLicenseID == "0"){
        mitarbeiterRef.doc(currentMitarbeiterID).update({
            AktuellerFuehrerschein: newLicenseID
        })
    }
    else{
        mitarbeiterRef.doc(currentMitarbeiterID).update({
            AktuellerFuehrerschein: newLicenseID
        })
        mitarbeiterRef.doc(currentMitarbeiterID).collection('Fuehrerscheine').doc(oldLicenseID).update({
            Aktuell: false
        })
    }
   // deleteLicense(currentMitarbeiterID);

    licenseCounter++;

    loadNext();

    document.querySelector('.licensealert').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.licensealert').style.display = 'none';
    }, 3000);
}

function deleteLicense(currentMitarbeiterID) {
    licenseRef.doc(currentMitarbeiterID).delete();
}

function loadNext() {
    if(licenseCounter == data.length){
        document.querySelector('.nothingleftalert').style.display = 'block';
        document.getElementById('license-box').style.display = 'none';
        return;
    }
    mitarbeiterRef.doc(data[licenseCounter].MitarbeiterID).get().then(function(documentSnapshot){
        currentGuy = documentSnapshot.data();
     })
    document.querySelector('.nothingleftalert').style.display = 'none';
    document.getElementById('license-box').style.display = 'block';
    document.querySelector('#license-user').textContent = data[licenseCounter].MitarbeiterID;
    document.querySelector('#license-date').textContent = data[licenseCounter].Datum.toLocaleDateString();
    document.querySelector('#back-pic').href = data[licenseCounter].URLBack;
    console.log(document.querySelector('#back-pic').href);
    document.querySelector('#front-pic').href = data[licenseCounter].URLFront;
}

//TODO: Richtige Urls laden bei Klick auf Vorder/Rückseite
//      Ablehnung des Führerscheins behandeln

//gets the InputWindow for the key of the desired Dataset
function getDataMask(Datensatz) {
    fillDatalist(Datensatz);
    if (Datensatz == "Mitarbeiter") {
        document.getElementById("insertInfo").style.display = 'block';
        document.getElementById("insertKey").style.display = 'block';
        document.getElementById("keyLabel").innerHTML = "Name";
        document.getElementById("keyinsert").placeholder = "jens.zuo@nterra.com";
    }
    if (Datensatz == "Fahrzeug") {
        document.getElementById("insertInfo").style.display = 'block';
        document.getElementById("insertKey").style.display = 'block';
        document.getElementById("keyLabel").innerHTML = "Kennzeichen";
        document.getElementById("keyinsert").placeholder = "DA NT 100";
    }
}

//opens the Editor-Page
function getEditor(Datensatz, Key) {
    ResetEditor();
    setHash('editor')
    if (Datensatz == "Mitarbeiter") {
        document.getElementById("Mitarbeiter-Edit").style.display = 'block';
        searchDatabase(Key, false);
    }
    if (Datensatz == "Fahrzeug") {
        document.getElementById("Fahrzeug-Edit").style.display = 'block';
        searchDatabase(Key, true);
    }
}

function searchDatabase(key, bool) {
    if (bool) {
        var docRef = fahrzeugeRef.doc(key);
    } else {
        var docRef = mitarbeiterRef.doc(key)
    }
    docRef.get().then(function (doc) {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            FillEditMask(doc, bool, key);
        } else {
            //TODO, User wird benachrichtigt, wenn keine Daten verfügbar sind
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

var startdate = new Date(new Date().getFullYear(), 0, 1)
var enddate = new Date(new Date().getFullYear() + 1, 0, 1)

function FillEditMask(doc, bool, key) {
    if (bool) {
        document.getElementById('editfahrzeugart').value = doc.data().Fahrzeugart;
        document.getElementById('editkennzeichen').value = doc.data().Kennzeichen;
        document.getElementById('editmodel').value = doc.data().Modell;
        document.getElementById('editfahrer').value = doc.data().Fahrer;
        document.getElementById('editblp').value = doc.data().Bruttolistenpreis;
        document.getElementById('editvnummer').value = doc.data().Versicherungsnummer;
        document.getElementById('editzuzahlung').value = doc.data().Zuzahlung;
        if (doc.data().Fahrzeugart == "Firmenwagen") {
            //TODO: klären, unter welchen IDs wir aktuelle Verträge speichern
            //document.getElementById('editvertragsdaten').style = 'block';
            document.getElementById('editnummerid').style = 'block';
            document.getElementById('edittodatumid').style = 'block';
            document.getElementById('editmileageid').style = 'block';
            document.getElementById('editcendeid').style = 'block';
            fahrzeugeRef.doc(key).collection('Vertrag').doc('12345678').get().then(function (Vertragsref) {
                if (Vertragsref.exists) {
                    document.getElementById('editcnummer').value = Vertragsref.data().Vertragsnummer;
                    document.getElementById('editodatum').value = Vertragsref.data().Bestelldatum;
                    document.getElementById('editmileage').value = Vertragsref.data().Laufleistung;
                    document.getElementById('editcende').value = Vertragsref.data().Vertragsende;
                } else {
                    console.log("No such document!");
                }
            }
            )
        } else {
            document.getElementById('editdatumid').style = 'block';
            document.getElementById('editklasseid').style = 'block';
            document.getElementById('edituedatum').value = doc.data().Übergabedatum;
            document.getElementById('editfahrzeugklasse').value = doc.data().Fahrzeugklasse;
        }
    }

    else {
        var numberdays
        document.getElementById('editname').value = doc.data().Name;
        document.getElementById('editnterraid').value = key;
        mitarbeiterRef.where('Datum', '>=', startdate).where('Datum', '<', enddate).get().then(snap => {
            //TODO, menge wird noch falsch angezeigt
            console.log(snap.size)
        })
    }
}

function EditFahrzeug(Key, Fahrzeugart) {
    if (Fahrzeugart == "Firmenwagen") {
        db.collection('Fahrzeuge').doc(Key).set({
            Fahrzeugart: Fahrzeugart,
            Kennzeichen: Key,
            Modell: document.getElementById('editmodel').value,
            Fahrer: document.getElementById('editfahrer').value,
            Bruttolistenpreis: document.getElementById('editblp').value,
            Versicherungsnummer: document.getElementById('editvnummer').value,
            Zuzahlung: document.getElementById('editzuzahlung').value
        })
            .then(function () {
                document.getElementById('editsuccess').style = 'block'
                console.log("Document successfully written!");
            })
            .catch(function (error) {
                document.getElementById('editfailed').style = 'block'
                console.error("Error writing document: ", error);
            });
    } else {
        db.collection('Fahrzeuge').doc(Key).set({
            Fahrzeugart: Fahrzeugart,
            Kennzeichen: Key,
            Modell: document.getElementById('editmodel').value,
            Fahrer: document.getElementById('editfahrer').value,
            Bruttolistenpreis: document.getElementById('editblp').value,
            Versicherungsnummer: document.getElementById('editvnummer').value,
            Zuzahlung: document.getElementById('editzuzahlung').value,
            Übergabedatum: document.getElementById('edituedatum').value,
            Fahrzeugklasse: document.getElementById('editfahrzeugklasse').value
        })
            .then(function () {
                document.getElementById('editsuccess').style = 'block'
                console.log("Document successfully written!");
            })
            .catch(function (error) {
                document.getElementById('editfailed').style = 'block'
                console.error("Error writing document: ", error);
            });
    }
}

function EditMitarbeiter(Key) {
    db.collection('Mitarbeiter').doc(Key).set({
        Name: document.getElementById('editname').value,
    })
        .then(function () {
            document.getElementById('editsuccess').style = 'block'
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            document.getElementById('editfailed').style = 'block'
            console.error("Error writing document: ", error);
        });
}

//Aufruf wenn die Editor Page aufgerufen wird, resettet Forms und Divisions
function ResetEditor() {
    document.getElementById("Mitarbeiter-Edit").style.display = 'none';
    document.getElementById("Fahrzeug-Edit").style.display = 'none';
}

//alle Mails aus allen Documents
async function getMa() {
    const snapshot = await firebase.firestore().collection('Mitarbeiter').get()
    return snapshot.docs.map(doc => doc.data().Mail);
}

//alle Kennzeichen der Fahrzeuge
async function getKennzeichen() {
    const snapshot = await firebase.firestore().collection('Fahrzeuge').get()
    return snapshot.docs.map(doc => doc.data().Kennzeichen);
}

function fillDatalist(Typ){
    var myMa = new Array();
    var options = '';
    
    if (Typ == "Mitarbeiter") {
            getMa().then(function(result) {
            
            for(var i = 0; i < result.length; i++)
                options += '<option value="'+result[i]+'" />';
            
            document.getElementById('MAList').innerHTML = options; })
    } else {
            getKennzeichen().then(function(result) {
            
            for(var i = 0; i < result.length; i++)
                options += '<option value="'+result[i]+'" />';
            
            document.getElementById('MAList').innerHTML = options;
    })}
}

function testdata() {
    getMarker().then (function(result) {
        //result.map(name => console.log(name))
    })
}

initFirebaseAuth();