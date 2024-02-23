import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { writable } from "svelte/store";
import { collection, addDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore"; 
import { db } from '$lib/firebase/firebase.client'
import { get } from 'svelte/store';

// USER INFO
/** @type {import("@firebase/auth").User} */
let User 
export const provider = new GoogleAuthProvider();
export const authStore = writable({
    isLoading : true, 
    currentUser : false,
    user : null,
    terms : ["No term"],
    apps : []
})
    
// Object to handle login and logout functions
export const authHandlers = {
    // LOGIN 
    login: async (/** @type {import("@firebase/auth").Auth} */ auth, /** @type {import("@firebase/auth").AuthProvider} */ provider) => {
        const result = await signInWithPopup(auth, provider)

        /** @type {import("@firebase/auth").User} */
        User = result.user

        // CREATE NEW USER
        try {
            if (User.email != null) {
                const userRef = doc(db, "users", User.email)
                const userSnap = await getDoc(userRef)
                if (!userSnap.exists()) {
                    const userCreateRef = await setDoc(doc(db, "users", User.email), {
                        name : User.displayName, 
                        email : User.email,
                        university : "",
                    }) 
                }
            }            
        } catch (e) {
             console.error("Error adding document: ", e); 
            }
        return User
    },
    // LOGOUT
    logout: async (/** @type {import("@firebase/auth").Auth} */ auth) => {
        await signOut(auth)
    }
}

