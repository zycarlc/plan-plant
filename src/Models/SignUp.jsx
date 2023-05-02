import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from ".."

export default function createUser(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            // Signed in
            const user = userCredential.user
            console.log(user)
        })
        .catch(error => {
            const errorCode = error.code
            const errorMessage = error.message
            console.log(errorCode + errorMessage)
        })
}
