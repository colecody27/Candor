<script lang='ts'>
    import { FileDropzone, Avatar, getModalStore } from '@skeletonlabs/skeleton';
    import { authStore } from '$lib/store/authStore';
    import { dataHandlers } from '$lib/store/fireStore';
	import Activity from '../../../components/activity.svelte';
    import uploadIcon from '$lib/static/upload.png'
    import trashIcon from '$lib/static/trash.png'
    import removeIcon from'$lib/static/removeIcon.png'
    import paper from '$lib/static/paper.png'
    import xIcon from '$lib/static/xIcon.png'

    const modalStore = getModalStore();

    $: name = $authStore?.user?.displayName
    $: univ = $authStore?.university

    let image: FileList 

    function onChangeHandler(e: Event): void {
	    console.log('file data:', e);
    }
</script>

<div class='grid grid-cols-3 gap-2'>
    <!-- Avatar -->
    <div class='card p-4 w-60 flex flex-col size-fit shadow-xl m-5'>
        <div class="flex flex-col items-center justify-center">
            <div class='relative'>
                <Avatar 
                    initials={name.split(" ")[0].charAt(0) + name.split(" ")[1].charAt(0)}
                    border="border-4 border-surface-300-600-token hover:!border-primary-500"
                    cursor="cursor-pointer">	
                </Avatar>
                <button class='absolute top-0 right-0'>
                    <img class = 'h-4 w-4' src={trashIcon} alt="">
                </button>
            </div>
            
            <p>{name}</p>
            <p>{$authStore.apps.length} applications</p>
        </div>
        <div class='mt-2 mb-2'>
            <Activity apps={$authStore.apps}/>
        </div>
        <FileDropzone padding='p2' name="files" message='' bind:files={image} on:change={onChangeHandler}>
            <!-- <svelte:fragment slot="lead"><img class = 'h-4 w-4 m-auto' src={uploadIcon} alt=""></svelte:fragment> -->
            <svelte:fragment slot="message">
                <div class='flex flex-row justify-between'>
                    <img class = 'h-4 w-4 m-auto' src={uploadIcon} alt="">
                    <p class='ml-2'>Upload new icon</p>
                </div>
            </svelte:fragment>
        </FileDropzone>
    </div>

    <!-- Edit Profile -->
    <div class='card p-4 flex col-span-2 max-w-3xl shadow-xl m-5 grid'>
        <!-- Header -->
        <header class="card-header border-b-2 border-gray-500"><h2 class=h3 >Edit Profile</h2></header>
        <!-- Form -->
        <div>
            <!-- User details-->
            <div class='grid grid-cols-2 mt-5 '>
                <div class='grid mr-5'>
                    <h4 class=h4>Name</h4>
                    <input class="input max-w-sm" title="Name" type="text" placeholder={name} />
                </div>
                <div class='grid'>
                    <h4 class=h4>University</h4>
                    <input class="input max-w-sm" title="University" type="text" placeholder={univ} />
                </div>
            </div>
           
            <!-- Resumes -->
            <h2 class='h4 mt-5'>Resumes</h2>
            <input class="input" type="file" />

            <dl class="list-dl mt-5">
                <div>
                    <!-- <span class="badge bg-primary-500">💀</span> -->
                    <img class='h-4 w-4' src={paper} alt="">
                    <span class="flex-auto">
                        <dt>Resume 1</dt>
                        <dd>24 applications</dd>
                    </span>
                    <button class="btn-icon h-5  w-5 variant-filled-error" on:click = {() => {dataHandlers.removeResume(app.Id, key)}}><img class = 'h-4 w-4 m-auto' src={xIcon} alt=""></button>
                </div>
                <div>
                    <!-- <span class="badge bg-primary-500">💀</span> -->
                    <img class='h-4 w-4' src={paper} alt="">
                    <span class="flex-auto">
                        <dt>Resume 2</dt>
                        <dd>53 applications</dd>
                    </span>
                    <button class="btn-icon h-5  w-5 variant-filled-error" on:click = {() => {dataHandlers.removeResume(app.Id, key)}}><img class = 'h-4 w-4 m-auto' src={xIcon} alt=""></button>
                </div>
            </dl>
        </div>
        <div class='flex justify-center justify-between'>
            <!-- Update Profile -->
            <button class="btn btn-md variant-filled-success m-auto mt-5" on:click = {() => {dataHandlers.updateDetails(app.Id, key)}}>Update Profile</button>
            <!-- Delete Profile -->
            <button on:click={ async () => {
                // MODAL
                new Promise((resolve) => {
                    const modal = {
                        type: 'confirm',
                        // Data
                        title: 'Please Confirm',
                        body: 'All applications and user data will be deleted. Are you sure you wish to proceed?',
                        // Returns the updated response value
                        response: (r) => resolve(r)  
                    };
                    modalStore.trigger(modal);
                }).then(async (r) => {
                    if (r)
                        await dataHandlers.deleteAccount()})
                }}
            class ='btn-md btn variant-filled-error flex m-auto '>Delete Account</button>
        </div>
    </div>
</div>

