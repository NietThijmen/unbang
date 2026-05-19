<script lang="ts">
    import Search from "./Pages/Search.svelte";
</script>


<svelte:head>
    <title>Unbang</title>
    <meta name="description" content="Unbang is a search engine that allows you to search using bangs, which are shortcuts for specific websites. For example, !g for Google, !w for Wikipedia, and !yt for YouTube. Unbang is open source and free to use."/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta property="og:title" content="Unbang"/>
    <meta property="og:description" content="Unbang is a search engine that allows you to search using bangs, which are shortcuts for specific websites. For example, !g for Google, !w for Wikipedia, and !yt for YouTube. Unbang is open source and free to use."/>
    <link rel="search" type="application/opensearchdescription+xml" title="UnBang" href="/opensearch.xml"/>
</svelte:head>

<Search/>


