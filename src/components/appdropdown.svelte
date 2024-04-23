<script>
	import { dataHandlers } from '$lib/store/fireStore';
	import { authStore } from '$lib/store/authStore';
	import addIcon from '$lib/static/add.png';
	import removeIcon from '$lib/static/removeIcon.png';
	import { getModalStore, InputChip } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
	export let app = {};
	let tempNotes = app.Notes;
	let currResume = app.resume; 
	let innerWidth = 0; 

	$: {
		dataHandlers.updateTopics(app.Id, app.Topics);
		console.log('Update topics');
	}
</script>

<svelte:window bind:innerWidth/>

<div class="md:text-2xl sm:text-lg">
	<!-- Status -->
	<div class="justify-between flex md:text-2xl sm:text-l">
		<div>
			<h3 class="inline-block ">Status:</h3>
			{#if app.Status}
				<button
					class="variant-filled inline-block btn btn-sm"
					on:click={() => {
						dataHandlers.updateStatus(app.Id, !app.Status);
					}}>Submitted</button
				>
			{:else}
				<button
					class="variant-filled-error inline-block btn btn-sm"
					on:click={() => {
						dataHandlers.updateStatus(app.Id, !app.Status);
					}}>Rejected</button
				>
			{/if}
		</div>
		
		<!-- Resumes -->
		{#if innerWidth > 700}
			<div class="flex ">
				<h3 class="mr-2">Resume:</h3>
				<select class='select' name="" id="" bind:value={app.resume} on:change={ async () => {await dataHandlers.updateAppResume(app.Id, app.resume, currResume); currResume = app.resume; console.log("Update resume")}} >
					{#each Object.entries($authStore.resumes) as resume}
						<option value={resume[0]}>{resume[0]}</option>	
					{/each}
				</select>
			</div>
		{/if}

		<!-- Delete -->
		{#if innerWidth > 700}
			<div class="block">
				<button
				class="inline-block btn-sm btn variant-filled-error"
				on:click={() => {
					dataHandlers.removeApp(app.Id);
				}}>Remove</button
			>
			</div>
		{/if}
</div>
	{#if innerWidth < 700}
		<div class="flex flex-wrap ">
			<h3 class="mr-2">Resume:</h3>
			<select class='select' name="" id="" bind:value={app.resume} on:change={ async () => {await dataHandlers.updateAppResume(app.Id, app.resume, currResume); currResume = app.resume; console.log("Update resume")}} >
				{#each Object.entries($authStore.resumes) as resume}
					<option value={resume[0]}>{resume[0]}</option>	
				{/each}
			</select>
		</div>
	{/if}
	<!-- Interviews  -->
	<div class="mt-4">
		<h3 class="">
			Interviews:
			<button
				on:click={async () => {
					// MODAL
					new Promise((resolve) => {
						const modal = {
							type: 'prompt',
							// Data
							title: 'Enter interview type',
							body: 'Provide a name for the interview in the field below.',
							// Populates the input value and attributes
							value: 'Ex: Whiteboard',
							valueAttr: { type: 'text', minlength: 4, maxlength: 20, required: true },
							// Returns the updated response value
							response: (r) => resolve(r)
						};
						modalStore.trigger(modal);
					}).then(async (r) => {
						if (r) await dataHandlers.addInterview(app.Id, r);
					});
				}}
				class=" btn-icon h-6 w-6 variant-filled-secondary"
				><img class="h-4 w-4 m-auto" src={addIcon} alt="" />
			</button>
		</h3>

		<ul>
			{#if app.Interviews.length >= 1}
				{#each app.Interviews as [key, value]}
					<li class="ml-4 mt-2">
						<button
							class="btn-icon h-4 w-4 variant-filled-error"
							on:click={() => {
								dataHandlers.removeInterview(app.Id, key);
							}}><img class="h-4 w-4 m-auto" src={removeIcon} alt="" /></button
						>
						<h2 class="inline-block sm:text-sm md:text-lg">{key}:</h2>
						{#if value === 'Rejected'}
							<button
								class="variant-filled-error inline-block btn btn-sm"
								on:click={() => {
									dataHandlers.updateInterview(app.Id, key, value);
								}}>{value}</button
							>
						{:else if value === 'Pending'}
							<button
								class="variant-filled-secondary inline-block btn btn-sm"
								on:click={() => {
									dataHandlers.updateInterview(app.Id, key, value);
								}}>{value}</button
							>
						{:else}
							<button
								class="variant-filled inline-block btn btn-sm"
								on:click={() => {
									dataHandlers.updateInterview(app.Id, key, value);
								}}>{value}</button
							>
						{/if}
					</li>
				{/each}
			{/if}
		</ul>
	</div>

	<!-- Online Assessment -->
	<div class="mt-4 flex flex-col">
		<h3 class="">Online Assessment:</h3>
		<h2 class="ml-4 mt-2 inline-block md:text-lg sm:text-md">Platform:</h2>
		<select bind:value={app.Platform} on:change={ async () => {await dataHandlers.updatePlatform(app.Id, app.Platform); console.log("Update platform")}} class="select max-w-max">
			<option value="Unknown">Unknown</option>
			<option value="CodeSignal">CodeSignal</option>
			<option value="Leetcode">Leetcode</option>
			<option value="HackerRank">HackerRank</option>
			<option value="Coderbyte">Coderbyte</option>
			<option value="Codility">Codility</option>
			<option value="HackerEarth">HackerEarth</option>
			<option value="DevSkiller">DevSkiller</option>
			<option value="Other">Other</option>
		</select>

		<h2 class="mt-2 md:text-lg sm:text-md inline-block ">Topics:</h2>
		<InputChip
			class="flex"
			bind:value={app.Topics}
			name="chips"
			placeholder="Enter any related topics..."
		/>
	</div>

	<!-- Notes-->
	<div class="mt-4">
		<h3 class="">Notes</h3>
		<textarea
			class="textarea"
			rows="3"
			placeholder="Click outside of notes to save..."
			bind:value={tempNotes}
			on:blur={async () => await dataHandlers.updateNotes(app.Id, tempNotes)}
		/>
	</div>


	<!-- Delete -->
	{#if innerWidth < 700}
		<div class="block">
			<button
			class="inline-block btn-sm btn variant-filled-error flex m-auto"
			on:click={() => {
				dataHandlers.removeApp(app.Id);
			}}>Remove</button
		>
		</div>
	{/if}
</div>
