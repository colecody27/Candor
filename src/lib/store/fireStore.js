import { writable } from "svelte/store";
import { db } from '$lib/firebase/firebase.client'
import { collection, addDoc, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion } from "firebase/firestore"; 
import { authStore } from './authStore';

/** @type {import("@firebase/auth").User} */
let User
authStore.subscribe((curr) => {
    User = curr?.user
})

export const dataHandlers = {
    // ADD APPLICATION 
    addApp: async (role, company, term) => {
        
        // CREATE APP
        const application = {
            Company : company,
            Role : role,
            Term : term,
            Status : "Submitted", 
            Interviews : "None",
            Location : "TBD", 
            Platform : "TBD",
            Topics : ["TBD", "TBD"]
        }
        
        // UPDATE DB
        const route = 'users/' + User.email + '/applications'
        const docRef = await addDoc(collection(db, route), application)

        // UPDATE LOCAL STORAGE 
        if (docRef) {
            authStore.update((curr) => {
                return {...curr, apps:[...curr.apps, application]}
            })
        }
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
    },

    // GET ALL APPLICATIONS
    getApps: async () => {
        const route = 'users/' + User.email + '/applications'
        const querySnpsht = await getDocs(collection(db, route))
        const applications = []
        querySnpsht.forEach((doc) => {
            applications.push(doc.data)
        })
        
    },

    // ADD APPLICATION 
    addTerm: async (term) => {
        
        // UPDATE DB
        const route = 'users/' + User.email
        const docRef = doc(db, route)
        await updateDoc(docRef, {
            terms: arrayUnion(term)
        });

        // UPDATE LOCAL STORAGE 
        if (docRef) {
            authStore.update((curr) => {
                return {...curr, terms:[term, ...curr.terms]}
            })
        }
    },    

}

