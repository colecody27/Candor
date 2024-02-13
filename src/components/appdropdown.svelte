<script>
    let submission = true
</script>

<div class = ''>
    <!-- Status -->
    <div class = 'justify-between flex'>
        <div>
            <h3 class = 'inline-block text-2xl' >Status: </h3>
            {#if submission}
                <button class = 'variant-filled inline-block btn btn-sm'>Submitted</button>
            {:else}
                <button class = 'variant-filled-error inline-block btn btn-sm '>Submitted</button>
            {/if}
        </div>
    <!-- Delete -->
    <div class = inline-block>
        <button class = 'inline-block btn-md btn variant-filled-error' >Remove</button>
    </div>
    </div>

    <!-- Interviews  -->
    <div class = 'mt-4'>
        <h3 class = 'text-2xl'>Interviews: </h3>
        <ul>
            <li class = 'ml-4 mt-2'> <h2 class = 'inline-block'>Phone Screen: </h2> <button class = 'variant-filled inline-block btn btn-sm' >Advanced</button></li>
            <li class = 'ml-4 mt-2 '><h2 class = 'inline-block'>Whiteboard: </h2> <button class = 'variant-filled-secondary inline-block btn btn-sm'>Pending</button></li>
        </ul>
    </div>

    <!-- Online Assessment -->
    <div class = 'mt-4'>
        <h3 class = 'text-2xl'>Online Assessment:</h3>
        <h2 class = 'ml-4 mt-2 inline-block'>Platform: </h2> <button class = 'variant-filled inline-block btn btn-sm'>CodeSignal</button>
        <h2 class = 'ml-4 mt-2 inline-block'>Topics: </h2> 
        <button class = 'variant-filled inline-block btn btn-sm'>BST</button>
        <button class = 'variant-filled inline-block btn btn-sm'>Array</button> 
        <button class = 'variant-filled inline-block btn btn-sm'>DP</button>
    </div>

    <!-- Notes-->
    <div class = 'mt-4'>
        <h3 class = 'text-2xl' >Notes: </h3>
        <input class = 'input' type="text">
    </div>
</div>
