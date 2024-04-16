<script>
	import { dataHandlers } from '$lib/store/fireStore';
	import { authStore } from '$lib/store/authStore';
	import addIcon from '$lib/static/add.png';
	import removeIcon from '$lib/static/removeIcon.png';
	import { getModalStore, InputChip } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();
	export let app = {};
	let tempNotes = app.Notes;
	let currResume = {...app.resume}; 

	$: {
		dataHandlers.updatePlatform(app.Id, app.Platform);
		console.log('Update platform');
	}
	$: {
		dataHandlers.updateTopics(app.Id, app.Topics);
		console.log('Update topics');
	}
	const handleNoteSubmission = async (e) => {
		if (e.key == 'Enter' || e.key == 13) dataHandlers.updateNotes(app.Id, tempNotes);
	};
</script>

<div class="">
	<!-- Status -->
	<div class="justify-between flex">
		<div>
			<h3 class="inline-block text-2xl">Status:</h3>
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
	</div>

	<!-- Resumes -->
		<div class="inline-block">
			<h3 class="inline-block text-2xl">Resume:</h3>
			<select class='select' name="" id="" bind:value={app.resume.name} on:change={ async () => {await dataHandlers.updateAppResume(app.Id, app.resume, currResume); currResume = {...app.resume}; console.log("Update resume")}} >
				{#each Object.entries($authStore.resumes) as resume}
					<option value={resume[0]}>{resume[0]}</option>	
				{/each}
			</select>
		</div>

	<!-- Delete -->
	<div class="block">
		<button
			class="inline-block btn-md btn variant-filled-error"
			on:click={() => {
				dataHandlers.removeApp(app.Id);
			}}>Remove</button
		>
	</div>

	<!-- Interviews  -->
	<div class="mt-4">
		<h3 class="text-2xl">
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
						<h2 class="inline-block">{key}:</h2>
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
		<h3 class="text-2xl">Online Assessment:</h3>
		<h2 class="ml-4 mt-2 inline-block">Platform:</h2>
		<select bind:value={app.Platform} class="select max-w-max">
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

		<h2 class="ml-4 mt-2 inline-block">Topics:</h2>
		<InputChip
			class="min-w-80 max-w-max"
			bind:value={app.Topics}
			name="chips"
			placeholder="Enter any topic related to the OA..."
		/>
	</div>

	<!-- Notes-->
	<div class="mt-4">
		<h3 class="text-2xl">Notes</h3>
		<textarea
			class="textarea"
			rows="3"
			placeholder="Press enter upon completion to save..."
			bind:value={tempNotes}
			on:keydown={async (e) => {
				handleNoteSubmission(e);
			}}
		/>
	</div>
</div>
