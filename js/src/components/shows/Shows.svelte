<ul>
    {#each shows as show}
        <li>{show.title}</li>
    {/each}
</ul>

<script>
    export let maxShows;
    
    
    import { onMount } from 'svelte';

    let shows = [];

    onMount(async () => {
        const res = await fetch(`/shows.json`);
        const allShows = await res.json();
        shows = maxShows === undefined ?
            allShows :
            allShows.slice(0, maxShows);
    });

</script>