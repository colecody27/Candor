import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
import { writable } from "svelte/store";

//export const User = writable()

// Can add additional providers such as Github
//export const provider = new GoogleAuthProvider();

// Object to handle login and logout functions
export const authHandlers = {
    // LOGIN 
    login: async (/** @type {import("@firebase/auth").Auth} */ auth, /** @type {import("@firebase/auth").AuthProvider} */ provider) => {
        const result = await signInWithPopup(auth, provider)
        return result.user
    },
    // LOGOUT
    logout: async (/** @type {import("@firebase/auth").Auth} */ auth) => {
        await signOut(auth)
    }
}

