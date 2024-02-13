<script>
    import addIcon from '$lib/static/add.png'
    import Appdropdown from '../components/appdropdown.svelte';
    import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore"; 
    import { db } from '$lib/firebase/firebase.client'
    import { authStore } from '../store/authStore';
    import {dataHandlers} from '../store/fireStore'

    let role = ""
    let company = ""
    export let term = ""

</script>

<div class="card p-4 w-1/2 mb-5 mt-10 m-auto max-w-lg justify-between flex">
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
    <!-- Period -->
    <div class= "inline-block">
        <!-- <h3 class = 'text-l text-center'>Period</h3>
        <input class = 'input'  bind:value={period} type="text"> -->
    </div>
    <button on:click={()=> dataHandlers.addApp(role, company, term)} class =' btn-icon h-8  w-8 variant-filled-secondary'><img class = 'h-6 w-6 m-auto' src={addIcon} alt=""></button>
</div>


