<script>
	import { AppShell, AppBar, Avatar } from '@skeletonlabs/skeleton';
	import { authHandlers, provider } from '../lib/store/authStore';
	import auth from '$lib/firebase/firebase.client';
	import img3 from '$lib/static/img3.png'

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
	<div class='flex flex-wrap justify-center my-32 space-x-10 space-y-10'>
		<!-- Paragraph container-->
		<div class='max-w-80 mt-10'>
			<h2 class='h2 '>Collaboration <br>Through <br>Transparency</h2>
			<p class='mt-5 text-lg'>Candor will help keep track of applications and their status, provide personalized statistics,
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
		
		
		<!-- Image -->
		<div class='h-1/2 w-1/2 m-auto min-w-80 min-h-80'>
			<img class='rounded-lg'  src={img3} alt="">
		</div>
	</div>
	<!-- Footer -->
	<svelte:fragment slot="footer">
		<h1 class="text-center">© 2024 Candor</h1>
	</svelte:fragment>
</AppShell>