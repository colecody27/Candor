<script lang="ts">
	import '../app.postcss';
	import {onMount} from 'svelte'
	import {onAuthStateChanged } from "firebase/auth";
	import auth from '$lib/firebase/firebase.client'
	import User from '../routes/+page.svelte'



	
 
</script>


<slot/>