<script lang=ts>
	import { Accordion, AccordionItem, TabGroup, Tab, TabAnchor, popup } from '@skeletonlabs/skeleton';
	import Appdropdown from '../../../components/appdropdown.svelte';
	import Addapp from '../../../components/addapp.svelte';
	import { dataHandlers } from '../../../lib/store/fireStore';
	import { authStore } from '../../../lib/store/authStore';
	import { onMount } from 'svelte';
	import addIcon from '$lib/static/add.png';
	import editIcon from '$lib/static/editIcon.png';
	import { getModalStore, Toast, getToastStore, } from '@skeletonlabs/skeleton';
	
	const modalStore = getModalStore();
	const toastStore = getToastStore();
	let tabSet = $authStore?.terms[0];
	const popupHover = {
		event: 'hover',
		target: 'popupHover',
		placement: 'bottom'
	};

	const fail: ToastSettings = {
		message: 'Term must be unique 😕',
		background: 'variant-filled-error'
	};
</script>

<!-- Recommended Roles -->
<div class="w-3/4 m-auto mt-20">
	<h1 class="text-3xl mb-5">Recommended Roles</h1>
	<Accordion>
		<div class="rounded-b-xl">
			<h3 class='h5 text-center '>No recommendations at this time </h3>
			 <h3 class='text-center'>☹️</h3>
	</Accordion>
</div>

<div class="w-3/4 m-auto mt-20">
	<!-- Applications -->
	<div class=" m-auto mt-20">
		<h1 class="text-3xl mb-5">Applications</h1>

		{#if $authStore.currentUser}
			<TabGroup>
				<!-- TABS -->
				{#each $authStore.terms as term}
					<Tab bind:group={tabSet} name="tab1" value={term}>
						<svelte:fragment slot="lead">
							{term}
							<button
								on:click={async () => {
									// Rename term
									new Promise((resolve) => {
										const modal = {
											type: 'prompt',
											// Data
											title: 'Rename Term',
											body: 'Provide a new name for this term in the field below.',
											// Populates the input value and attributes
											value: `${term}`,
											valueAttr: { type: 'text', minlength: 4, maxlength: 20, required: true },
											// Returns the updated response value
											response: (r) => resolve(r)
										};
										modalStore.trigger(modal);
									}).then(async (r) => {
										if (r) {
											if ($authStore.terms.includes(r))
												toastStore.trigger(fail)
											else {
												await dataHandlers.editTerm(term, r);
												tabSet = r;
											}
											
										}
									});
								}}
								class="btn-icon h-4 w-4"
								><img class="m-auto" src={editIcon} alt="" />
							</button>
						</svelte:fragment>
						<span>{$authStore.apps.filter((app) => app.Term === term).length} apps</span>
					</Tab>
				{/each}

				<!-- Add term tab -->
				<Tab bind:group={tabSet} name="addtab" value={'Add term'}>
					<svelte:fragment slot="lead">
						<button
							on:click={async () => {
								// MODAL
								new Promise((resolve) => {
									const modal = {
										type: 'prompt',
										// Data
										title: 'Enter Term Name',
										body: 'Provide a name for the term in the field below.',
										// Populates the input value and attributes
										value: 'Ex: Spring 2024',
										valueAttr: { type: 'text', minlength: 4, maxlength: 20, required: true },
										// Returns the updated response value
										response: (r) => resolve(r)
									};
									modalStore.trigger(modal);
								}).then(async (r) => {
									if (r) {
										if ($authStore.terms.includes(r))
											toastStore.trigger(fail)
										else {
											await dataHandlers.addTerm(r);
											tabSet = r;
										}
									} 
								});
							}}
							class="btn-icon h-8 w-8 variant-filled-secondary [&>*]:pointer-events-none" use:popup={popupHover}
						>
							<img class="h-6 w-6 m-auto" src={addIcon} alt="" />
						</button>
						<div class="card p-4 variant-filled-secondary" data-popup="popupHover">
							<p>Create a term</p>
							<div class="arrow variant-filled-secondary" />
						</div>
					</svelte:fragment>
				</Tab>

				<!-- TAB CONTENTS -->
				<svelte:fragment slot="panel">
					{#if $authStore.terms.length == 0}
						<h3 class="text-2xl m-auto text-center">Add a new term to get started</h3>
					{:else}
						<Addapp term={tabSet} />
						<Accordion>
							{#each $authStore.apps as app}
								{#if app?.Term === tabSet}
									<AccordionItem>
										<svelte:fragment slot="lead"
											><h3 class="md:text-lg sm:text-sm">{app?.Role}, {app?.Company}</h3></svelte:fragment
										>
										<svelte:fragment slot="summary">
											<p class="text-right">
												{app?.Date.toDate().toLocaleDateString('en-us', {
													month: 'short',
													day: 'numeric',
													year: 'numeric'
												})}
											</p>
										</svelte:fragment>
										<svelte:fragment slot="content">
											<div class="card p-4">
												<Appdropdown {app} />
											</div>
										</svelte:fragment>
									</AccordionItem>
								{/if}
							{/each}
							<button
								class="flex m-auto mt-11 btn-md btn variant-filled-error"
								on:click={async () => {
									// MODAL
									new Promise((resolve) => {
										const modal = {
											type: 'confirm',
											// Data
											title: 'Please Confirm',
											body: 'Are you sure you wish to remove this term and all applications associated?',
											// TRUE if confirm pressed, FALSE if cancel pressed
											response: (r) => resolve(r)
										};
										modalStore.trigger(modal);
									}).then(async (r) => {
										if (r) {
											await dataHandlers.removeTerm(tabSet);
											tabSet = $authStore?.terms[0]
										}
									});
								}}
								>Remove Term
							</button>
						</Accordion>
					{/if}
				</svelte:fragment>
			</TabGroup>
		{/if}
	</div>
</div>
