<script lang="ts">
    import {onMount} from "svelte";
    import { injectAnalytics } from '@vercel/analytics/sveltekit';

    const isProd = import.meta.env.PROD;

    onMount(() => {
        injectAnalytics({
            mode: isProd ? 'production' : 'development',
            beforeSend: event => {
                const url = new URL(event.url);
                url.searchParams.delete('q');
                event.url = url.toString();


                return event;
            }

        })
    });
</script>