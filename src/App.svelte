<script lang="ts">
  import { bangs } from './lib/bang'
  import type Bang from './lib/bang.d'

  import {handleRedirect} from "./lib/navigate";
  import ReloadPrompt from './lib/ReloadPrompt.svelte'

  import {onMount} from "svelte";

  const categorySet = new Set(bangs.map((bang) => bang.c))
  const categories = ['All', ...Array.from(categorySet).sort()]


  onMount(() => {
    handleRedirect();
  })

  let query = $state('')
  let selectedCategory = $state('All')



  const matchesQuery = (bang: Bang, normalizedQuery: string) => {
    if (!normalizedQuery) return true
    return [`!${bang.t}`, bang.t, bang.s, bang.sc, bang.c, bang.d]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(normalizedQuery))
  }


  function normaliseQuery() {
    return query.trim().toLowerCase()
  }
  function filterBangs() {
    const normalizedQuery = query.trim().toLowerCase()

    let filtered = bangs.filter(
      (bang) =>
        (selectedCategory === 'All' || bang.c === selectedCategory) &&
        matchesQuery(bang, normalizedQuery)
    )

    // order by relevance (r), then alphabetically by shortcut (t)
    filtered.sort((a, b) => {
      if (a.r !== b.r) {
        return b.r - a.r // higher relevance first
      }
      return a.t.localeCompare(b.t) // then alphabetically by shortcut
    });

    return filtered
  }

  function getVisibleBangs() {
    const normalizedQuery = query.trim().toLowerCase()
    const filtered = bangs.filter(
      (bang) =>
        (selectedCategory === 'All' || bang.c === selectedCategory) &&
        matchesQuery(bang, normalizedQuery)
    )
    return filtered.slice(0, 200)
  }


  let normalizedQuery = $derived(normaliseQuery())
  let filteredBangs = $derived(filterBangs())
  let visibleBangs: Bang[] = $derived(getVisibleBangs())


  const hostname = window.location.hostname
  const isHttps = window.location.protocol === 'https:'
  const urlPrefix = isHttps ? 'https://' : 'http://'

  const fullUrl = `${urlPrefix}${hostname}/?q=%s`

</script>

<ReloadPrompt />

<main class="bang-search">
  <header class="bang-header">
    <div>
      <h1>Unbang</h1>
      <p>
        A fast, client-side search of DuckDuckGo's <a href="https://duckduckgo.com/bang.html" target="_blank">bang shortcuts.</a>
      </p>
    </div>
    <div class="stats">
      <div class="stat-card">
        <span class="stat-value">{bangs.length.toLocaleString()}</span>
        <span class="stat-label">Total bangs</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{filteredBangs.length.toLocaleString()}</span>
        <span class="stat-label">Matches</span>
      </div>
    </div>
  </header>

  <section class="controls">
    <label class="field">
      <span>Search</span>
      <input
        type="search"
        bind:value={query}
        placeholder="Try !w, wikipedia, shopping, or amazon"
      />
    </label>
    <label class="field">
      <span>Category</span>
      <select bind:value={selectedCategory}>
        {#each categories as category}
          <option value={category}>{category}</option>
        {/each}
      </select>
    </label>
  </section>

  <section class="usage-instructions">
    <h2>Usage</h2>
    <p>DuckDuckGo's bang redirects are too slow. Add the following URL as a custom search engine to your browser. Enables <a href="https://duckduckgo.com/bang.html" target="_blank">all of DuckDuckGo's bangs.</a></p>

    <pre class="code-snippet">{fullUrl}</pre>


  </section>

  <section>
    <div class="results-header">
      <h2>Results</h2>
      <p>
        Showing {visibleBangs.length.toLocaleString()} of
        {filteredBangs.length.toLocaleString()}.
        {#if filteredBangs.length > visibleBangs.length}
          Refine your search to see more.
        {/if}
      </p>
    </div>

    {#if filteredBangs.length === 0}
      <p class="empty">No bangs match that search. Try another shortcut or category.</p>
    {:else}
      <ul class="bang-grid">
        {#each visibleBangs as bang (bang.t + bang.d)}
          <li class="bang-card">
            <div class="bang-title">
              <span class="bang-shortcut">!{bang.t}</span>
              <h3>{bang.s}</h3>
            </div>
            <p class="bang-meta">{bang.sc || 'No alternate title provided.'}</p>
            <div class="bang-tags">
              <span>{bang.c}</span>
              <span>{bang.d}</span>
              <span>r:{bang.r}</span>
            </div>
            <div class="bang-url">{bang.u}</div>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</main>
