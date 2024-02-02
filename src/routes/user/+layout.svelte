<script lang="ts">
	import '../../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { authHandlers } from '../../store/authStore';
	import auth from '$lib/firebase/firebase.client'
	import {onMount} from 'svelte'
	import {onAuthStateChanged } from "firebase/auth"
	import User from '../../routes/+page.svelte'

	onMount(() => {
		onAuthStateChanged(auth, User => {
		if (User) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/auth.user
		const uid = User.uid;
		} else { window.location.href = '/'}
  	});
	})

	async function handleLogout() {
		await authHandlers.logout(auth)
		window.location.href = '/' 
	} 

</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-4xl uppercase">Candor</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<button
					on:click = {() => handleLogout()}
					class="btn btn variant-ghost-surface"
				>
					Logout
				</button>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>