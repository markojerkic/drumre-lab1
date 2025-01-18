<script lang="ts">
	import { enhance } from '$app/forms';
	import ShowThumbnail from '$components/ShowThumbnail.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let show = data.show!;
</script>

<svelte:head>
	<title>{show.title}</title>
</svelte:head>

<h1>{show.title}</h1>

<form method="POST" action="/shows?/removeFavourite" use:enhance id="remove-favourite"></form>
<form method="POST" action="/shows?/addFavourite" use:enhance id="add-favourite"></form>

<article>
	<p>{show.overview}</p>
</article>

<div class="data-grid">
	<span class="label">Release year:</span>
	<span>{show.year}</span>
	<span class="label">Genres:</span>
	<span>{show.genres}</span>
	<span class="label">Rating:</span>
	<span>{show.rating}</span>
	<span class="label">Country:</span>
	<span>{show.country}</span>
	<span class="label">Language:</span>
	<span>{show.language}</span>
	<span class="label">Network:</span>
	<span>{show.network}</span>
</div>

{#if show.trailerLink}
	<iframe
		width="560"
		height="315"
		src={show.trailerLink}
		title="YouTube video player"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
		allowfullscreen
	></iframe>
{/if}

{#if data.isUsersFavourite}
	<button class="remove-favourite" name="id" value={show._id} form="remove-favourite"
		>Remove from favorites</button
	>
{:else}
	<button class="add-favourite" name="id" value={show._id} form="add-favourite"
		>Add to favorites</button
	>
{/if}

{#await data.similarShows then smilarShows}
	{#if smilarShows}
		<h2>Similar shows</h2>
		<div class="similar-shows">
			{#each smilarShows as show}
				<ShowThumbnail {show} />
			{/each}
		</div>
	{/if}
{/await}

<style>
	.data-grid {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 1rem;
	}
	.data-grid .label {
		font-weight: bold;
	}
	.thumbnail {
		max-width: 200px;
	}
	button.add-favourite {
		background-color: #007bff;
		color: white;
		padding: 10px;
		margin-top: 10px;
		cursor: pointer;
	}
	button.remove-favourite {
		background-color: #dc3545;
		color: white;
		padding: 10px;
		margin-top: 10px;
		cursor: pointer;
	}

	.similar-shows {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
	}
</style>
