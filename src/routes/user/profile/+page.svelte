<script>
    import { FileDropzone, Avatar } from '@skeletonlabs/skeleton';
    import { authStore } from '$lib/store/authStore';
	import Activity from '../../../components/activity.svelte';

    $: name = $authStore?.user?.displayName
    $: univ = $authStore?.university
</script>

<!-- Profile -->
<div>
    <div class='card p-4 w-60 flex flex-col size-fit shadow-xl'>
        <div class="flex flex-col items-center justify-center">
            <Avatar 
                initials={name.split(" ")[0].charAt(0) + name.split(" ")[1].charAt(0)}
                border="border-4 border-surface-300-600-token hover:!border-primary-500"
                cursor="cursor-pointer">	
            </Avatar>
            <p>{name}</p>
            <p>{$authStore.apps.length} applications</p>
        </div>
        <div class='mt-2'>
            <Activity apps={$authStore.apps}/>
        </div>
    </div>
</div>