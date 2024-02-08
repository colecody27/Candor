<script>
    let stats = [["Total Applications", "3"], ["Total Advancements", "2"], ["Day Streak", "2"], ["Connections", "8"], ["Some value", "29"]]
</script>

<div class=" m-auto snap-x scroll-px-4 snap-mandatory scroll-smooth flex gap-4 overflow-x-auto px-4 py-10 w-1/2 ">
	{#each stats as stat}
		<div class="snap-center shrink-0 card py-10 w-30 md:w-80 text-center">
            <h3 class = 'text-l'>{stat[0]}</h3>    
            <span class="badge variant-filled">{stat[1]}</span>
        </div>
	{/each}
</div>