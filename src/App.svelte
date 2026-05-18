<script lang="ts">
    import {handleRedirect} from "./lib/navigate";
    import ReloadPrompt from './lib/ReloadPrompt.svelte'

    import Redirecting from './Pages/redirecting.svelte';
    import Search from "./Pages/Search.svelte";

    const hasQueryParam = new URLSearchParams(window.location.search).has('q')

    $effect.pre(() => {
        handleRedirect();
    })

</script>

<ReloadPrompt/>

<svelte:head>
    <title>Unbang</title>
    <meta name="description" content="Unbang is a search engine that allows you to search using bangs, which are shortcuts for specific websites. For example, !g for Google, !w for Wikipedia, and !yt for YouTube. Unbang is open source and free to use."/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta property="og:title" content="Unbang"/>
    <meta property="og:description" content="Unbang is a search engine that allows you to search using bangs, which are shortcuts for specific websites. For example, !g for Google, !w for Wikipedia, and !yt for YouTube. Unbang is open source and free to use."/>
</svelte:head>

{#if hasQueryParam}
    <Redirecting/>
{:else}
    <Search/>
{/if}
