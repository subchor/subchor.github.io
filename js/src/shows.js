import Shows from './components/shows/Shows.svelte';

new Shows({
    target: document.querySelector('#shows-app'),
    props: {
        maxShows: 5
    }
});