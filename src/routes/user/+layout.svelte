<script lang="ts">
	import '../../app.postcss';
	import {
		AppShell,
		AppBar,
		Avatar,
		AppRail,
		AppRailTile,
		AppRailAnchor,
		popup,
		storePopup,
		initializeStores,
		Drawer,
		getDrawerStore
	} from '@skeletonlabs/skeleton';
	import { authHandlers, authStore } from '../../lib/store/authStore';
	import auth from '$lib/firebase/firebase.client';
	import { onMount, beforeUpdate } from 'svelte';
	import { page } from '$app/stores';
	import { onAuthStateChanged } from 'firebase/auth';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import anaIcon from '$lib/static/analytics.png';
	import appIcon from '$lib/static/applications.png';
	import connIcon from '$lib/static/connections.png';
	import overIcon from '$lib/static/overview.png';
	import { collection, addDoc, doc, setDoc, getDoc, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase/firebase.client';
	import Activity from '../../components/activity.svelte';

	// Drawer 
	initializeStores();
	const drawerStore = getDrawerStore();
	function drawerOpen(): void {
		drawerStore.open({});
	}
	function drawerClose(): void {
    	drawerStore.close();
	}

	// Instantiate pop up
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	/** @type {@skeletonlabs/skeleton').PopupSettings} */
	const popupClick = {
		// Represents the type of event that opens/closed the popup
		event: 'click',
		// Matches the data-popup value on your popup element
		target: 'popupFeatured',
		// Defines which side of your trigger the popup will appear
		placement: 'bottom'
	};

	/** @type {import("@firebase/auth").User} */
	export let User;
	let name; 
	
	authStore.subscribe((curr) => {
		User = curr?.user;
		name = curr?.name; 
	});

	onMount(() => {
		onAuthStateChanged(auth, (User) => {
			if (!User) window.location.href = '/';
		});
	});

	// Logout
	async function handleLogout() {
		await authHandlers.logout(auth);
		window.location.href = '/';
	}
</script>

<!--LOADED-->
{#if $authStore.currentUser}

<Drawer> 
	<AppRail>
		<!-- Tiles -->
		<AppRailAnchor href="overview" on:click={drawerClose} selected={$page.url.pathname === '/user/overview'}>
			<svelte:fragment slot="lead">
				<img src={overIcon} class="h-8" alt="" />
			</svelte:fragment>
			<span>Overview</span>
		</AppRailAnchor>
		<AppRailAnchor href="applications" on:click={drawerClose} selected={$page.url.pathname === '/user/applications'}>
			<svelte:fragment slot="lead">
				<img src={appIcon} class="h-8" alt="" />
			</svelte:fragment>
			<span>Applications</span>
		</AppRailAnchor>
		<AppRailAnchor href="connections" on:click={drawerClose} selected={$page.url.pathname === '/user/connections'}>
			<svelte:fragment slot="lead">
				<img src={connIcon} class="h-8" alt="" />
			</svelte:fragment>
			<span>Connections</span>
		</AppRailAnchor>
	</AppRail>
</Drawer>
	<!-- App Shell -->
	<AppShell  slotSidebarLeft="w-0 lg:w-64">
		<!-- App Bar -->
		<svelte:fragment slot="header">
			<AppBar>
				<svelte:fragment slot="lead">
					<div class="flex items-center">
						<button on:click={drawerOpen} class="lg:hidden btn btn-sm mr-4">
							<span>
								<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
									<rect width="100" height="20" />
									<rect y="30" width="100" height="20" />
									<rect y="60" width="100" height="20" />
								</svg>
							</span>
						</button>
						<!--Title-->
						<strong class="text-4xl">Candor</strong>
					</div>
				</svelte:fragment>


				<svelte:fragment slot="trail">
					<div class="card p-4 w-40 shadow-xl" data-popup="popupFeatured">
						<a class="block text-center" href="profile">Profile</a>
						<button
							type="button"
							on:click={handleLogout}
							class="variant-filled btn-md rounded-md block m-auto">Logout</button
						>
						<!--<div class="arrow bg-surface-100-800-token" /> -->
					</div>
					<button use:popup={popupClick} class="">
						<!--Avatar-->
						{#if (name.split(' ').length < 2) }
							<Avatar
								class='m-auto'
								initials={name.split(' ')[0].charAt(0)}
								border="border-4 border-surface-300-600-token hover:!border-primary-500"
								cursor="cursor-pointer"
							></Avatar>
						{:else}
							<Avatar
								class='m-auto'
								initials={name.split(' ')[0].charAt(0) +
								name.split(' ')[1].charAt(0)}
								border="border-4 border-surface-300-600-token hover:!border-primary-500"
								cursor="cursor-pointer"
							></Avatar>
						{/if}
						<!-- -->
						<!--Username-->
						<h1 class="mr-2">{name}</h1>
						<Activity apps={$authStore.apps} />
					</button>
				</svelte:fragment>
			</AppBar>
		</svelte:fragment>

		<!--Apprail-->
		<svelte:fragment slot="sidebarLeft">
			<AppRail>
				<!-- Tiles -->
				<AppRailAnchor href="overview" selected={$page.url.pathname === '/user/overview'}>
					<svelte:fragment slot="lead">
						<img src={overIcon} class="h-8" alt="" />
					</svelte:fragment>
					<span>Overview</span>
				</AppRailAnchor>
				<AppRailAnchor href="applications" selected={$page.url.pathname === '/user/applications'}>
					<svelte:fragment slot="lead">
						<img src={appIcon} class="h-8" alt="" />
					</svelte:fragment>
					<span>Applications</span>
				</AppRailAnchor>
				<AppRailAnchor href="connections" selected={$page.url.pathname === '/user/connections'}>
					<svelte:fragment slot="lead">
						<img src={connIcon} class="h-8" alt="" />
					</svelte:fragment>
					<span>Connections</span>
				</AppRailAnchor>
			</AppRail>
		</svelte:fragment>

		<slot />

		<!-- Footer -->
		<svelte:fragment slot="footer">
			<h1 class="text-center">© 2024 Candor</h1>
		</svelte:fragment>
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
								cursor="cursor-pointer"
							></Avatar>
						</div>
						<h2 class="placeholder"></h2>
					</div>
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
			<AppRailAnchor href="connections" title="Account">
				<svelte:fragment slot="lead">(icon)</svelte:fragment>
				<span>Connections</span>
			</AppRailAnchor>
			<!-- -->

			<svelte:fragment slot="trail">
				<AppRailAnchor href="/" title="Account">(icon)</AppRailAnchor>
			</svelte:fragment>
		</AppRail>
	</AppShell>
	<!--<div class = "h-screen flex items-center justify-center delay-500 placeholder animate-pulse m-auto">
		<h1 class = "text-4xl">Loading...</h1>
	</div>-->
{/if}
