<script lang=ts>
	import { AppShell, AppBar, Avatar } from '@skeletonlabs/skeleton';
	import { authHandlers, provider } from '../lib/store/authStore';
	import auth from '$lib/firebase/firebase.client';
	import img3 from '$lib/static/img3.png'
	import img4 from '$lib/static/img4.png'
	import img5 from '$lib/static/img5.png'
	import img6 from '$lib/static/img6.png'
	import arrowLeft from '$lib/static/arrowLeft.png'
	import arrowRight from '$lib/static/arrowRight.png'
	import { arrow } from '@floating-ui/dom';


	// Carousel 
	let images = [img6, img4, img3, img5 ]
	let elemCarousel: HTMLDivElement;
	let innerWidth = 0

	function carouselLeft(): void {
		const x =
			elemCarousel.scrollLeft === 0
				? elemCarousel.clientWidth * elemCarousel.childElementCount // loop
				: elemCarousel.scrollLeft - elemCarousel.clientWidth; // step left
		elemCarousel.scroll(x, 0);
	}
	function carouselRight(): void {
		const x =
			elemCarousel.scrollLeft === elemCarousel.scrollWidth - elemCarousel.clientWidth
				? 0 // loop
				: elemCarousel.scrollLeft + elemCarousel.clientWidth; // step right
		elemCarousel.scroll(x, 0);
	}
	function carouselThumbnail(index: number) {
		elemCarousel.scroll(elemCarousel.clientWidth * index, 0);
	}

	async function handleLogin() {
		/** @type {import("@firebase/auth").User} */
		const User = await authHandlers.login(auth, provider);
		if (User) {
			window.location.href = '/user/overview';
			return User;
		} else console.log('User not logged in');
	}
</script>

<!-- App Shell -->
<svelte:window bind:innerWidth />
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-4xl">Candor</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<!--LOGIN-->
				<button class="btn btn variant-ghost-surface" on:click={() => handleLogin()}>
					Login | Sign Up
				</button>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<div class='flex flex-wrap justify-center my-32 md:space-x-10 space-y-10'>
		<!-- Paragraph container-->
		<div class='max-w-80 mt-10'>
			<h2 class='h2 text-center'>Collaboration <br>Through <br>Transparency</h2>
			<p class='mt-5 text-center text-lg'>Candor will help keep track of applications and their status, provide personalized statistics,
				and recommend opportunities that haven’t yet been applied for!</p>

			<!--LOGIN-->
			<div class="flex justify-center space-x-2 mt-5">
				<button
					class="btn btn-lg variant-filled-secondary"
					on:click={() => {
						handleLogin();
					}}
					>Login
				</button>
			</div>
		</div>	
		<div>	
	</div>
		<div class="card md:h-1/2 md:w-1/2 p-4 m-auto grid md:grid-cols-[auto_1fr_auto] gap-4 items-center">
			<!-- Button: Left -->
			{#if innerWidth > 900}
			<button type="button" class="btn btn-sm variant-filled" on:click={carouselLeft}>
				<img src={arrowLeft} class='h-3 w-3 '/>
			</button>
			{/if}
			<!-- Full Images -->
			<div bind:this={elemCarousel} class="snap-x snap-mandatory scroll-smooth flex overflow-x-auto">
				{#each images as image}
					<img
						class="snap-center rounded-container-token"
						src={image}
						alt={image}
						loading="lazy"
					/>
				{/each}
			</div>
			<!-- Button: Right -->
			{#if innerWidth > 900}
			<button type="button" class="btn btn-sm md:btn-xs variant-filled" on:click={carouselRight}>
				<img src={arrowRight} class='h-3 w-3'/>
			</button>
			{/if}

			<!-- Phone screen -->
			{#if innerWidth < 900}
			<div class='justify-center flex '>
				<button type="button" class="btn mr-5 btn-sm variant-filled" on:click={carouselLeft}>
					<img src={arrowLeft} class='h-3 w-3'/>
				</button>
				<button type="button" class="btn btn-sm md:btn-xs variant-filled" on:click={carouselRight}>
					<img src={arrowRight} class='h-3 w-3'/>
				</button>
			</div>
			{/if}
		</div>
		
		<!-- Thumbnails -->
		<!-- <div class="card p-4 grid grid-cols-6 gap-4">
			{#each images as image, i}
				<button type="button" on:click={() => carouselThumbnail(i)}>
					<img
						class="rounded-container-token"
						src={image}
						alt={image}
						loading="lazy"
					/>
				</button>
			{/each}
		</div> -->
		
	</div>
	<!-- Footer -->
	<svelte:fragment slot="footer">
		<h1 class="text-center">© 2024 Candor</h1>
	</svelte:fragment>
</AppShell>