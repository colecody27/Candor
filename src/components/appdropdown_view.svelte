<script>
    import { dataHandlers } from "$lib/store/fireStore"
    import { authStore } from "$lib/store/authStore";
    import { getModalStore, InputChip } from '@skeletonlabs/skeleton';
			
    const modalStore = getModalStore();
    export let app = {}

</script>

<div class = ''>
    <!-- Status -->
    <div class = 'justify-between flex '>
        <div>
            <h3 class = 'inline-block text-2xl' >Status: </h3>
            {#if app.Status}
                <span class='badge variant-filled inline-block '>Submitted</span>
            {:else}
                <span class='badge variant-filled-error inline-block '>Rejected</span>
            {/if}
        </div>
    </div>

    <!-- Interviews  -->
    <div class = 'mt-4'>
        <h3 class = 'text-2xl'>Interviews: </h3>
        <ul>
            {#if Object.keys(app.Interviews).length >= 1}
                {#each Object.entries(app.Interviews) as [key, value] }
                    <li class = 'ml-4 mt-2'> 
                        <h2 class = 'inline-block'>{key}:</h2>
                        {#if value === "Rejected"}
                            <span class='badge variant-filled-error inline-block '>{value}</span>
                        {:else if value === "Pending"}
                            <span class='badge variant-filled-secondary inline-block '>{value}</span>       
                        {:else}
                            <span class='badge variant-filled inline-block '>{value}</span>
                        {/if}
                    </li>
                {/each}
            {/if}
        </ul>
    </div>

    <!-- Online Assessment -->
    <div class = 'mt-4 flex flex-col'>
        <h3 class = 'text-2xl'>Online Assessment:</h3>
        <h2 class = 'ml-4 mt-2 inline-block'>Platform: </h2> 
        <span class='badge variant-filled inline-block w-fit'>{app.Platform}</span>
        
        <h2 class = 'ml-4 mt-2 inline-block'>Topics: </h2> 
        <div class='flex flex-row'>
        {#each app.Topics as topic} 
            <span class='badge variant-filled inline-block w-fit mr-1'>{topic}</span>
        {/each}
        </div>

    </div>

    <!-- Notes-->
    <div class = 'mt-4'>
        <h3 class = 'text-2xl' >Notes </h3>
        <p>{app.Notes}</p>
    </div>
</div>
