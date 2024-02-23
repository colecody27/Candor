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
			// Load applications 
			if (User) { 
				const route = 'users/' + User?.email + '/applications'
				const querySnpsht = await getDocs(collection(db, route))
				const tempApps = [{}]
				querySnpsht.forEach((doc) => {
					tempApps.push(doc.data())
				})
			
				// Update store
				authStore.update((curr) => {
					return {...curr, isLoading:false, currentUser:true, user: User, apps : tempApps}
				})
			}
		})
	})


</script>

<Modal />
<slot/>