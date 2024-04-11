<script>
	import { dataHandlers } from '$lib/store/fireStore';
	import { authStore } from '$lib/store/authStore';
	import { Avatar, TabGroup, Tab, Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import Appdropdown_view from '../../../components/appdropdown_view.svelte';
	import Overviewstats from '../../../components/overviewstats.svelte';
	import Activity from '../../../components/activity.svelte';

	console.log($authStore?.friend);
	$: name = $authStore?.friend.name;
	$: email = $authStore?.friend.email;
	$: apps = $authStore?.friend.apps;
	$: terms = $authStore?.friend.terms;
	let tabSet = $authStore?.terms[0];
</script>

<div class="flex flex-row m-10">
	<!-- Avatar -->
	<div class="card p-4 w-60 flex flex-col size-fit shadow-xl">
		<div class="flex flex-col items-center justify-center">
			{#if (name.split(' ').length < 2) }
			<Avatar
				initials={name.split(' ')[0].charAt(0)}
				border="border-4 border-surface-300-600-token hover:!border-primary-500"
				cursor="cursor-pointer"
			></Avatar>
			{:else}
				<Avatar
					initials={name.split(' ')[0].charAt(0) +
					name.split(' ')[1].charAt(0)}
					border="border-4 border-surface-300-600-token hover:!border-primary-500"
					cursor="cursor-pointer"
				></Avatar>
			{/if}
			<p>{name}</p>
			<p>{apps.length} applications</p>
		</div>
		<div class="mt-2">
			<Activity {apps} />
		</div>
	</div>
	<!-- Graph -->
	<div>
		<Overviewstats {apps} />
	</div>
</div>

<!-- Applications -->
<div class="w-3/4 m-auto mt-20">
	<div class=" m-auto mt-20">
		<h1 class="text-3xl mb-5">Applications</h1>
		<TabGroup>
			<!-- TABS -->
			{#each terms as term}
				<Tab bind:group={tabSet} name="tab1" value={term}>
					<svelte:fragment slot="lead">
						{term}
					</svelte:fragment>
					<span>{apps.filter((app) => app.Term === term).length} apps</span>
				</Tab>
			{/each}

			<!-- TAB CONTENTS -->
			<svelte:fragment slot="panel">
				<Accordion>
					{#each apps as app}
						{#if app?.Term === tabSet}
							<AccordionItem>
								<svelte:fragment slot="lead"
									><h3 class="text-lg">{app?.Role}, {app?.Company}</h3></svelte:fragment
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
										<Appdropdown_view {app} />
									</div>
								</svelte:fragment>
							</AccordionItem>
						{/if}
					{/each}
				</Accordion>
			</svelte:fragment>
		</TabGroup>
	</div>
</div>
