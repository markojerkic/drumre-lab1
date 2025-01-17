<!-- routes/login/+page.svelte -->
<h1>Sign in</h1>
<div class="auth-options">
	<a href="/login/github">Sign in with GitHub</a>
	<a href="/login/google">Sign in with Google</a>
</div>

<style>
	.auth-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
