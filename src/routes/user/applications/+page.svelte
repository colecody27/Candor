<script>
    import { Accordion, AccordionItem, TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
    import Appdropdown from '../../../components/appdropdown.svelte';
    import Addapp from '../../../components/addapp.svelte'
    import {dataHandlers} from '../../../lib/store/fireStore'
    import { authStore } from '../../../lib/store/authStore';
	import { onMount } from 'svelte';
    import addIcon from '$lib/static/add.png'
    import { getModalStore } from '@skeletonlabs/skeleton';
			
    const modalStore = getModalStore();
    let tabSet = $authStore?.terms[0]
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
    <!-- Applications -->
    <div class = ' m-auto mt-20'>
        <h1 class = 'text-3xl mb-5'>Applications</h1>
        
        {#if $authStore.currentUser}
        <TabGroup>
            <!-- TABS -->
            {#each $authStore.terms as term}
                <Tab bind:group={tabSet} name="tab1" value={term}>
                    <svelte:fragment slot="lead">{term}</svelte:fragment>
                    <span>{$authStore.apps.filter((t) => t.Term === term).length} apps</span>
                </Tab>
            {/each}

            <!-- Add term tab -->
            <Tab bind:group={tabSet} name="addtab" value={"Add term"}>
                <svelte:fragment slot="lead">
                    <button on:click = { async () => {
                        // MODAL
                        new Promise((resolve) => {
                            const modal = {
                                type: 'prompt',
                                // Data
                                title: 'Enter Term Name',
                                body: 'Provide a name for the term in the field below.',
                                // Populates the input value and attributes
                                value: 'Ex: Spring 2024',
                                valueAttr: { type: 'text', minlength: 4, maxlength: 20, required: true },
                                // Returns the updated response value
                                response: (r) => resolve(r)  
                            };
                            modalStore.trigger(modal);
                        }).then(async (r) => {
                            if (r)
                                await dataHandlers.addTerm(r)
                        })
                    }} 
                    class='btn-icon h-8  w-8 variant-filled-secondary'>
                    <img class = 'h-6 w-6 m-auto' src={addIcon} alt="">
                    </button>
                </svelte:fragment>
            </Tab>

            <!-- TAB CONTENTS -->
            <svelte:fragment slot="panel">
                {#if $authStore.terms.length == 1}
                    <h3 class = 'text-2xl m-auto text-center' >Add a new term to get started</h3>
                {:else}
                    <Addapp term = {tabSet}/>
                    <Accordion>
                        {#each $authStore.apps as app}
                            {#if app?.Term === tabSet}
                                <AccordionItem>
                                    <svelte:fragment slot="lead"><h3 class = 'text-lg'>{app?.Role}, {app?.Company}</h3></svelte:fragment>
                                    <svelte:fragment slot="summary">
                                        <p class = 'text-right'>Jan 3, 2024</p>
                                    </svelte:fragment>
                                    <svelte:fragment slot="content">
                                        <div class="card p-4">
                                            <Appdropdown company={app?.Company} role={app?.Role} status={app?.Status} term={app?.Status} location={app?.Location} platform={app?.Platform} topics={app?.Topics} docID={app?.Id} interviews={app?.Interviews} notes={app?.Notes}/>
                                        </div>
                                    </svelte:fragment>
                                </AccordionItem>
                            {/if}
                        {/each}
                </Accordion>
                {/if}
            </svelte:fragment>
        </TabGroup>
        {/if}
    </div>
    
</div>