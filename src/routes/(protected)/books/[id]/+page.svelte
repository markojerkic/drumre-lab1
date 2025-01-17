<script lang="ts">
	import { enhance } from '$app/forms';
	import BookThumbnail from '$components/BookThumbnail.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let book = data.book!;
</script>

<svelte:head>
	<title>{book.title}</title>
</svelte:head>

<h1>{book.title}</h1>

<form method="POST" action="/books?/removeFavourite" use:enhance id="remove-favourite"></form>
<form method="POST" action="/books?/addFavourite" use:enhance id="add-favourite"></form>

{#if book?.imageLinks?.thumbnail}
	<img class="thumbnail" src={book.imageLinks.thumbnail} alt={book.title} />
{/if}

<article>
	<p>{book.description}</p>
</article>

<div class="data-grid">
	<span class="label">Author:</span>
	<span>{book.authors}</span>
	<span class="label">Subtitle:</span>
	<span>{book.subtitle}</span>
	<span class="label">Genre:</span>
	<span>{book.categories}</span>
	<span class="label">Published:</span>
	<span>{book.publishedDate}</span>
	<span class="label">Pages:</span>
	<span>{book.pageCount}</span>
	<span class="label">Language:</span>
	<span>{book.language}</span>
	<span class="label">Publisher:</span>
	<span>{book.publisher}</span>
	<span class="label">Preview:</span>
	<span>{book.previewLink}</span>
</div>

{#if data.isUsersFavourite}
	<button class="remove-favourite" name="id" value={book._id} form="remove-favourite"
		>Remove from favorites</button
	>
{:else}
	<button class="add-favourite" name="id" value={book._id} form="add-favourite"
		>Add to favorites</button
	>
{/if}

{#await data.similarBooks then smilarBooks}
	{#if smilarBooks}
		<h2>Similar books</h2>
		<div class="similar-books">
			{#each smilarBooks as book}
				<BookThumbnail {book} />
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

	.similar-books {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
	}
</style>
