<script lang="ts">
	import Nav from '$components/Nav.svelte';
	import type { PageServerData } from './$types';

	const { data }: { data: PageServerData } = $props();
	let initialSearch = $state(data.search);
</script>

<Nav />

<h1>Shows</h1>

<form method="GET" action="/shows">
	<label>
		Search:
		<input type="text" name="search" bind:value={initialSearch} />
	</label>
	<button>Search</button>
</form>

<div class="articles">
	{#each data.shows as show}
		<article>
			<h2>{show.title}</h2>
			<p><b>Year:</b> {show.year}</p>
			<p><b>Rating:</b> {show.rating}</p>
			<p><b>Country:</b> {show.country}</p>
		</article>
	{/each}
</div>

<style>
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
