<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';

	const { data }: { data: PageServerData } = $props();
	let initialSearch = $state(data.search);
</script>

<h1>Books</h1>

<form method="get" use:enhance>
	<label>
		Search:
		<input type="text" name="search" bind:value={initialSearch} />
	</label>
	<button>Search</button>
</form>

<div class="articles">
	{#each data.books as book}
		<article>
			<h2>{book.title}</h2>
			<p><b>Author:</b> {book.author}</p>
			<p><b>Price:</b> {book.price}</p>
			<p><b>Description:</b> {book.description}</p>
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
