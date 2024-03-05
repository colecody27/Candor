<script>
	import { dataHandlers } from "$lib/store/fireStore";
    import {authStore} from '$lib/store/authStore'
    import { Avatar, TabGroup, Tab, Accordion, AccordionItem} from "@skeletonlabs/skeleton";
	import Appdropdown from "../../../components/appdropdown.svelte";
	import { onMount } from "svelte";

    // export let data 
    // console.log(data)

    console.log($authStore?.friend)
</script>


<!-- <div>
    Avatar
    <div class='card p-4 w-60 shadow-xl'>
        <div class="flex flex-col items-center justify-center">
            <Avatar 
                initials={$friendStore.user.name.split(" ")[0].charAt(0) + $friendStore.user.name.split(" ")[1].charAt(0)}
                border="border-4 border-surface-300-600-token hover:!border-primary-500"
                cursor="cursor-pointer">	
            </Avatar>
            <p>{$friendStore.user.name}</p>
            <p>{$friendStore.user.email}</p>
        </div>
    </div>

    Graph
    <div>
        <h1>Graph goes here</h1>
    </div>
</div>

Applications
<div class = 'w-3/4 m-auto mt-20'>
    <div class = ' m-auto mt-20'>
        <h1 class = 'text-3xl mb-5'>Applications</h1>
        <TabGroup>
            TABS
            {#each $friendStore.terms as term}
                <Tab bind:group={tabSet} name="tab1" value={term}>
                    <svelte:fragment slot="lead">
                        {term}
                    </svelte:fragment>
                    <span>{$friendStore.apps.filter((app) => app.Term === term).length} apps</span>
                </Tab>
            {/each}

            TAB CONTENTS
            <svelte:fragment slot="panel">
                    <Accordion>
                        {#each $friendStore.apps as app}
                            {#if app?.Term === tabSet}
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
                            {/if}
                        {/each}
                </Accordion>
            </svelte:fragment>
        </TabGroup>
    </div>
</div> -->

