<script lang="ts">
    import {Coffee, GitFork} from "@lucide/svelte";
</script>

<div class="credits">

    <div class="github credit">
        <GitFork class="icon"/>
        <a href="https://github.com/nietthijmen/unbang" target="_blank">GitHub</a>
    </div>

    <div class="buymeacoffee credit">
        <Coffee class="icon"/>
        <a href="https://www.buymeacoffee.com/nietthijmen" target="_blank">Buy me a coffee</a>
    </div>
</div>

<style>
    .credits {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .credits .credit {
        display: flex;
        align-items: center;
        gap: 5px;
        font-family: sans-serif;
    }


</style>