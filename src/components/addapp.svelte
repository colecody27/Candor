<script>
	import addIcon from '$lib/static/add.png';
	import Appdropdown from '../components/appdropdown.svelte';
	import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';
	import auth, { db } from '$lib/firebase/firebase.client';
	import { authStore } from '../lib/store/authStore';
	import { dataHandlers } from '../lib/store/fireStore';
	import { AppShell } from '@skeletonlabs/skeleton';

	export let term = '';
	let role = '';
	let company = '';
	let location = '';

	const handleSubmission = async (e, r, c, t) => {
		if (e.key == 'Enter' || e.key == 13) {
			dataHandlers.addApp(r, c, t);
			company = '';
			location = '';
		}
	};
</script>

<div class="card p-4 w-3/4 mb-5 mt-10 m-auto max-w-2xl justify-between ">
	<div class='flex flex-wrap justify-center'>
		<!-- Role -->
		<div class="inline-block">
			<h3 class="text-l text-center">Role</h3>
			<input
				class="input"
				bind:value={role}
				type="text"
				on:keydown={async (e) => {
					handleSubmission(e, role, company, term);
				}}
			/>
		</div>
		<!-- Company  -->
		<div class="inline-block">
			<h3 class="text-l text-center">Company</h3>
			<input
				class="input"
				bind:value={company}
				type="text"
				on:keydown={async (e) => {
					handleSubmission(e, role, company, term);
				}}
			/>
		</div>
		<!-- Location -->
		<div class="inline-block">
			<h3 class="text-l text-center">Location</h3>
			<input
				class="input"
				bind:value={location}
				type="text"
				on:keydown={async (e) => {
					handleSubmission(e, role, company, term);
				}}
			/>
		</div>
	</div>

	<button
		on:click={() => {
			// ADD APP
			dataHandlers.addApp(role, company, term);

			// RESET VALUES
			company = '';
			location = '';
		}}
		class=" btn btn-sm variant-filled-secondary flex m-auto justify-center mt-3"
		><!--<img class="h-6 w-6 m-auto" src={addIcon} alt="" />-->Submit</button
	>
</div>
