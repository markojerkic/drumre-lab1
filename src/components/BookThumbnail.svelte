<script lang="ts">
	import { enhance } from '$app/forms';
	import type { BookType } from '$lib/types';
	import type { Snippet } from 'svelte';

	let { book, children }: { book: BookType; children?: Snippet } = $props();
</script>

<article>
	<form method="POST" action="/books?/removeFavourite" use:enhance id="remove-favourite"></form>
	<form method="POST" action="/books?/addFavourite" use:enhance id="add-favourite"></form>
	<h2>
		<a href={`/books/${book._id}`}>
			{book.title}
		</a>
	</h2>
	{#if book.imageLinks?.thumbnail}
		<img src={book.imageLinks.thumbnail} alt={book.title} />
	{/if}
	<p><b>Author:</b> {book.authors}</p>
	<p><b>Genre:</b> {book.categories}</p>
	<p><b>Pages:</b> {book.pageCount}</p>
	<p><b>Description:</b> {book.description}</p>

	{#if book.isFavourite}
		<button class="remove-favourite" name="id" value={book._id} form="remove-favourite"
			>Remove from favorites</button
		>
	{:else}
		<button class="add-favourite" name="id" value={book._id} form="add-favourite"
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
