<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
</script>

<h1>Current user</h1>

<p><b>Username:</b> {data.user.username}</p>
<p><b>Email:</b> {data.user.data.email}</p>
<p><b>Name:</b> {data.user.data.name}</p>
{#if data.user.data.location}
	<p><b>Location:</b> {data.user.data.location}</p>
{/if}

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
</style>
