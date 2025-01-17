<script lang="ts">
	import type { PageServerData } from './$types';
	import { enhance } from '$app/forms';

	let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
	<title>User preferences</title>
</svelte:head>

<h1>User preferences</h1>

<h2>Select prefered genres</h2>

<form use:enhance method="post">
	<div class="genres-options">
		{#each data.genres as genre}
			<span>
				<label>
					<input
						type="checkbox"
						name="genres"
						value={genre}
						checked={data.userGenres.includes(genre)}
					/>
					{genre}
				</label>
			</span>
		{/each}
	</div>

	<button class="submit-search" type="submit">Save</button>
</form>

<style>
	.genres-options {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 1rem;
	}
	.genres-options span {
		display: inline-flex;
	}
	.genres-options input {
		margin-right: 0.25rem;
	}

	.genres-options label {
		cursor: pointer;
	}

	button.submit-search {
		background-color: #4caf50;
		color: white;
		padding: 10px 20px;
		border: none;
		cursor: pointer;
	}
</style>
