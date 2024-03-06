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
                <button class = 'variant-filled inline-block btn btn-sm'> Submitted</button>
            {:else}
                <button class = 'variant-filled-error inline-block btn btn-sm'> Rejected</button>
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
                            <button class = 'variant-filled-error inline-block btn btn-sm'>{value}</button>    
                        {:else if value === "Pending"}
                            <button class = 'variant-filled-secondary inline-block btn btn-sm'>{value}</button>    
                        {:else}
                            <button class = 'variant-filled inline-block btn btn-sm'>{value}</button>
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
        <button class = 'variant-filled inline-block btn btn-sm'> {app.Platform}</button>
        
        <h2 class = 'ml-4 mt-2 inline-block'>Topics: </h2> 
        {#each app.Topics as topic} 
            <button class = 'variant-filled inline-block btn btn-sm'> {topic}</button>
        {/each}

    </div>

    <!-- Notes-->
    <div class = 'mt-4'>
        <h3 class = 'text-2xl' >Notes </h3>
        <p>{app.Notes}</p>
    </div>
</div>
