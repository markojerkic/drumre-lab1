<nav class="nav-bar">
	<div class="left">
		<a href="/">Home</a>
	</div>
	<div class="middle">
		<a href="/shows">Shows</a>
		<a href="/books">Books</a>
	</div>
	<div class="right">

	</div>
</nav>

<style>
    .nav-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        background-color: var(--background-color);
        color: var(--text-color);
        border-radius: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .middle {
        display: flex;
        gap: 20px;
    }

    .nav-bar a {
        color: var(--text-color);
        text-decoration: none;
        font-size: 1.2em;
        transition: color 0.3s ease;
    }

    .nav-bar a:hover {
        color: var(--primary-color);
    }
</style>
