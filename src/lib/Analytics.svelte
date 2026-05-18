<script lang="ts">
    import {onMount} from "svelte";
    import { injectAnalytics } from '@vercel/analytics/sveltekit';

    const isProd = import.meta.env.PROD;

    onMount(() => {
        injectAnalytics({
            mode: isProd ? 'production' : 'development',

        })
    });
</script>