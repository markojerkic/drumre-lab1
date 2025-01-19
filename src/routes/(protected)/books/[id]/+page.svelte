<script lang="ts">
	import { enhance } from '$app/forms';
	import BookThumbnail from '$components/BookThumbnail.svelte';
	import type { PageServerData } from './$types';

	let { data }: { data: PageServerData } = $props();
	let book = $derived(data.book!);
</script>

<svelte:head>
	<title>{book.title}</title>
</svelte:head>


<form method="POST" action="/books?/removeFavourite" use:enhance id="remove-favourite"></form>
<form method="POST" action="/books?/addFavourite" use:enhance id="add-favourite"></form>

<article class="book-details">
	<div>
		<img class="thumbnail" src={book.imageLinks?.thumbnail || '/book-cover-placeholder.jpg'} alt={book.title} />
	</div>
	<div>
		<h1>{book.title}</h1>
		<p>{book.description}</p>
	</div>
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
	<span><a href={book.previewLink} target="_blank">Preview Link</a></span>
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

{#await data.similarBooks then similarBooks}
	{#if similarBooks}
		<h2>Similar books</h2>
		<div class="similar-books">
			{#each similarBooks as book}
				<BookThumbnail {book} showDeleteButton={false}/>
			{/each}
		</div>
	{/if}
{/await}

<style>

    .book-details {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        background-color: var(--background-color);
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				margin-bottom: 20px;
				margin-top: 20px;
    }

    .thumbnail {
        max-width: 200px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				margin-top: 20px;
    }

    .book-details p {
        color: var(--text-color);
        flex: 1;
    }

    h1 {
        color: var(--text-color);
    }

    .data-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 1rem;
        background-color: var(--background-color);
        padding: 1rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .data-grid .label {
        font-weight: bold;
        color: var(--text-color);
    }

		.data-grid span {
        color: var(--text-color);
		}

    button.add-favourite, button.remove-favourite {
        background-color: var(--primary-color);
        color: var(--text-button-color);
        padding: 10px;
        margin-top: 10px;
        cursor: pointer;
        border: none;
        border-radius: 5px;
    }

		button.remove-favourite {
			background-color: var(--danger-color);
    }

    button.add-favourite:hover, button.remove-favourite:hover {
        filter: brightness(0.8);
    }

    .similar-books {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }
</style>