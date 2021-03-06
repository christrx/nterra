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
    // Sets the persistence to session, so the user is automatically signed-out if he closes the tab or window
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(function () {
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function () {
                var userMail = firebase.auth().currentUser.email;
                if (validAccount(userMail)) {
                    window.location.hash = "home"
                    GenerateTable();
                }
                else {
                    googleLogout();
                    // Show alert
                    document.querySelector('.useralert').style.display = 'block';

                    // Hide alert after 3 seconds
                    setTimeout(function () {
                        document.querySelector('.useralert').style.display = 'none';
                    }, 5000);
                }
            })
        })
}

// Checks if the users account is an nterra.com domain
function validAccount(userEmail) {
    return userEmail.split('@')[1] == 'nterra.com';
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
    // if a user is signed in his email and his google profile picture are injected into the document
    if (user) {
        var username = getUserName();
        var userPicUrl = getUserPicUrl();

        document.getElementById('username').textContent = username;
        document.getElementById('userpic').style.backgroundImage = 'url(' + userPicUrl + ')';

        document.getElementById('navileiste').style.display = 'grid'
        document.getElementById('homebutton').style.display = 'inline';
        document.getElementById('workerbutton').style.display = 'inline';
        document.getElementById('carbutton').style.display = 'inline';
        document.getElementById('licensebutton').style.display = 'inline';
        //document.getElementById('editbutton').style.display = 'inline';
        document.getElementById('libutton').style.display = 'none';
        document.getElementById('lobutton').style.display = 'inline';
        document.getElementById('userpic').style.display = 'inline-block';
        document.getElementById('username').style.display = 'inline';
    }
    // if the user is not signed in he gets redirected to the welcome page
    else {
        document.getElementById('navileiste').style.display = 'none';
        document.getElementById('homebutton').style.display = 'none';
        document.getElementById('workerbutton').style.display = 'none';
        document.getElementById('carbutton').style.display = 'none';
        document.getElementById('licensebutton').style.display = 'none';
        //document.getElementById('editbutton').style.display = 'none';
        document.getElementById('libutton').style.display = 'inline';
        document.getElementById('libutton').style.marginRight = '20px';
        document.getElementById('lobutton').style.display = 'none';
        document.getElementById('username').style.display = 'none';
        document.getElementById('userpic').style.display = 'none';
        hideAllPages();
        window.location.hash = "welcome";
    }
}

// Triggers when the windows hash value changes and updates the ui accordingly
window.onhashchange = function () {
    // hides the currently visible page
    hideAllPages();
    var currentHash = window.location.hash;
    // if the user is not signed in he is redirected to the welcome page
    if (!firebase.auth().currentUser) {
        currentHash = "#welcome";
    }
    // user is shown the page accordingly to the current hash
    if (currentHash == '#home') {
        document.getElementsByClassName('home')[0].style.display = 'grid';
    }
    else if (currentHash == '#mitarbeiter') {
        document.getElementsByClassName('mitarbeiter')[0].style.display = 'grid';
    }
    else if (currentHash == '#fahrzeuge') {
        document.getElementsByClassName('fahrzeuge')[0].style.display = 'grid';
        document.getElementById('carform').reset();
        resetCarform();
    }
    else if (currentHash == '#fuehrerschein') {
        document.getElementsByClassName('fuehrerschein')[0].style.display = 'grid';
        document.getElementById('emailtext').value = "";
    }
    else if (currentHash == '#editor') {
        document.getElementsByClassName('editor')[0].style.display = 'grid';
        fillDatalist("Mitarbeiter", "EditorList");
    }
    else if (currentHash == '#uebersicht') {
        document.getElementsByClassName('uebersicht')[0].style.display = 'grid';
        exportCars(true, "exporttablef");
        exportCars(false, "exporttablem");
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
    document.getElementsByClassName('uedatum')[1].style.visibility = 'hidden';
    document.getElementsByClassName('fklasse')[0].style.display = 'none';
    document.getElementsByClassName('vnummer')[1].style.display = 'block';
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
    document.getElementsByClassName('uedatum')[1].style.visibility = 'visible';
    document.getElementsByClassName('fklasse')[0].style.display = 'block';
    document.getElementsByClassName('vnummer')[1].style.display = 'none';
    document.getElementsByClassName('vdaten')[0].style.display = 'none';
    document.getElementsByClassName('cnummer')[0].style.display = 'none';
    document.getElementsByClassName('cende')[0].style.display = 'none';
    document.getElementsByClassName('mileage')[0].style.display = 'none';
    document.getElementsByClassName('odatum')[0].style.display = 'none';
}

// Listen for form submit
document.getElementById('carform').addEventListener('submit', checkSubmit);

function checkSubmit(e) {
    e.preventDefault();

    var docRef = fahrzeugeRef.doc(getInputValues('kennzeichen'));

    docRef.get().then(function (doc) {
        if (doc.exists) {
            // Show alert
            document.querySelector('.caralreadyexistsalert').style.display = 'block';

            // Hide alert after 3 seconds
            setTimeout(function () {
                document.querySelector('.caralreadyexistsalert').style.display = 'none';
            }, 3000);
        }
        else {
            submitForm(e);
        }
    })
}

// Submit Form
function submitForm(e) {
    e.preventDefault();

    // Get values of the input fields
    if (getRadioValues() == "Firmenwagen") {
        var art = getRadioValues();
        var model = getInputValues('model');
        var kennzeichen = getInputValues('kennzeichen').toUpperCase();
        var fahrer = getInputValues('fahrer').toLowerCase();
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
        var kennzeichen = getInputValues('kennzeichen').toUpperCase();
        var fahrer = getInputValues('fahrer').toLowerCase()
        console.log(fahrer);
        var blp = getInputValues('blp');
        var fklasse = getInputValues('fklasse');
        var zuzahlung = getInputValues('zuzahlung');

        // Save mietwagen to the database
        saveMietwagen(art, uedate, model, kennzeichen, fahrer, blp, fklasse, zuzahlung);
    }

    // Show alert
    document.querySelector('.caralert').style.display = 'block';

    // Hide alert after 3 seconds
    setTimeout(function () {
        document.querySelector('.caralert').style.display = 'none';
    }, 3000);

    // Clear Document after submission
    document.getElementById('carform').reset();

    // Reset the form fields
    resetCarform();

    // Return to the top of the page
    jumpToTop();

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
    mitarbeiterRef.doc(fahrer).update({
        Kennzeichen: kennzeichen
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
    });
    mitarbeiterRef.doc(fahrer).update({
        Kennzeichen: kennzeichen
    })
}

// reset the fields after successful submission
function resetCarform() {
    document.getElementsByClassName('uedatum')[1].style.visibility = 'hidden';
    document.getElementsByClassName('fklasse')[0].style.display = 'none';
    document.getElementsByClassName('vnummer')[1].style.display = 'block';
    document.getElementsByClassName('vdaten')[0].style.display = 'block';
    document.getElementsByClassName('cnummer')[0].style.display = 'block';
    document.getElementsByClassName('cende')[0].style.display = 'block';
    document.getElementsByClassName('mileage')[0].style.display = 'block';
    document.getElementsByClassName('odatum')[0].style.display = 'block';

}

// Listen for submit on the form Mitarbeiter
document.getElementById('workerform').addEventListener('submit', checkWorkerSubmit);

// Checks if Mitarbeiter already exists
function checkWorkerSubmit(e) {
    e.preventDefault();

    var docRef = mitarbeiterRef.doc(getInputValues('wemail'));

    docRef.get().then(function (doc) {
        if (doc.exists) {
            // Show alert
            document.querySelector('.mitarbeiteralreadyexistsalert').style.display = 'block';

            // Hide alert after 3 seconds
            setTimeout(function () {
                document.querySelector('.mitarbeiteralreadyexistsalert').style.display = 'none';
            }, 3000);
        }
        else {
            submitWorkerForm(e);
        }
    })
}

// Submit form for Mitarbeiter 
function submitWorkerForm(e) {

    e.preventDefault();

    var wemail = getInputValues('wemail').toLowerCase();
    var wname = Name(wemail);

    saveMitarbeiter(wemail, wname);

    document.querySelector('.workeralert').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.workeralert').style.display = 'none';
    }, 3000);

    document.getElementById('workerform').reset();
}

// Saves new Mitarbeiter
function saveMitarbeiter(wemail, wname) {
    mitarbeiterRef.doc(wemail).set({
        AktuellerFuehrerschein: "-1",
        Mail: wemail,
        Name: wname,
        ErfolgreichePruefungDatum: new Date(Date.UTC(2000, 00, 01)),
        LetzterUpload: null,
        Kennzeichen: "",
        CheckHistorie: ""
    })
}


var licenseRef = db.collection('Fuehrerschein');

var licenseCounter = 1;

var data = null;

var currentGuy = null;

var currentBackUrl = null;

var currentFrontUrl = null;

var oldHistory = null;

// Listen for click on the form to search for new licenses
document.getElementById('license-search').addEventListener('click', searchLicenses);

function searchLicenses() {
    document.getElementById('ablehnung-box').style.display = 'none';
    licenseCounter = 1;
    licenseRef.get().then(function (querySnapshot) {
        data = querySnapshot.docs.map(function (documentSnapshot) {
            return documentSnapshot.data();
        })
        console.log(data.length);
        loadNext();
    })
}

// Listen for click on the form when accepted or denied
document.getElementById('yesbutton').addEventListener('click', acceptLicense);
document.getElementById('nobutton').addEventListener('click', denyLicense);

function acceptLicense() {
    var currentMitarbeiterID = data[licenseCounter].MitarbeiterID;
    var oldLicenseID = currentGuy.AktuellerFuehrerschein;
    var newLicenseID = String(parseInt(currentGuy.AktuellerFuehrerschein) + 1);
    var Today = (new Date()).toLocaleDateString();

    console.log(Today);

    mitarbeiterRef.doc(currentMitarbeiterID).collection('Fuehrerscheine').doc(newLicenseID).set({
        MitarbeiterID: currentMitarbeiterID,
        URLFront: data[licenseCounter].URLFront,
        URLBack: data[licenseCounter].URLBack,
        Ablaufdatum: data[licenseCounter].Ablaufdatum.toLocaleDateString(),
        Aktuell: true
    })
    if (newLicenseID == "0") {
        mitarbeiterRef.doc(currentMitarbeiterID).update({
            AktuellerFuehrerschein: newLicenseID,
            LetzterUpload: data[licenseCounter].UploadZeitpunkt,
            ErfolgreichePruefungDatum: firebase.firestore.FieldValue.serverTimestamp(),
            CheckHistorie: Today
        })
    }
    else {
        mitarbeiterRef.doc(currentMitarbeiterID).update({
            AktuellerFuehrerschein: newLicenseID,
            LetzterUpload: data[licenseCounter].UploadZeitpunkt,
            ErfolgreichePruefungDatum: firebase.firestore.FieldValue.serverTimestamp(),
            CheckHistorie: oldHistory + "</br>" + Today
        })
        mitarbeiterRef.doc(currentMitarbeiterID).collection('Fuehrerscheine').doc(oldLicenseID).update({
            Aktuell: false
        })
    }
    // old License gets deleted
    deleteLicense(currentMitarbeiterID);

    licenseCounter++;

    loadNext();

    jumpToTop();

    document.querySelector('.licensealert').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.licensealert').style.display = 'none';
    }, 3000);
}



function denyLicense() {
    document.getElementById('ablehnung-box').style.display = 'block';
}

// Listen for click on the form to send E-Mail when license denied
document.getElementById('sendMail').addEventListener('click', sendEmail);

// To send an E-Mail with the reason for the denial
function sendEmail() {
    var empfaenger = data[licenseCounter].MitarbeiterID;
    var betreff = "Ihr Führerschein-Upload in der ndriver App wurde abgelehnt";
    var body = document.getElementById('emailtext').value;

    var mailurl = mailToUrl(empfaenger, betreff, body);

    window.location.href = mailurl;

    document.getElementById('emailtext').value = "";

    deleteLicense(empfaenger);

    licenseCounter++;

    loadNext();

    document.querySelector('.denialalert').style.display = 'block';

    setTimeout(function () {
        document.querySelector('.denialalert').style.display = 'none';
    }, 3000);

    document.getElementById('ablehnung-box').style.display = 'none';
}

function mailToUrl(empfaenger, betreff, body) {
    var args = [];
    args.push('subject=' + encodeURIComponent(betreff));
    args.push('body=' + encodeURIComponent(body));
    var url = 'mailto:' + empfaenger;
    if (args.length > 0) {
        url += '?' + args.join('&');
    }
    return url;
}

function deleteLicense(currentMitarbeiterID) {
    licenseRef.doc(currentMitarbeiterID).delete();
}

// opens backside of picture
function openBack() {
    var win = window.open(currentBackUrl, '_blank');
    win.focus();
}

// opens frontside of picture
function openFront() {
    var win2 = window.open(currentFrontUrl, '_blank');
    win2.focus();
}

// next License gets loaded
function loadNext() {
    if (licenseCounter == data.length) {
        document.querySelector('.nothingleftalert').style.display = 'grid';
        document.getElementById('license-box').style.display = 'none';
        return;
    }
    mitarbeiterRef.doc(data[licenseCounter].MitarbeiterID).get().then(function (documentSnapshot) {
        currentGuy = documentSnapshot.data();
        oldHistory = currentGuy.CheckHistorie;

    })
    document.querySelector('.nothingleftalert').style.display = 'none';
    document.getElementById('license-box').style.display = 'grid';
    document.querySelector('#license-user').textContent = data[licenseCounter].MitarbeiterID;
    document.querySelector('#license-date').textContent = data[licenseCounter].Ablaufdatum.toLocaleDateString();
    currentBackUrl = data[licenseCounter].URLBack;
    currentFrontUrl = data[licenseCounter].URLFront;
}

function jumpToTop(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


//!!NOT IN USE!!
//gets the InputWindow for the key of the desired Dataset
function getDataMask(Datensatz) {
    fillDatalist(Datensatz, "MAList");
    document.getElementById("keylabel").style.display = "block";
    document.getElementById("keyinput").style.display = "block";
    document.getElementById("keybutton").style.display = "block";
    if (Datensatz == "Mitarbeiter") {
        document.getElementById("keyLabel").innerHTML = "Name";
        document.getElementById("keyinsert").placeholder = "jens.zuo@nterra.com";
    }
    if (Datensatz == "Fahrzeug") {
        document.getElementById("keyLabel").innerHTML = "Kennzeichen";
        document.getElementById("keyinsert").placeholder = "DA NT 100";
    }
}

//takes a Key of an Object ans specifies whether it is an employee or car ("Datensatz")
//opens the Editor-Page
//It opens the sub function seatchdatabase with the key and a boolean value, depending on "Datensatz"
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


//Takes the key and searches for the document in the firestore database and returns it ot a sub function
//The function then fills the formula on the website with the function FIllEditmask
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
            //TODO: User wird benachrichtigt, wenn keine Daten verfügbar sind
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

var startdate = new Date(new Date().getFullYear(), 0, 1)
var enddate = new Date(new Date().getFullYear() + 1, 0, 1)


//This function is responsible for making the right input fields visible, depending on the dataset,
//and fills them with the data from the database
//Doc: The Dataset in use, Car or Employee
function FillEditMask(doc, bool, key) {
    //First hide all inputs
    var data = doc.data();
    document.getElementById('edithistoryid').style.display = 'none';
    document.getElementById('editplaceholder').style.display = 'none';
    document.getElementById('editnummerid').style.display = 'none';
    document.getElementById('edittodatumid').style.display = 'none';
    document.getElementById('editmileageid').style.display = 'none';
    document.getElementById('editcendeid').style.display = 'none';
    document.getElementById('editvnummerid').style.display = 'none';
    document.getElementById('editdatumid').style.display = 'none';
    document.getElementById('editplaceholder').style.display = 'none';
    document.getElementById('editklasseid').style.display = 'none';
    //If the dataset is a car show inputs for car
    if (bool) {
        document.getElementById('editfahrzeugart').value = data.Fahrzeugart;
        document.getElementById('editkennzeichen').value = data.Kennzeichen;
        document.getElementById('editmodel').value = data.Modell;
        document.getElementById('editfahrer').value = data.Fahrer;
        document.getElementById('editblp').value = data.Bruttolistenpreis.replace(" €", "");
        document.getElementById('editzuzahlung').value = data.Zuzahlung.replace(" €", "");
        //show inputs specifically for Firmenwagen
        if (doc.data().Fahrzeugart == "Firmenwagen") {
            document.getElementById('editnummerid').style = 'block';
            document.getElementById('edittodatumid').style = 'block';
            document.getElementById('editmileageid').style = 'block';
            document.getElementById('editcendeid').style = 'block';
            document.getElementById('editvnummerid').style = 'block';
            document.getElementById('editplaceholder').style = 'block';
            document.getElementById('editvnummer').value = data.Versicherungsnummer;
            document.getElementById('editcnummer').value = data.Vertragsnummer;
            document.getElementById('edittodatum').value = data.Vertragsbestelldatum;
            document.getElementById('editmileage').value = data.Vertragslaufleistung;
            document.getElementById('editcende').value = data.Vertragsende;
            //and if there is one, the Driver History
            if (typeof data.Verlauf !== "undefined") {
                document.getElementById('editplaceholder').style.display = 'none';
                document.getElementById('edithistoryid').style.display = 'block';
                document.getElementById('edithistory').value = data.Verlauf;
            }
        } else {
            //else show the specific fields for Mietwagen
            document.getElementById('editdatumid').style = 'block';
            document.getElementById('editklasseid').style = 'block';
            document.getElementById('edituedatum').value = doc.data().Übergabedatum;
            document.getElementById('editfahrzeugklasse').value = doc.data().Fahrzeugklasse;
            if (typeof data.Verlauf !== "undefined") {
                document.getElementById('editplaceholder').style = 'block';
                document.getElementById('edithistoryid').style.display = 'block';
                document.getElementById('edithistory').value = data.Verlauf;
            }
        }
    }


    //Or it is an Employee, then show the datamask for the Employee
    else {
        var numberdays
        document.getElementById('editname').value = data.Name;
        document.getElementById('editnterraid').value = key;
        mitarbeiterRef.doc(key).collection("Fuehrerscheine").doc(data.AktuellerFuehrerschein).get().then(function (License) {
            if (License.exists) {
                setinner("lastupload", generateURLString(License.data().URLFront, License.data().URLBack));
            } else {
                setinner("lastupload", "keine Uploads");
            }

            getDrives(key);
            getChecks(key);
        })
    }
}

//Gets every License Check of an Employee and writes it into the Editor Page for the Employee
function getChecks(Mitarbeiter) {
    mitarbeiterRef.doc(Mitarbeiter).get().then(function(doc){
        if (typeof doc.data().CheckHistorie !== "undefined") {
        setinner("lastCheck", "Checks: </br>" + doc.data().CheckHistorie);
        } else {
            setinner("lastCheck", "keine Checks");
        }
    })
}

//Gets the numbers Drives an employee has made in the drivers app in the current calendar year, and writes the number onto his page
function getDrives(Mitarbeiter) {
    mitarbeiterRef.doc(Mitarbeiter).collection("ImBuero").where("Datum", ">=", lastcalendaryear()).get().then(function (Fahrten) {
        console.log(Fahrten)
        if (!Fahrten.empty) {
            console.log(Fahrten);
            setinner("Fahrten", "Fahrten ins Büro im letzten Kalenderjahr: " + Fahrten.size)
        } else {
            setinner("Fahrten", "keine Fahrten im letzten Kalenderjahr")
        }
    })
}

//Gets the last calendar year
function lastcalendaryear() {
    var thisyear
    var lastyear

    thisyear = (new Date()).getFullYear();
    lastyear = new Date(thisyear, 0, 1)

    return lastyear
}


//Gets Today Day Minus eleven Months
function lastcalendaryearplusonemonth() {

    var today = new Date()
    var Year = today.getFullYear()
    var month = today.getMonth()
    var day = today.getDate()

    var d = new Date(Year - 1, month + 1, day)

    return d
}

//Edits an Car Dataset with the inputted Data on the Editor page
async function EditFahrzeug(Key, Fahrzeugart) {
    var olddriver
    var docRef

    docRef = fahrzeugeRef.doc(Key);

    var snapshot = await docRef.get()
    //saves the old driver of the car
    olddriver = snapshot.data().Fahrer;

    //also get the Employee Dataset of the current car so his car can be changed later
    if (document.getElementById('editfahrer').value !== "") {
        var newMAsnapshot = await mitarbeiterRef.doc(document.getElementById('editfahrer').value).get()
    }

    //WENN:
    // 1. ein Fahrer angegeben wurde
    // 2. dieser Neue Fahrer ein Kennzeichen schon zugewiesen bekommen hat
    // und 3. dieses Kennzeichen nicht das aktuelle ist: 
    // DANN wirf einen Fehler aus 
    if ((document.getElementById('editfahrer').value !== "") && (newMAsnapshot.data().Kennzeichen !== "") && (newMAsnapshot.data().Kennzeichen !== Key)) {
        document.querySelector('.fahrzeug-denyalert').style.display = 'block';

        setTimeout(function () {
            document.querySelector('.fahrzeug-denyalert').style.display = 'none';
        }, 3000);
    } else {
        //Updates Firmenwagen
        if (Fahrzeugart == "Firmenwagen") {
            db.collection('Fahrzeuge').doc(Key).update({
                Fahrzeugart: Fahrzeugart,
                Kennzeichen: Key,
                Modell: document.getElementById('editmodel').value,
                Fahrer: document.getElementById('editfahrer').value,
                Bruttolistenpreis: document.getElementById('editblp').value + " €",
                Versicherungsnummer: document.getElementById('editvnummer').value,
                Zuzahlung: document.getElementById('editzuzahlung').value + " €",
                Vertragsbestelldatum: document.getElementById('edittodatum').value,
                Vertragsende: document.getElementById('editcende').value,
                Vertragslaufleistung: document.getElementById('editmileage').value,
                Vertragsnummer: document.getElementById('editcnummer').value,
            })
                .then(function () {
                    document.querySelector('.fahrzeug-changealert').style.display = 'block';

                    setTimeout(function () {
                        document.querySelector('.fahrzeug-changealert').style.display = 'none';
                    }, 3000);
                    console.log("Document successfully written!");
                    setHash('home');
                    jumpToTop();
                })
                .catch(function (error) {
                    document.getElementById('editfailed').style = 'block'
                    console.error("Error writing document: ", error);
                });
        } else {
            //Updates Mietwagen
            docRef.update({
                Fahrzeugart: Fahrzeugart,
                Kennzeichen: Key,
                Modell: document.getElementById('editmodel').value,
                Fahrer: document.getElementById('editfahrer').value,
                Bruttolistenpreis: document.getElementById('editblp').value + " €",
                Versicherungsnummer: document.getElementById('editvnummer').value,
                Zuzahlung: document.getElementById('editzuzahlung').value + " €",
                Übergabedatum: document.getElementById('edituedatum').value,
                Fahrzeugklasse: document.getElementById('editfahrzeugklasse').value
            })
                .then(function () {
                    document.querySelector('.fahrzeug-changealert').style.display = 'block';

                    setTimeout(function () {
                        document.querySelector('.fahrzeug-changealert').style.display = 'none';
                    }, 3000);
                    setHash('home');
                    jumpToTop();
                    console.log("Document successfully written!");
                })
                .catch(function (error) {
                    document.getElementById('editfailed').style = 'block'
                    console.error("Error writing document: ", error);
                });
        }

        //if the current driver is not the same driver as before then
        if (document.getElementById('editfahrer').value !== olddriver) {

            //Edit the car of the new driver
            if (document.getElementById('editfahrer').value !== "") {
                mitarbeiterRef.doc(document.getElementById('editfahrer').value).update({
                    Kennzeichen: Key
                })
            }

            //If the Old driver still has this car in his data then set it to ""
            mitarbeiterRef.doc(olddriver).get().then(function (driver) {
                if (driver.data().Kennzeichen == Key) {
                    mitarbeiterRef.doc(olddriver).update(
                        { Kennzeichen: "" }
                    )
                }
            })

            //If theres not a driver history yet make one
            if (typeof snapshot.data().Verlauf !== "undefined") {
                docRef.update({
                    Verlauf: snapshot.data().Verlauf + "; " + Name(olddriver)
                })

                //save the old driver in the history
            } else {

                docRef.set({
                    Verlauf: Name(olddriver)
                }, { merge: true });
            }
        }
    }
}

//Edits an Employee with the new Data-Input by the User
function EditMitarbeiter(Key) {
    db.collection('Mitarbeiter').doc(Key).update({
        Name: document.getElementById('editname').value,
    })
        .then(function () {
            document.querySelector('.mitarbeiter-changealert').style.display = 'block';

            setTimeout(function () {
                document.querySelector('.mitarbeiter-changealert').style.display = 'none';
            }, 3000);
            setHash('home');
            jumpToTop();
            console.log("Document successfully written!");
        })
        .catch(function (error) {
            document.getElementById('editfailed').style = 'block'
            console.error("Error writing document: ", error);
        });
}

function DeleteData(Art, Key) {
    //If its a car
    if (Art == "Fahrzeug") {
        fahrzeugeRef.doc(Key).get().then(function (doc) {

        //Set the car of the current driver of the to be deleted car to ""
        if (doc.data().Fahrer !== ""){
        mitarbeiterRef.doc(doc.data().Fahrer).update({
            Kennzeichen: ""
        })
    }
    //and then delete
        fahrzeugeRef.doc(Key).delete().then(function () {
            document.querySelector('.fahrzeug-deletealert').style.display = 'block';

            setTimeout(function () {
                document.querySelector('.fahrzeug-deletealert').style.display = 'none';
            }, 3000);
            setHash('home');
            jumpToTop();
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
    })
    }

//Delete an Employee
    if (Art == "Mitarbeiter") {
        //If the Employee still has subcollections then delete them first
        if (typeof mitarbeiterRef.doc(Key).collection("ImBuero") !== "undefined") {
            deleteCollection(mitarbeiterRef.doc(Key).collection("ImBuero"));
        }

        if (typeof mitarbeiterRef.doc(Key).collection("Fuehrerscheine") !== "undefined") {
            deleteCollection(mitarbeiterRef.doc(Key).collection("Fuehrerscheine"));
        }

        //then delete the employee himself
        if (typeof db.collection("Fuehrerschein").doc(Key) !== "undefined") {
            db.collection("Fuehrerschein").doc(Key).delete();
        }

        //If the employee had a car, set the driver to ""
        mitarbeiterRef.doc(Key).get().then(function (doc) {
            if (doc.data().Kennzeichen !== "") {
                fahrzeugeRef.doc(doc.data().Kennzeichen).update({
                    Fahrer: ""
                })
            }

            //then delete the employee
            mitarbeiterRef.doc(Key).delete().then(function () {
                document.querySelector('.mitarbeiter-deletealert').style.display = 'block';

                setTimeout(function () {
                    document.querySelector('.mitarbeiter-deletealert').style.display = 'none';
                }, 3000);
                setHash('home');
                jumpToTop();
                console.log("Document successfully deleted!");
            }).catch(function (error) {
                console.error("Error removing document: ", error);
            });
        })

    }
}

//Aufruf wenn die Editor Page aufgerufen wird, resettet Forms und Divisions
function ResetEditor() {
    document.getElementById("Mitarbeiter-Edit").style.display = 'none';
    document.getElementById("Fahrzeug-Edit").style.display = 'none';
}

//Gets an Employee Dataset
async function getMa() {
    const snapshot = await firebase.firestore().collection('Mitarbeiter').get();
    return snapshot.docs.map(doc => doc.data().Mail);
}


//holt alle Kennzeichen aller Fahrzeuge
async function getKennzeichen() {
    const snapshot = await firebase.firestore().collection('Fahrzeuge').get();
    return snapshot.docs.map(doc => doc.data().Kennzeichen);
}

//Füllt Datalists der Inputfelder, mit denen dann das Dropdown Menüs generiert wird
function fillDatalist(Typ, List) {
    var myMa = new Array();
    var options = '';

    if (Typ == "Mitarbeiter") {
        getMa().then(function (result) {

            for (var i = 0; i < result.length; i++)
                options += '<option value="' + result[i] + '" />';

            document.getElementById(List).innerHTML = options;
        })
    } else {
        getKennzeichen().then(function (result) {

            for (var i = 0; i < result.length; i++)
                options += '<option value="' + result[i] + '" />';

            document.getElementById(List).innerHTML = options;
        })
    }
}


//ordnet jedem Mitarbeiter sein Auto zu, falls vorhanden
//funktioniert bisher nur für 0-1 Auto pro Person
//returnt sie als array
function getMAcars(Employees) {

    Employees[1].forEach(function (employee) {
        fahrzeugeRef.where("Fahrer", "==", employee).get().then(function (cars) {
            if (!cars.empty) {
                cars.forEach(car => {
                    Employees[2].push(car.data().Kennzeichen);
                })
            } else {
                Employees[2].push("")
            }
        })
    })

    return new Promise(function (resolve) {
        resolve(Employees)
    })

}

//Generates a new Column in an html table, filled with the value "Mitarbeiter" by appending the column onto "innerstring"
function newMaTable(Mitarbeiter, innerString) {
    innerString += '<td><button class="link" onclick="getEditor(`Mitarbeiter`, `' + Mitarbeiter +
        '`)">' + Name(Mitarbeiter) + '</button></td>';
    return innerString;
}

//Generates a new Column in an html table, filled with the value "Car" by appending the column onto "innerstring"
function newCarTable(Car, innerString) {
    innerString += '<td><button class="link" onclick="getEditor(`Fahrzeug`, `' + Car +
        '`)">' + Car + '</button></td>';
    return innerString;
}

//Generates a new RED Column in an html table, filled with the value "Car" by appending the column onto "innerstring"
function newCarTableRed(Car, innerString) {
    innerString += '<td><button class="redlink" onclick="getEditor(`Fahrzeug`, `' + Car +
        '`)">' + Car + '</button></td>';
    return innerString;
}

//Generates a new Column in an html table, filled with the value "LicenceDate" by appending the column onto "innerstring"
//Date turns red if the Date lies 11 Months or more in the past
function newDateTable(LicenseDate, innerString) {
    var Today = new Date()
    var LicenseDateString = ""

    if (LicenseDate !== "") {
        LicenseDateString = LicenseDate.toLocaleDateString()
    }

    if (LicenseDate !== "" && LicenseDate < lastcalendaryearplusonemonth()) {
        innerString += '<td><font color="red">' + LicenseDateString + '</font></td>';
    } else {
        innerString += '<td>' + LicenseDateString + '</td>'
    }
    return innerString;
}



//gets Employee Data out of the 'Mitarbeiter' Collection and puts it into an Array
//return Array: "Employees"
async function getEmployeeData() {
    var Employees = new Array(Array(), Array(), Array())

    snapshot = await mitarbeiterRef.orderBy("LetzterUpload", "asc").get()
    snapshot.forEach(function (doc) {
        Employees[1].push(doc.data().Mail);
        if (doc.data().LetzterUpload !== null) {
            Employees[0].push(doc.data().LetzterUpload)
        } else {
            Employees[0].push("")
        }
        Employees[2].push(doc.data().Kennzeichen)
    })

    return Employees

}


//Generiert die Home Tabelle
//Holt sich die Daten aus der Firebase Database in einem Array
//Schneidet sich einen String aus den MitarbeiterDaten zusammen, welches direkt als innerHTML in die HTML Tabelle "Employee-Car-Table" gesetzt wird
async function GenerateTable() {
    var tableString = '<tr><th>Mitarbeiter</th><th>Fahrzeug</th><th>Letzter Upload</th></tr>'

    const EmployeeData = await getEmployeeData()

    console.log(EmployeeData)

    for (var i = 0; i < EmployeeData[1].length; i++) {
        tableString += "<tr>"
        tableString = newMaTable(EmployeeData[1][i], tableString)
        tableString = newCarTable(EmployeeData[2][i], tableString)
        tableString = newDateTable(EmployeeData[0][i], tableString)
        tableString += "</tr>"
    }

    document.getElementById("Employee-Car-Table").innerHTML = tableString;

}

//cuts the Name out of an nterra Email "str"
function Name(str) {

    str = str.replace(".", " ");
    str = str.replace("@nterra.com", "");
    str = str.replace(/\b\w/g, l => l.toUpperCase());

    return str
}

//sets innerhtml of the element with the ID "id" with the value "innerstring"
function setinner(id, innerstring) {
    document.getElementById(id).innerHTML = innerstring;
}

function generateURLString(URLFront, URLBack) {
    var innerstring

    innerstring = "<label>Aktueller Upload:</label><a href='" + URLFront + "'target='_blank'>Vorderseite</a><br /><a href='" + URLBack + "'target='_blank'>Rückseite</a>";
    return innerstring;
}

//deletes Collection with the ID "collection"
function deleteCollection(collection) {

    collection.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {

            collection.doc(doc.id).delete().then(function () {
                console.log("Document successfully deleted!");
            }).catch(function (error) {
                console.error("Error removing document: ", error);
            });

        });
    });
}

//Erstellt die Übersicht Tabelle im Übersicht Tab
//Parameter: 
//          bool: true  -> Firmenwagen
//                false -> Mietwagen
//tableid: ID der html Tabelle, in welcher der exportstring geschrieben wird
async function exportCars(bool, tableid) {

    var snapshot
    var exportstring

    if (bool) {
        snapshot = await fahrzeugeRef.orderBy("Vertragsende", "asc").get();
        exportstring = "<tr><th>Kennzeichen</th><th>aktueller Fahrer</th><th>Modell</th><th>Zuzahlung (€)</th><th>BLP (€)</th><th>Laufleistung</th>" +
            "<th>Vertragsende</th><th>Vertrag Nr.</th><th>KFZ Versicherungsnummer</th></tr>";
    } else {
        snapshot = await fahrzeugeRef.get();
        exportstring = "<tr><th>Kennzeichen</th><th>aktueller Fahrer</th><th>Modell</th><th>Zuzahlung (€)</th>" +
            "<th>BLP (€)</th><th>Fahrzeugklasse</th><th>Übergabedatum</th></tr>";
    }

    snapshot.forEach(function (doc) {

        var data = doc.data();
        var red;
        exportstring += "<tr>";

        if (data.Bruttolistenpreis == " €") {red = true}

        if (bool) {
            if (data.Fahrzeugart == "Firmenwagen") {
                if (red) {
                exportstring = newCarTableRed(data.Kennzeichen, exportstring);
                } else {
                exportstring = newCarTable(data.Kennzeichen, exportstring);
                }
                exportstring = newMaTable(data.Fahrer, exportstring);
                exportstring = newcol(exportstring, data.Modell);
                exportstring = newcol(exportstring, data.Zuzahlung);
                exportstring = newcol(exportstring, data.Bruttolistenpreis);
                exportstring = newcol(exportstring, data.Vertragslaufleistung);
                exportstring = newcol(exportstring, dateForm(data.Vertragsende));
                exportstring = newcol(exportstring, data.Vertragsnummer);
                exportstring = newcol(exportstring, data.Versicherungsnummer);
            }
        } else {
            if (data.Fahrzeugart == "Mietwagen") {
                if (red) {
                exportstring = newCarTableRed(data.Kennzeichen, exportstring);
                } else {
                exportstring = newCarTable(data.Kennzeichen, exportstring);
                }
                exportstring = newMaTable(data.Fahrer, exportstring);
                exportstring = newcol(exportstring, data.Modell);
                exportstring = newcol(exportstring, data.Zuzahlung);
                exportstring = newcol(exportstring, data.Bruttolistenpreis);
                exportstring = newcol(exportstring, data.Fahrzeugklasse);
                exportstring = newcol(exportstring, dateForm(data.Übergabedatum));
            }
        }

        exportstring += "</tr>";

    })

    setinner(tableid, exportstring);

}

//Füllt eine Spalte einer html Tabelle mit dem Wert "datastring", 
//indem er den dazugehörtigen html code an "exportstring" anhängt
function newcol(exportstring, datastring) {
    var newstring = exportstring + "<td>" + datastring + "</td>";

    return newstring;
}

function dateForm(date) {
    if (date == "") {
        return date;
    }
    else {
    var splitted = date.split("-");
    var dateObject = new Date(splitted[0], splitted [1] - 1, +splitted[2]).toLocaleDateString();
    return dateObject;
    }
}


initFirebaseAuth();