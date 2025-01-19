<script lang="ts">
	import type { PageServerData } from "./$types";
	import { enhance } from "$app/forms";

	let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
	<title>User preferences</title>
</svelte:head>

<div class="header-container">
	<h2 class="title">Select preferred genres</h2>
</div>

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
	<div class="button-container">
		<button class="submit-search" type="submit">Save</button>
	</div>
</form>

<style>
	.header-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.genres-options {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
		max-width: 100%;
	}

	.genres-options span {
		display: flex;
		align-items: center;
		background-color: var(--background-color);
		padding: 0.5rem;
		border-radius: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.genres-options input {
		margin-right: 0.5rem;
		accent-color: var(--primary-color);
	}

	.genres-options label {
		cursor: pointer;
		color: var(--text-color);
	}

	.button-container {
		display: flex;
		justify-content: flex-end;
	}

	button.submit-search {
		background-color: var(--primary-color);
		color: var(--text-button-color);
		height: 40px;
		cursor: pointer;
		border: none;
		border-radius: 5px;
		padding: 0 1rem;
	}

	button.submit-search:hover {
		filter: brightness(0.9);
	}
</style>
