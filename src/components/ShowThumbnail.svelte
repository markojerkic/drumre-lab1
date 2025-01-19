<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ShowType } from '$lib/types';
	import type { Snippet } from 'svelte';

	let { show, children, showDeleteButton }: { show: ShowType; children?: Snippet; showDeleteButton?: boolean } = $props();
</script>

<article>
	<form method="POST" action="?/delete" use:enhance id="delete"></form>
	<form method="POST" action="/shows?/removeFavourite" use:enhance id="show-remove-favourite"></form>
	<form method="POST" action="/shows?/addFavourite" use:enhance id="show-add-favourite"></form>

	<div class="show-container">
		<h2>
			<a href={`/shows/${show._id}`}>{show.title}</a>
		</h2>

		<div class="show-info">
			<p>{show.genres.join(', ')}</p>
		</div>

		<p>{show.rating.toFixed(2)} / 10</p>

		<div class="buttons {showDeleteButton ? '': 'single-button'}">
			{#if show.isFavourite}
				<button class="remove-favourite" name="id" value={show._id} form="show-remove-favourite">Remove from favorites</button>
			{:else}
				<button class="add-favourite" name="id" value={show._id} form="show-add-favourite">Add to favorites</button>
			{/if}

			{#if showDeleteButton}
				<button class="delete" name="id" value={show._id} form="delete">Delete</button>
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

    .buttons.single-button {
        justify-content: center;
    }

    button:hover {
        filter: brightness(0.8);
    }

    button.add-favourite, button.remove-favourite, button.delete {
        background-color: var(--primary-color);
        color: var(--text-button-color);
        height: 40px;
        cursor: pointer;
        border: none;
        border-radius: 5px;
    }

    button.delete, button.remove-favourite {
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