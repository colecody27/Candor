<script>
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    import Appdropdown from '../../../components/appdropdown.svelte';
    import Overviewstats from '../../../components/overviewstats.svelte';
    import { authStore } from '$lib/store/authStore';

    $: recentApps = $authStore.apps.slice(0, 10)

</script>

<!-- Overview Stats -->
<div class="mt-20">
    <Overviewstats/>
</div>


<!-- Recent Applications -->
<div class = 'w-3/4 m-auto mt-20'>
    <h1 class = 'text-3xl mb-5'>Recent Applications</h1>
    <Accordion>
        {#each recentApps as app}
            <AccordionItem>
                <svelte:fragment slot="lead"><h3 class = 'text-lg'>{app?.Role}, {app?.Company}</h3></svelte:fragment>
                <svelte:fragment slot="summary">
                    <p class = 'text-right'>{app?.Date.toDate().toLocaleDateString('en-us', {month:"short", day:"numeric", year:"numeric"})}</p>
                </svelte:fragment>
                <svelte:fragment slot="content">
                    <div class="card p-4">
                        <Appdropdown app={app}/>
                    </div>
                </svelte:fragment>
            </AccordionItem>
        {/each}
</Accordion>
</div>

