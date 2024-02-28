import { writable } from "svelte/store";
import { db } from '$lib/firebase/firebase.client'
import { collection, addDoc, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion, query, where, deleteDoc, deleteField} from "firebase/firestore"; 
import { authStore } from './authStore';
import { update } from "firebase/database";

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
            Status : true, 
            Interviews : {},
            Location : "TBD", 
            Platform : "Unknown",
            Notes : "", 
            Topics : []
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

    // UPDATE STATUS
    updateStatus: async (id, status) => {
        const route = 'users/' + User.email + '/applications/' + id
        const docRef = doc(db, route)
        
        // UPDATE DB 
        await updateDoc(docRef, {"Status" : status})

        // UPDATE LOCAL STORAGE 
        if (docRef) {
            authStore.update((curr) => {
                const indx = curr.apps.findIndex((app) => app.Id === id)
                curr.apps.at(indx).Status = status
                return curr
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
    removeApp: async (id) => {
        // UPDATE DB 
        const route = 'users/' + User.email + '/applications/' + id
        await deleteDoc(doc(db, route))
        
        // UPDATE LOCAL STORAGE 
        authStore.update((curr) => {
            const indx = curr.apps.findIndex((app) => app.Id === id)
            curr.apps.splice(indx, indx)
            return curr
        })
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
    
     // ADD INTERVIEW  
     addInterview: async (id, interview) => {
        // UPDATE DB
        const keyName = "Interviews." + interview
        const route = 'users/' + User.email + '/applications/' + id
        const docRef = doc(db, route)

        await updateDoc(docRef, {
            ["Interviews." + interview] : "Pending"
        });

        // UPDATE LOCAL STORAGE 
        if (docRef) {
            authStore.update((curr) => {
                const indx = curr.apps.findIndex((app) => app.Id === id)
                curr.apps.at(indx).Interviews.push([interview, "Pending"])
                return curr
            })
        }
    },

    // REMOVE INTERVIEW 
    removeInterview: async (id, key) => {
        // UPDATE DB 
        const route = 'users/' + User.email + '/applications/' + id
        const docRef = doc(db, route)
        
        await updateDoc(docRef, {
            ["Interviews." + key] : deleteField()
        });
        
        // UPDATE LOCAL STORAGE 
        authStore.update((curr) => {
            const appIndx = curr.apps.findIndex((app) => app.Id === id)
            const app = curr.apps.at(appIndx)
            const getIndx = () => {
                for (var i = 0; i < app.Interviews.length; i++) {
                    if (app.Interviews[i][0] === key)
                        return i
                } 
                return -1
            }
            const intIndx = getIndx();

            if (intIndx >= 0)
                curr.apps.at(appIndx).Interviews.splice(intIndx, 1)
            else 
                console.log("here")
            return curr
        })
    },

    // UPDATE INTERVIEW 
    updateInterview: async (id, key, value) => {
        // UPDATE DB 
        const route = 'users/' + User.email + '/applications/' + id
        const docRef = doc(db, route)
        let updatedValue = "Rejected"

        if (value === "Pending")   
            updatedValue = "Advanced"
        else if (value === "Advanced")
            updatedValue = "Rejected"
        else if (value === "Rejected")
            updatedValue = "Pending"

        await updateDoc(docRef, {
            ["Interviews." + key] : updatedValue
        });
        
        // UPDATE LOCAL STORAGE 
        authStore.update((curr) => {
            const appIndx = curr.apps.findIndex((app) => app.Id === id)
            const app = curr.apps.at(appIndx)
            const getIndx = () => {
                for (var i = 0; i < app.Interviews.length; i++) {
                    if (app.Interviews[i][0] === key)
                        return i
                } 
                return -1
            }
            const intIndx = getIndx();

            if (intIndx >= 0)
                curr.apps.at(appIndx).Interviews[intIndx][1] = updatedValue

            return curr
        })
    },

    // UPDATE PLATFORM  
    updatePlatform: async (id, platform) => {
        // UPDATE DB
        const route = 'users/' + User.email + '/applications/' + id
        const docRef = doc(db, route)

        await updateDoc(docRef, {
            Platform : platform
        });

        // UPDATE LOCAL STORAGE 
        if (docRef) {
            authStore.update((curr) => {
                const indx = curr.apps.findIndex((app) => app.Id === id)
                curr.apps.at(indx).Platform = platform
                return curr
            })
        }
    },

    // UPDATE TOPICS 
    updateTopics: async (id, topics) => {
        // UPDATE DB
        const route = 'users/' + User.email + '/applications/' + id
        const docRef = doc(db, route)

        await updateDoc(docRef, {
            Topics : topics
        });

        // UPDATE LOCAL STORAGE 
        if (docRef) {
            authStore.update((curr) => {
                const indx = curr.apps.findIndex((app) => app.Id === id)
                curr.apps.at(indx).Topics = topics
                return curr
            })
        }
    },

    // UPDATE NOTES 
    updateNotes: async (id, note) => {
        // UPDATE DB
        const route = 'users/' + User.email + '/applications/' + id
        const docRef = doc(db, route)

        await updateDoc(docRef, {
            Notes : note
        });

        // UPDATE LOCAL STORAGE 
        if (docRef) {
            authStore.update((curr) => {
                const indx = curr.apps.findIndex((app) => app.Id === id)
                curr.apps.at(indx).Notes = note
                return curr
            })
        }
    },
}

