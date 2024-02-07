<script lang="ts">
	import '../app.postcss';
	import {onMount} from 'svelte'
	import auth from '$lib/firebase/firebase.client'
	import { authStore } from '../store/authStore';

	onMount(() => {
		auth.onAuthStateChanged((User) => {
			authStore.update((curr) => {
				return {...curr, isLoading:false, currentUser:true, user: User}
			})
		})
	})


</script>


<slot/>