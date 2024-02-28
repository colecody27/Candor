<script>
    import { dataHandlers } from "$lib/store/fireStore"
    import { authStore } from "$lib/store/authStore";
    import addIcon from '$lib/static/add.png'
    import removeIcon from '$lib/static/removeIcon.png'
    import { getModalStore, InputChip } from '@skeletonlabs/skeleton';
			
    const modalStore = getModalStore();
    export let company = ""
    export let role = ""
    export let status = true
    export let term = ""
    export let location = "Unknown"
    export let platform = ""
    export let topics = []
    export let interviews = [[]]
    export let docID = ""
    export let notes = ""

    // Watch for changes in selections
    $: if (platform) { dataHandlers.updatePlatform(docID, platform) }
    $: if (topics) { dataHandlers.updateTopics(docID, topics)}

    const handleNoteSubmission = async (e) => {
        if(e.key == 'Enter' || e.key == 13) {
            dataHandlers.updateNotes(docID, notes)
        }
    }
</script>

<div class = ''>
    <!-- Status -->
    <div class = 'justify-between flex '>
        <div>
            <h3 class = 'inline-block text-2xl' >Status: </h3>
            {#if status}
                <button class = 'variant-filled inline-block btn btn-sm' on:click = {() => {dataHandlers.updateStatus(docID, !status)}} >Submitted</button>
            {:else}
                <button class = 'variant-filled-error inline-block btn btn-sm'  on:click = {() => {dataHandlers.updateStatus(docID, !status)}}>Rejected</button>
            {/if}
        </div>
    <!-- Delete -->
    <div class = inline-block>
        <button class = 'inline-block btn-md btn variant-filled-error' on:click = {() => {dataHandlers.removeApp(docID)}} >Remove</button>
    </div>
    </div>

    <!-- Interviews  -->
    <div class = 'mt-4'>
        <h3 class = 'text-2xl'>Interviews:  
            <button on:click={ async () => {
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
                    if (r)
                        await dataHandlers.addInterview(docID, r)
                    })
                }}
                class =' btn-icon h-6  w-6 variant-filled-secondary'><img class = 'h-4 w-4 m-auto' src={addIcon} alt="">
            </button>
        </h3>
       
        <ul>
            {#each interviews as [key, value] }
                <li class = 'ml-4 mt-2'> 
                    <button class="btn-icon h-4  w-4 variant-filled-error" on:click = {() => {dataHandlers.removeInterview(docID, key)}}><img class = 'h-4 w-4 m-auto' src={removeIcon} alt=""></button>
                    <h2 class = 'inline-block'>{key}:</h2>
                    {#if value === "Rejected"}
                        <button class = 'variant-filled-error inline-block btn btn-sm' on:click = {() => {dataHandlers.updateInterview(docID, key, value)}}>{value}</button>    
                    {:else if value === "Pending"}
                        <button class = 'variant-filled-secondary inline-block btn btn-sm' on:click = {() => {dataHandlers.updateInterview(docID, key, value)}}>{value}</button>    
                    {:else}
                        <button class = 'variant-filled inline-block btn btn-sm' on:click = {() => {dataHandlers.updateInterview(docID, key, value)}}>{value}</button>
                    {/if}
                </li>
            {/each}
        </ul>
    </div>

    <!-- Online Assessment -->
    <div class = 'mt-4 flex flex-col'>
        <h3 class = 'text-2xl'>Online Assessment:</h3>
        <h2 class = 'ml-4 mt-2 inline-block'>Platform: </h2> 
        <select bind:value={platform} class="select max-w-max">
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
        
        <h2 class = 'ml-4 mt-2 inline-block'>Topics: </h2> 
        <InputChip class='min-w-80 max-w-max' bind:value={topics} name="chips" placeholder="Enter any topic related to the OA..." />

    </div>

    <!-- Notes-->
    <div class = 'mt-4'>
        <h3 class = 'text-2xl' >Notes </h3>
        <textarea class='textarea' rows=3 bind:value={notes} on:keydown={async (e) => {handleNoteSubmission(e)}}  />
    </div>
</div>
