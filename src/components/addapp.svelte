<script>

    import addIcon from '$lib/static/add.png'
    import Appdropdown from '../components/appdropdown.svelte';
    import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";     import auth, { db } from '$lib/firebase/firebase.client'
    import { authStore } from '../lib/store/authStore';
    import {dataHandlers} from '../lib/store/fireStore'
	import { AppShell } from '@skeletonlabs/skeleton';

    let role = ""
    let company = ""
    let location = ""
    export let term = ""

</script>

<div class="card p-4 w-3/4 mb-5 mt-10 m-auto max-w-4xl justify-between flex">
    <!-- Role -->
    <div class= "inline-block">
        <h3 class = 'text-l text-center'>Role</h3>
        <input class = 'input' bind:value={role} type="text">
    </div>
    <!-- Company  -->
    <div class= "inline-block">
        <h3 class = 'text-l text-center'>Company</h3>
        <input class = 'input'  bind:value={company} type="text">
    </div>
    <!-- Location -->
    <div class= "inline-block">
        <h3 class = 'text-l text-center'>Location</h3>
        <input class = 'input'  bind:value={location} type="text">
    </div>
    <button on:click={()=> {
        // ADD APP
        dataHandlers.addApp(role, company, term)

        // RESET VALUES
        company = "" 
        location = ""
        }}
        class =' btn-icon h-8  w-8 variant-filled-secondary'><img class = 'h-6 w-6 m-auto' src={addIcon} alt=""></button>
</div>


