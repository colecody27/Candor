<script lang="ts">
	import { popup } from '@skeletonlabs/skeleton';

	// {app?.Date.toDate().toLocaleDateString('en-us', {month:"short", day:"numeric", year:"numeric"})
	// While date of applications is within 7 days of current day
	// Mark it's position within a 7 item array as 1 if
	// Skip to application that has the next closest day
	export let apps;
	apps.sort((a, b) => b.Date.toDate() - a.Date.toDate())
	let activity = [0, 0, 0, 0, 0, 0, 0];
	let dates: Date[] = [];
	let day = 7;
	let appIndx = 0;
	let currDate = new Date();

	for (let j = 6; j >= 0; j--) {
		const d = new Date();
		d.setDate(currDate.getDate() - j);
		dates.push(d);
	}

	while (day > 0 && appIndx < apps.length) {
		let app = apps.at(appIndx);
		let appDate = app.Date.toDate();
		// If application date is outside of 7 day window, break
		if (Math.round((currDate.getTime() - appDate.getTime()) / (1000 * 3600 * 24)) > 7) {
			break;
		}

		let dayDiff = currDate.getDate() - 7 + day - appDate.getDate();
		// Check if apps are on the given day
		while (dayDiff == 0) {
			activity[day-1] += 1;
			appIndx++;
			if (appIndx >= apps.length) break;
			app = apps.at(appIndx);
			appDate = app.Date.toDate();
			dayDiff = dayDiff = currDate.getDate() - 7 + day - appDate.getDate();
		}

		// Move to next application
		day--;
	}
</script>

<div class="flex flex-col items-center justify-center">
	<!-- <h1>Activity</h1> -->
	<div class="flex flex-row">
		{#each activity as act, i}
			{#if act == 0}
				<div
					class="card p-4 variant-filled-secondary items-center justify-center"
					data-popup="noact-{i}"
				>
					<p class="flex items-center justify-center">
						{dates[i].toLocaleDateString('en-us', {
							weekday: 'long',
							month: 'short',
							day: 'numeric'
						})}
					</p>
					<p class="flex items-center justify-center">No apps sent</p>
					<div class="arrow variant-filled-secondary" />
				</div>
				<button
					class="h-4 w-4 variant-filled-secondary [&>*]:pointer-events-none rounded-lg m-1"
					use:popup={{ event: 'hover', target: 'noact-' + i, placement: 'top' }}
				></button>
			{:else}
				<div class="card p-4 variant-filled-secondary" data-popup="act-{i}">
					<p class="flex items-center justify-center">
						{dates[i].toLocaleDateString('en-us', {
							weekday: 'long',
							month: 'short',
							day: 'numeric'
						})}
					</p>
					<p class="flex items-center justify-center">{act} applications</p>
					<div class="arrow variant-filled-secondary" />
				</div>
				<button
					class="h-4 w-4 variant-filled-success [&>*]:pointer-events-none rounded-lg m-1"
					use:popup={{ event: 'hover', target: 'act-' + i, placement: 'top' }}
				></button>
			{/if}
		{/each}
	</div>
</div>
