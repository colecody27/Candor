<script lang="ts">
	import '../../app.postcss';
	import { AppShell, AppBar, Avatar, AppRail, AppRailTile, AppRailAnchor } from '@skeletonlabs/skeleton';
	import { authHandlers} from '../../store/authStore';
	import auth from '$lib/firebase/firebase.client';
	import {onMount, beforeUpdate} from 'svelte'
	import {onAuthStateChanged } from "firebase/auth"
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	// import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
	// import {db} from '$lib/firebase/firebase.client' 

	// Instantiate pop up 
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
// 	const popupClick: PopupSettings = {
// 		event: 'click',
// 		target: 'popupClick',
// 		placement: 'top'
// };
	
	import { authStore } from '../../store/authStore';
	let currentTile = 0

	/** @type {import("@firebase/auth").User} */
	export let User
	// let email:string

	authStore.subscribe((curr) => {
		User = curr?.user
		// email = curr?.user?.displayName
	})

	onMount(() => {
		onAuthStateChanged(auth, User => {
		if (!User)
			window.location.href = '/'
	})
  	});

	// Logout
	async function handleLogout() {
		await authHandlers.logout(auth)
		window.location.href = '/' 
	} 

</script>

<!--LOADED-->
{#if $authStore.currentUser}
<!-- App Shell -->
<AppShell>
	<!-- App Bar -->
	<svelte:fragment slot="header">
		<AppBar>
			<!--Title-->
			<svelte:fragment slot="lead">
				<strong class="text-4xl">Candor</strong>
			</svelte:fragment>
			<!-- -->

			<svelte:fragment slot="trail">
				<a href="settings" class = "">
					<!--Avatar-->
					<Avatar 
						initials={User.displayName.split(" ")[0].charAt(0) + User.displayName.split(" ")[1].charAt(0)}
						border="border-4 border-surface-300-600-token hover:!border-primary-500"
						cursor="cursor-pointer">	
					</Avatar>
					<!-- -->
		
					<!--Username-->
					<h1 class = "mr-2">{User.displayName}</h1>
				</a>

			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

		<!--Apprail-->
		<AppRail>
			<!-- Tiles -->
			<AppRailAnchor href="overview" title="Account">
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>Overview</span>
			</AppRailAnchor>
			<AppRailAnchor href="applications" title="Account">
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>Applications</span>
			</AppRailAnchor>
			<AppRailAnchor href="analytics"  title="Account">
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>Analytics</span>
			</AppRailAnchor>
			<AppRailAnchor href="connections"  title="Account">
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>Connections</span>
			</AppRailAnchor>
			<!-- --- -->

			<svelte:fragment slot="trail">
				<AppRailAnchor href="/"  title="Account">(icon)</AppRailAnchor>
			</svelte:fragment>
		</AppRail>
<slot/>
</AppShell>

<!--LOADING-->
{:else}
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<!--Title-->
			<svelte:fragment slot="lead">
				<strong class="text-4xl">Candor</strong>
			</svelte:fragment>
			
			<!--Avatar-->
			<svelte:fragment slot="trail">
				<div>
					<div class="placeholder-circle animate-pulse w-16">
						<Avatar 
						initials="  "
						border="border-4 border-surface-300-600-token hover:!border-primary-500"
						cursor="cursor-pointer">	
						</Avatar>
					</div>
					<h2 class="placeholder"> </h2>
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>

		<!--Apprail-->
		<AppRail>
				<!-- Tiles -->
				<AppRailAnchor href="overview"  title="Account">
					<svelte:fragment slot="lead">(icon)</svelte:fragment>
					<span>Overview</span>
				</AppRailAnchor>
				<AppRailAnchor href="applications"  title="Account">
					<svelte:fragment slot="lead">(icon)</svelte:fragment>
					<span>Applications</span>
				</AppRailAnchor>
				<AppRailAnchor href="analytics"  title="Account">
					<svelte:fragment slot="lead">(icon)</svelte:fragment>
					<span>Analytics</span>
				</AppRailAnchor>
				<AppRailAnchor href="connections"  title="Account">
					<svelte:fragment slot="lead">(icon)</svelte:fragment>
					<span>Connections</span>
				</AppRailAnchor>
				<!-- -->

			<svelte:fragment slot="trail">
				<AppRailAnchor href="/"  title="Account">(icon)</AppRailAnchor>
			</svelte:fragment>
		</AppRail>
</AppShell>
	<!--<div class = "h-screen flex items-center justify-center delay-500 placeholder animate-pulse m-auto">
		<h1 class = "text-4xl">Loading...</h1>
	</div>-->
{/if}