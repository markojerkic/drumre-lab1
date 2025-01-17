<script>
	import Nav from '$components/Nav.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>DRUMRE projekt</title>
	<script src="https://website-widgets.pages.dev/dist/sienna.min.js" defer></script>
</svelte:head>

<Nav />

{@render children()}
