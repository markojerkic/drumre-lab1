<script lang="ts">
	import { enhance } from "$app/forms";
	import type { PageServerData } from "./$types";
	import BookThumbnail from "$components/BookThumbnail.svelte";
	import ShowThumbnail from "$components/ShowThumbnail.svelte";

	let { data }: { data: PageServerData } = $props();
</script>

<div class="layout">
	<div class="user-data">
		<div class="user-info">
			<h2>Current user</h2>
			<p><b>Username:</b> {data.user.username}</p>
			<p><b>Email:</b> {data.user.data.email}</p>
			<p><b>Name:</b> {data.user.data.name}</p>
			{#if data.user.data.location}
				<p><b>Location:</b> {data.user.data.location}</p>
			{/if}
			<form method="post" use:enhance>
				<button class="signout-btn">Sign out</button>
			</form>
		</div>
		<div class="user-genres">
			<h2>Preferred genres</h2>
			<div class="genre-grid">
				{#each data.user.genres as genre}
					<span>
						{genre}
					</span>
				{/each}
			</div>
			<form method="GET" action="/preferences" use:enhance>
				<button class="edit-preferences-btn">Edit preferences</button>
			</form>
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
			<h2>Recommended books</h2>

			<div class="favourites">
				{#each books as book}
					<BookThumbnail {book} />
				{/each}
			</div>
		</div>
	{/await}

	{#await data.recomendedShows then shows}
		<div>
			<h2>Recommended shows</h2>

			<div class="favourites">
				{#each shows as show}
					<ShowThumbnail {show} />
				{/each}
			</div>
		</div>
	{/await}
</div>

<style>
	h1,
	h2,
	p {
		color: var(--text-color);
	}

	.genre-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		gap: 10px;
		margin-bottom: 20px;
	}

	.genre-grid span {
		background-color: var(--background-color);
		color: var(--text-color);
		padding: 10px;
		border-radius: 5px;
		text-align: center;
		word-break: break-word;
		overflow-wrap: break-word;
		filter: brightness(0.9);
	}

	.edit-preferences-btn {
		background-color: var(--primary-color);
		color: var(--text-button-color);
		padding: 10px 20px;
		border: none;
		cursor: pointer;
		border-radius: 5px;
	}

	.edit-preferences-btn:hover {
		filter: brightness(0.9);
	}

	.user-data {
		display: flex;
		justify-content: space-between;
		background-color: var(--background-color);
		padding: 1rem;
		border-radius: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		margin-bottom: 20px;
		grid-column: 1 / -1;
		margin-top: 1rem;
	}

	.user-info {
		flex: 1;
		margin-right: 1rem;
	}

	.user-genres {
		flex: 1;
	}

	.signout-btn {
		/* Maybe set button color to red */
		background-color: var(--danger-color);
		color: var(--text-button-color);
		padding: 10px 20px;
		border: none;
		cursor: pointer;
		border-radius: 10px;
	}

	.signout-btn:hover {
		filter: brightness(0.9);
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
