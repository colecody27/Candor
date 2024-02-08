<script>
    import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
    import Appdropdown from '../../../components/appdropdown.svelte';
    import Overviewstats from '../../../components/overviewstats.svelte';
</script>

<!-- Overview Stats -->
<Overviewstats/>

<!-- Recent Applications -->
<div class = 'w-3/4 m-auto'>
    <h1 class = 'text-3xl mb-5'>Recent Applications</h1>
    <Accordion>
        <div class = 'bg-error-600 rounded-b-xl'>
            <AccordionItem >
                <svelte:fragment slot="lead"><h3 class = 'text-lg'>Software Engineer, AWS</h3></svelte:fragment>
                <svelte:fragment slot="summary">
                    <p class = 'text-right'>Jan 3, 2024</p>
                </svelte:fragment>
                <svelte:fragment slot="content">
                    <div class="card p-4">
                        <Appdropdown/>
                    </div>
            </svelte:fragment>
            </AccordionItem>
        </div>
        
        <AccordionItem>
            <svelte:fragment slot="lead"><h3 class = 'text-lg'>Software Engineer, Netflix</h3></svelte:fragment>
            <svelte:fragment slot="summary">
                <p class = 'text-right'>Feb 3, 2024</p>
            </svelte:fragment>
            <svelte:fragment slot="content">(content)</svelte:fragment>
        </AccordionItem>
        <!-- ... -->
    </Accordion>
</div>

