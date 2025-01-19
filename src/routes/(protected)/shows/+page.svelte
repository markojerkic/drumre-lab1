<script lang="ts">
	import { enhance } from "$app/forms";
	import ShowThumbnail from "$components/ShowThumbnail.svelte";
	import type { PageServerData } from "./$types";

	const { data }: { data: PageServerData } = $props();
	let initialSearch = $state(data.search);
</script>

{#snippet previousPage()}
	<div class="paginator">
		<button
			class="previous-page {data.cursor && data.cursor > 50 ? '' : 'hidden'}"
			name="cursor"
			value={Math.max(data.cursor - 100, 0)}
			form="search-form"
			aria-labelledby="Previous page"
		>
		</button>
	</div>
{/snippet}

{#snippet nextPage()}
	<div class="paginator">
		<button
			class="next-page {data.hasNext ? '' : 'hidden'}"
			name="cursor"
			value={data.cursor}
			form="search-form"
			aria-labelledby="Next page"
		></button>
	</div>
{/snippet}

<form method="GET" action="/shows" id="search-form" class="search-form">
	{@render previousPage()}
	<div class="search-form">
		<label>
			<input
				type="text"
				name="search"
				bind:value={initialSearch}
				class="search-input"
				placeholder="Search shows"
			/>
		</label>
		<button class="submit-search">GO</button>
		<p class="results">Results: {data.total}</p>
	</div>
	{@render nextPage()}
</form>

<form method="POST" action="?/delete" use:enhance id="delete"></form>
<form method="POST" action="?/removeFavourite" use:enhance id="remove-favourite"></form>
<form method="POST" action="?/addFavourite" use:enhance id="add-favourite"></form>

<div class="articles">
	{#each data.shows as show}
		<ShowThumbnail {show} showDeleteButton={true}></ShowThumbnail>
	{/each}
</div>

<style>
	.paginator {
		display: flex;
		justify-content: space-between;
	}

	.next-page,
	.previous-page,
	.submit-search {
		background-color: var(--primary-color);
		color: var(--text-button-color);
		padding: 10px;
		max-width: 200px;
		max-height: 200px;
		border-radius: 10px;
		cursor: pointer;
		visibility: visible;
		border: none;
		font-size: 1.2em;
	}

	.next-page:hover,
	.previous-page:hover,
	.submit-search:hover {
		filter: brightness(0.8);
	}

	.hidden {
		visibility: hidden;
	}

	.next-page:after {
		content: "Next";
	}

	.previous-page:after {
		content: "Previous";
	}

	.search-form {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px;
		margin: 0 auto;
	}

	.search-input {
		padding: 10px;
		border-radius: 10px;
		flex-grow: 1;
		font-size: 1.2em;
	}

	.articles {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 20px;
	}

	.results {
		color: var(--text-color);
	}
</style>
