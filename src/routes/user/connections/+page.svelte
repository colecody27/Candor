<script lang="ts">
	import { Toast, getToastStore, Avatar } from '@skeletonlabs/skeleton';
	import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';
	import { dataHandlers } from '$lib/store/fireStore';
	import { authStore } from '$lib/store/authStore';

	let email;
	const toastStore = getToastStore();
	const success: ToastSettings = {
		message: 'Request sent!',
		background: 'variant-filled-success'
	};
	const fail: ToastSettings = {
		message: 'Unable to send request!',
		background: 'variant-filled-error'
	};

	const handleSubmission = async (e) => {
		if (e.key == 'Enter' || e.key == 13) {
			const response = await dataHandlers.sendReq(email);
			email = '';
			if (response) toastStore.trigger(success);
			else toastStore.trigger(fail);
		}
	};
</script>

<!-- Add Connection -->
<div class="flex flex-col space-y-3 mt-10">
	<h2 class="h2 m-auto">Add Connection</h2>
	<input
		bind:value={email}
		class=" text-center input w-1/4 m-auto"
		title="Input (email)"
		type="email"
		placeholder="kate@example.com"
		autocomplete="email"
		on:keydown={async (e) => {
			handleSubmission(e);
		}}
	/>
</div>

<!-- Received Requests -->
<div class="flex flex-col space-y-3 mt-10">
	<h2 class="h2 flex m-auto">Received Requests</h2>
	<div class="mx-5 flex flex-row">
		{#each $authStore.rcvdReqs as req}
			<!-- Avatar -->
			<div class="card p-4 w-72 shadow-xl flex flex-col items-center justify-center">
				<!-- User info -->
				<Avatar
					initials={req.name.split(' ')[0].charAt(0) + req.name.split(' ')[1].charAt(0)}
					border="border-4 border-surface-300-600-token hover:!border-primary-500"
					cursor="cursor-pointer"
				></Avatar>
				<p>{req.name}</p>
				<p>{req.email}</p>

				<div class="mt-3 flex gap-4">
					<!-- Accept -->
					<button
						class="btn btn-md variant-filled-success"
						on:click={() => dataHandlers.acceptReq(req)}>Accept</button
					>
					<!-- Deny -->
					<button class="btn btn-md variant-filled-error" on:click={() => dataHandlers.denyReq(req)}
						>Deny</button
					>
				</div>
			</div>
		{/each}
	</div>
</div>

<!-- Friends -->
<div class="flex flex-col mt-10">
	<h2 class="h2 flex m-auto">Connections</h2>
	<div class=" mt-5 m-auto justify-center flex flex-wrap">
		{#each $authStore.friends as friend}
			<!-- Avatar -->
			<div class="card p-4 mr-5 mb-5 w-60 shadow-xl">
				<button
					on:click={async () => {
						await dataHandlers.getFriend(friend);
						window.location.href = '/user/friend';
					}}
					class="flex m-auto"
				>
					<!-- User info -->
					<div class="flex flex-col items-center justify-center">
						<Avatar
							initials={friend.name.split(' ')[0].charAt(0) + friend.name.split(' ')[1].charAt(0)}
							border="border-4 border-surface-300-600-token hover:!border-primary-500"
							cursor="cursor-pointer"
						></Avatar>
						<p>{friend.name}</p>
						<p>{friend.email}</p>
					</div>
				</button>
				
				<!-- Remove friend -->
				<div class='mt-2 flex flex-col items-center justify-center'>
					<button
						class="btn-md btn variant-filled-error"
						on:click={() => {
							dataHandlers.removeFriend(friend);
						}}>Remove
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
