<script lang="ts">
    import {onMount} from "svelte";
    import { inject } from '@vercel/analytics';

    const isProd = import.meta.env.PROD;

    onMount(() => {
        inject({
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