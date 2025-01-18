<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageServerData } from './$types';
	import BookThumbnail from '$components/BookThumbnail.svelte';
	import ShowThumbnail from '$components/ShowThumbnail.svelte';

	let { data }: { data: PageServerData } = $props();
</script>

<div class="layout">
	<div>
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

		<div>
			<h2>Prefered genres</h2>

			<ul>
				{#each data.user.genres as genre}
					<li>
						{genre}
					</li>
				{/each}
			</ul>

			<a href="/preferences">Edit preferences</a>
		</div>
	</div>

	<div>
		<h2>Favourite books</h2>

		<div class="favourites">
			{#each data.favouriteBooks as book}
				<BookThumbnail {book} />
			{/each}
		</div>
	</div>
	<div>
		<h2>Favourite shows</h2>

		<div class="favourites">
			{#each data.favouriteShows as show}
				<ShowThumbnail {show} />
			{/each}
		</div>
	</div>

	{#await data.recomendedBooks then books}
		<div>
			<h2>Recomended books</h2>

			<div class="favourites">
				{#each books as book}
					<BookThumbnail {book} />
				{/each}
			</div>
		</div>
	{/await}

	{#await data.recomendedShows then shows}
		<div>
			<h2>Recomended shows</h2>

			<div class="favourites">
				{#each shows as show}
					<ShowThumbnail {show} />
				{/each}
			</div>
		</div>
	{/await}
</div>

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

	.favourites {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
	}
</style>
