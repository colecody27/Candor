<script lang="ts">
	import { initializeStores, Modal } from '@skeletonlabs/skeleton';
	import '../app.postcss';
	import {onMount} from 'svelte'
	import auth from '$lib/firebase/firebase.client'
	import { authStore} from '../lib/store/authStore';
	import { collection, addDoc, doc, setDoc, getDoc, getDocs } from "firebase/firestore"; 
	import { db } from '$lib/firebase/firebase.client'

	// Initialization for modal
	initializeStores();

	onMount(() => {	
		const unsubscribe = auth.onAuthStateChanged(async (User) => {
			// Load data
			if (User) { 
				// Applications
				const appsRoute = 'users/' + User?.email + '/applications'
				const querySnpsht = await getDocs(collection(db, appsRoute))
				const tempApps = [{}]
				
				// Iterate through data
				querySnpsht.forEach((doc) => {
					// Get data 
					let docData = doc.data()

					// Add reference to get doc from DB
					docData.Id = doc.id

					// Convert interview data to array of values
					docData.Interviews = Object.entries(docData.Interviews)

					tempApps.push(docData)
				})
				
				// Terms
				const userRef = doc(db, 'users', User.email)
				const userSnpsht = await getDoc(userRef)
			
				// Update store
				authStore.update((curr) => {
					return {...curr, isLoading:false, currentUser:true, user:User, apps:tempApps, terms:userSnpsht.data()?.terms}
				})
			}
		})
	})


</script>

<Modal />
<slot/>