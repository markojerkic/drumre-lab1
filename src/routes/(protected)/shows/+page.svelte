<script lang="ts">
	import { enhance } from '$app/forms';
	import Nav from '$components/Nav.svelte';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();
	let initialSearch = $state(data.search);
</script>

<Nav />

<h1>Shows</h1>

{#snippet nextPage()}
	<div class="paginator">
		{#if data.cursor && data.cursor > 50}
			<button
				class="previous-page"
				name="cursor"
				value={Math.max(data.cursor - 100, 0)}
				form="search-form">Previous page</button
			>
		{/if}

		{#if data.hasNext}
			<button class="next-page" name="cursor" value={data.cursor} form="search-form"
				>Next page</button
			>
		{/if}
	</div>
{/snippet}

<form method="GET" action="/shows" id="search-form">
	<label>
		Search:
		<input type="text" name="search" bind:value={initialSearch} />
	</label>
	<button class="submit-search">Search</button>
</form>

{@render nextPage()}

<span class="total">Total shows: {data.total}</span>
<form method="POST" action="?/delete" use:enhance id="delete"></form>

<div class="articles">
	{#each data.shows as show}
		<article>
			<h2>{show.title}</h2>
			<p><b>Year:</b> {show.year}</p>
			<p><b>Rating:</b> {show.rating}</p>
			<p><b>Country:</b> {show.country}</p>
			<button class="delete" name="id" value={show._id} form="delete">Delete</button>
		</article>
	{/each}
</div>
{@render nextPage()}

<style>
	button.delete {
		background-color: #dc3545;
		color: white;
		padding: 10px;
		margin-top: 10px;
	}

	span.total {
		font-size: 1.5em;
	}

	.paginator {
		display: flex;
		justify-content: space-between;
	}

	.previous-page {
		background-color: #dc3545;
		color: white;
		padding: 10px;
	}

	.submit-search {
		background-color: #4caf50;
		color: white;
		padding: 10px;
	}

	.next-page {
		background-color: #007bff;
		color: white;
		padding: 10px;
	}

	.articles {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
	}
	article {
		border: 1px solid #ccc;
		padding: 20px;
	}
	label {
		display: block;
		margin-bottom: 10px;
	}
	form > button {
		margin-top: 10px;
		margin-bottom: 10px;
	}
</style>
