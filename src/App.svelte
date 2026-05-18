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

{#if hasQueryParam}
    <Redirecting/>
{:else}
    <Search/>
{/if}
