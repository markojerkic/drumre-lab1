<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ShowType } from '$lib/types';
	import type { Snippet } from 'svelte';

	let {
		show,
		children,
		showDeleteButton
	}: { show: ShowType; children?: Snippet; showDeleteButton?: boolean } = $props();
</script>

<article>
	<div class="show-container">
		{#if show.poster}
			<a href={`/shows/${show._id}`}>
				<img src={show.poster} alt={show.title} class="show-thumbnail" />
			</a>
		{:else}
			<h2>
				<a href={`/shows/${show._id}`}>{show.title}</a>
			</h2>
		{/if}

		<div class="show-info">
			<p>{show.genres.join(', ')}</p>
		</div>

		<p>{show.rating.toFixed(2)} / 10</p>

		<div class="buttons {showDeleteButton ? '' : 'single-button'}">
			{#if show.isFavourite}
				<form method="POST" action="/shows?/removeFavourite" use:enhance>
					<button class="remove-favourite" name="id" value={show._id}>Remove from favorites</button>
				</form>
			{:else}
				<form method="POST" action="/shows?/addFavourite" use:enhance>
					<button class="add-favourite" name="id" value={show._id}>Add to favorites</button>
				</form>
			{/if}

			{#if showDeleteButton}
				<form method="POST" action="?/delete" use:enhance>
					<button class="delete" name="id" value={show._id}>Delete</button>
				</form>
			{/if}
		</div>
	</div>

	{#if children}
		{@render children()}
	{/if}
</article>

<style>
	article {
		border: 1px solid transparent;
		border-radius: 10px;
		overflow: hidden;
		text-align: center;
		padding: 20px;
	}

	article p {
		color: var(--text-color);
	}

	.show-container {
		max-width: 200px;
	}

	/* BUTTONS */
	.buttons {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	/* IMAGE */
	img.show-thumbnail {
		width: 100%;
		height: auto;
		display: block;
		border: 1px solid var(--border-color);
		border-radius: 10px;
	}

	.buttons.single-button {
		justify-content: center;
	}

	button:hover {
		filter: brightness(0.8);
	}

	button.add-favourite,
	button.remove-favourite,
	button.delete {
		background-color: var(--primary-color);
		color: var(--text-button-color);
		height: 40px;
		cursor: pointer;
		border: none;
		border-radius: 5px;
	}

	button.delete,
	button.remove-favourite {
		background-color: var(--danger-color);
	}

	/* SHOW INFO */
	.show-info {
		width: 100%;
		color: var(--text-color);
	}

	.show-info h2 {
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.show-info p {
		filter: brightness(0.8);
	}
</style>
