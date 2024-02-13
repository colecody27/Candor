import { writable } from "svelte/store";
import { db } from '$lib/firebase/firebase.client'
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore"; 
import { authStore } from '../store/authStore';

/** @type {import("@firebase/auth").User} */
let User
authStore.subscribe((curr) => {
    User = curr?.user
})



export const dataHandlers = {
    // ADD APPLICATION 
    addApp: async (role, company, term) => {
        // Create application to pass information
        const application = {
            Role : role,
            Company : company
        }
        
        // Add application to collection
        const route = 'users/' + User.email + '/terms/' + term + '/applications'
        const docRef = await addDoc(collection(db, route), application)
    },

    // UPDATE APPLICATION 
    updateApp: async (role, company, period) => {
        // Create application to pass information
        const application = {
            Role : role,
            Company : company,
            Period : period
        }
        
        // Add application to collection
        const route = 'users/' + User.email + '/applications'
        const docRef = await addDoc(collection(db, route), application)
    },

    // REMOVE APPLICATION 
    removeApp: async (role, company, period) => {
        // Create application to pass information
        const application = {
            Role : role,
            Company : company,
            Period : period
        }
        
        // Add application to collection
        const route = 'users/' + User.email + '/applications'
        const docRef = await addDoc(collection(db, route), application)
    }

    // GET ALL APPLICATIONS
    getApps: async () => {
        const route = 'users/' + User.email + '/terms/'
    }

}

