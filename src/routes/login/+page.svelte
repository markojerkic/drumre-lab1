<!-- routes/login/+page.svelte -->
<h1>Sign in</h1>
<div class="auth-options">
	<a href="/login/github" class="login-button">Sign in with GitHub</a>
	<a href="/login/google" class="login-button">Sign in with Google</a>
</div>

<style>
	.auth-options {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	h1 {
		text-align: center;
		font-size: 2em;
		margin-top: 20px;
		color: var(--text-color);
	}

	.login-button {
		display: block;
		margin: 20px auto;
		padding: 10px;
		text-align: center;
		color: white;
		background-color: var(--primary-color);
		text-decoration: none;
		border-radius: 5px;
		font-size: 1.2em;
		transition: background-color 0.3s ease;
	}

	.login-button:hover {
		filter: brightness(0.6);
	}
</style>
