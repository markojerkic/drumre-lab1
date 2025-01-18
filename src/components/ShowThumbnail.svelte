<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ShowType } from '$lib/types';
	import type { Snippet } from 'svelte';

	let { show, children }: { show: ShowType; children?: Snippet } = $props();
</script>

<article>
	<form
		method="POST"
		action="/shows?/removeFavourite"
		use:enhance
		id="show-remove-favourite"
	></form>
	<form method="POST" action="/shows?/addFavourite" use:enhance id="show-add-favourite"></form>

	<h2>
		<a href={`/shows/${show._id}`}>{show.title}</a>
	</h2>
	<p>
		{#if show.tagline}
			{show.tagline}
		{:else if show.overview}
			{show.overview}
		{/if}
	</p>
	<p><b>Year:</b> {show.year}</p>
	<p><b>Rating:</b> {show.rating}</p>
	<p><b>Country:</b> {show.country}</p>

	{#if show.isFavourite}
		<button class="remove-favourite" name="id" value={show._id} form="show-remove-favourite"
			>Remove from favorites</button
		>
	{:else}
		<button class="add-favourite" name="id" value={show._id} form="show-add-favourite"
			>Add to favorites</button
		>
	{/if}

	{#if children}
		{@render children()}
	{/if}
</article>

<style>
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
	article {
		border: 1px solid #ccc;
		padding: 20px;
	}
</style>
