<script>
    import { Accordion, AccordionItem, TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
    import Appdropdown from '../../../components/appdropdown.svelte';
    import Addapp from '../../../components/addapp.svelte'
    import {dataHandlers} from '../../../store/fireStore'

    let tabSet = 0
    let term = "Spring 2024"
</script>

<!-- Recommended Roles -->
<div class = 'w-3/4 m-auto mt-20'>
    <h1 class = 'text-3xl mb-5'>Recommended Roles </h1>
    <Accordion>
        <div class = 'rounded-b-xl'>
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

<div class = 'w-3/4 m-auto mt-20'>
    <!-- <Addapp/> -->
    <!-- Applications -->
    <div class = ' m-auto mt-20'>
        <h1 class = 'text-3xl mb-5'>Applications</h1>
        <TabGroup>
            <Tab bind:group={tabSet} name="tab1" value={0}>
                <svelte:fragment slot="lead">Fall 2023</svelte:fragment>
                <span>2 Apps</span>
            </Tab>
            <Tab bind:group={tabSet} name="tab2" value={1}>
                <svelte:fragment slot="lead">Spring 2024</svelte:fragment>
                <span>2 Apps</span></Tab>
            <Tab bind:group={tabSet} name="tab3" value={2}>
                <svelte:fragment slot="lead">Spring 2023</svelte:fragment>
                <span>30 Apps</span></Tab>
            <!-- Tab Panels --->
            <svelte:fragment slot="panel">
                {#if tabSet === 0}
                <Addapp term = {"Spring 2024"}/>
                <Accordion>
                    <div class = 'rounded-b-xl'>
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
                    <button on:click = {dataHandlers.getApps} class = ' flex m-auto btn-md btn variant-filled-error' >Remove Period</button>
                </Accordion>
                
                {:else if tabSet === 1}
                    (tab panel 2 contents)
                {:else if tabSet === 2}
                    (tab panel 3 contents)
                {/if}
            </svelte:fragment>
        </TabGroup>
    </div>
    
</div>