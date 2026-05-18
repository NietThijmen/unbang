<script lang="ts">

    import type Bang from '../lib/bang.d'

    import {onMount} from "svelte";
    import DefaultBang from "../lib/stores/defaultBang";
    import Credits from "../lib/Credits.svelte";
    import Bangs from "../lib/stores/bangs";
    import CreateBang from "../lib/CreateBang.svelte";
    import CustomBangs from "../lib/stores/customBangs";


    let bangs = $state(Bangs.getBangs())
    let customBangs = $state(CustomBangs.getCustomBangs())
    let isCreationOpen = $state(false)


    function updateBangs() {
        bangs = Bangs.getBangs();
        customBangs = CustomBangs.getCustomBangs(); // trigger reactivity
    }

    const categorySet = new Set(bangs.map((bang) => bang.c))
    const categories = ['All', 'Custom', ...Array.from(categorySet).sort()]


    let query = $state('')
    let selectedCategory = $state('Custom')

    let defaultBang = $state('g');

    onMount(() => {
      defaultBang = DefaultBang.getDefaultBang();
    })


    function setDefaultBang(shortcut: string) {
      DefaultBang.setDefaultBang(shortcut);
      defaultBang = shortcut;
    }



    const matchesQuery = (bang: Bang, normalizedQuery: string) => {
        if (!normalizedQuery) return true
        return [`!${bang.t}`, bang.t, bang.s, bang.sc, bang.c, bang.d]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(normalizedQuery))
    }

    function filterBangs() {
        const normalizedQuery = query.trim().toLowerCase()

        let filtered = [...bangs];

        if(selectedCategory === 'Custom') {
          filtered = bangs.filter(bang => bang.isCustom === true);
        } else if (selectedCategory !== 'All') {
          filtered = bangs.filter(bang => bang.c === selectedCategory);
        }



        // filtered.filter(bang => matchesQuery(bang, normalizedQuery))
        //
        //
        // // order by relevance (r), then alphabetically by shortcut (t)
        // filtered.sort((a, b) => {
        //     if (a.r !== b.r) {
        //         return b.r - a.r // higher relevance first
        //     }
        //     return a.t.localeCompare(b.t) // then alphabetically by shortcut
        // });
        //
        //
        // // set default bang to the top if it matches the query and category
        // if (defaultBang) {
        //     filtered.sort((a, b) => {
        //         if (a.t === defaultBang) return -1
        //         if (b.t === defaultBang) return 1
        //         return 0
        //     });
        // }

        return filtered
    }

    function getVisibleBangs() {
        return filteredBangs.slice(0, 200)
    }

    let filteredBangs = $derived(filterBangs())
    let visibleBangs: Bang[] = $derived(getVisibleBangs())


    const hostname = window.location.hostname
    const isHttps = window.location.protocol === 'https:'
    const urlPrefix = isHttps ? 'https://' : 'http://'

    const fullUrl = `${urlPrefix}${hostname}/?q=%s`

</script>
<main class="bang-search">
  <Credits/>

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

      <div class="stat-card">
        <span class="stat-value">
            {customBangs.length.toLocaleString()}
        </span>
        <span class="stat-label">Custom bangs</span>

      </div>

      <div class="stat-card">
        <span class="stat-value">Create bang</span>
        <button onclick={() => isCreationOpen = true} class="create-button">+</button>
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

          {@const isCustom = bang.isCustom ? true : false}

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

            <div class="bang-actions">
              <a href={bang.u.replace('{{{s}}}', 'example')} class="use-it" target="_blank" rel="noopener noreferrer">Try it</a>
              <button onclick={() => setDefaultBang(bang.t)} class="set-default">
                {defaultBang === bang.t ? 'Default search-engine' : 'Set as default'}
              </button>

              {#if isCustom}
                <button onclick={() => {
                    CustomBangs.removeCustomBang(bang.t);
                    updateBangs();
                  }} class="remove-button">Remove</button>
              {/if}
              </div>
          </li>
        {/each}
      </ul>
    {/if}
  </section>
</main>

<CreateBang bind:isOpen={isCreationOpen} bind:updateBangs={updateBangs}/>

<style>
  .bang-actions {
    margin-top: 10px;
    display: flex;
    gap: 10px;
  }

  .bang-actions .use-it {
    padding: 5px 10px;
    background-color: #007acc;
    color: white;
    border: none;
    border-radius: 4px;
    text-decoration: none;
  }

  .bang-actions .set-default {
    padding: 5px 10px;
    background-color: #eee;
    color: #333;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .bang-actions .remove-button {
    padding: 5px 10px;
    background-color: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .custom-badge {
    background-color: #ff9800;
    color: white;
    font-size: 0.75rem;
    padding: 2px 6px;
    border-radius: 4px;
    margin-left: 10px;
  }
</style>