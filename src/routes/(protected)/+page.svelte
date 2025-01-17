<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import Nav from '$components/Nav.svelte';

	let { data }: { data: PageServerData } = $props();
</script>

<Nav />

<div class="layout">
	<div>
		<h1>Current user</h1>

		<p><b>Username:</b> {data.user.username}</p>
		<p><b>Email:</b> {data.user.data.email}</p>
		<p><b>Name:</b> {data.user.data.name}</p>
		{#if data.user.data.location}
			<p><b>Location:</b> {data.user.data.location}</p>
		{/if}
	</div>

	<div>
		<h2>Prefered genres</h2>

		<ul>
			{#each data.user.genres as genre}
				<li>
					{genre}
				</li>
			{/each}
		</ul>
	</div>
</div>

<form method="post" use:enhance>
	<button class="signout-btn">Sign out</button>
</form>

<style>
	.signout-btn {
		background-color: #f44336;
		color: white;
		padding: 10px 20px;
		border: none;
		cursor: pointer;
	}

	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1rem;
	}
</style>
