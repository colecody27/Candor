<script>
	export let apps;

	const getAdvancements = () => {
		let count = 0;
		for (var i = 0; i < apps.length; i++) {
			const app = apps.at(i);
			for (var j = 0; j < app.Interviews.length; j++) {
				if (app.Interviews.at(j)[1] === 'Advanced') count++;
			}
		}
		return count;
	};
	const getDayStreak = () => {
		let streak = 0;
		const today = new Date();

		for (var i = 0; i < apps.length - 1; i++) {
			if (i == 0 && today.getDay() - apps.at(0).Date.toDate().getDay() < 1) streak++;
			const app1 = apps.at(i);
			const app2 = apps.at(i + 1);
			if (
				app1.Date.toDate().getYear() === app2.Date.toDate().getYear() &&
				app1.Date.toDate().getMonth() === app2.Date.toDate().getMonth()
			) {
				const dateDiff = app2.Date.toDate().getDay() - app1.Date.toDate().getDay();
				if (dateDiff < 1) continue;
				else if (app2.Date.toDate().getDay() - app1.Date.toDate().getDay() < 2) streak++;
				else return streak;
			}
		}
		return streak;
	};

	$: stats = [
		['Total Applications', apps.length],
		['Total Advancements', getAdvancements()],
		['Day Streak', getDayStreak()],
		['Connections', '8']
	];
</script>

<div
	class=" m-auto snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-10 w-1/4"
>
	{#each stats as stat}
		<div class="snap-center shrink-0 card py-10 w-30 md:w-80 text-center">
			<h3 class="text-l">{stat[0]}</h3>
			<span class="badge variant-filled">{stat[1]}</span>
		</div>
	{/each}
</div>
