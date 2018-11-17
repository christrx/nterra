document.addEventListener("DOMContentLoaded", event => {

    const app = firebase.app();
    console.log(app)
});


function googleLogin(){
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)

        .then(result => {
            const user = result.user;
<<<<<<< HEAD
            document.write('Hello ' + user.displayName);
=======
>>>>>>> SignOut Button
            console.log(user)
        })
        .catch(console.log)
};

function googleLogout(){
    firebase.auth().signOut().then(result =>{
        document.write("Sign Out Successful")


    }).catch(function(error){

});}