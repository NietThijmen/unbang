<script lang="ts">
    import type Bang from './bang.d'
    import CustomBangs from "./stores/customBangs";
    import {toast} from "svelte-sonner";
    import Bangs from "./stores/bangs";

    interface Props {
        isOpen: boolean;
        updateBangs: () => void;

    }

    let {
        isOpen = $bindable(false),
        updateBangs = $bindable(() => {})
    }: Props = $props()


    let creationData: Bang = $state({
        t: '',
        s: '',
        sc: '',
        c: '',
        d: '',
        u: '',
        r: 0
    })

    function validateSearchUrl(): boolean {
        if (!creationData.u.includes('{{{s}}}')) {
            return false;
        }

        return true;
    }

    function createBang(
        event: SubmitEvent
    ) {
        event.preventDefault();

        if(!validateSearchUrl()) {
            toast.error('URL must include {{{s}}} as a placeholder for the search query');
            return;
        }

        // if creationData.t contains a !, remove it (since it's implied)
        if (creationData.t.includes('!')) {
            creationData.t = creationData.t.replace(/!/g, '');
        }

        if (Bangs.getBangs().some(bang => bang.t === creationData.t)) {
            toast.error('Shortcut is already taken');
            return;
        }

        CustomBangs.addCustomBang(creationData);
        creationData = {
            t: '',
            s: '',
            sc: '',
            c: '',
            d: '',
            u: '',
            r: 0
        }

        updateBangs();
        close();

        toast.success("Bang created successfully");
    }

    function close() {
        isOpen = false;
    }
</script>

<div class="modal" class:open={isOpen}>
    <div class="modal-content">
        <form onsubmit={createBang}>
            <div class="fields">
                <div class="field">
                    <label for="category">Category</label>
                    <input id="category" type="text" bind:value={creationData.c} required/>
                </div>

                <div class="field">
                    <label for="domain">Domain</label>
                    <input id="domain" type="text" bind:value={creationData.d} required/>
                </div>

                <div class="field">
                    <label for="relevance">Relevance</label>
                    <input id="relevance" type="number" bind:value={creationData.r} required/>
                </div>

                <div class="field">
                    <label for="title">Title</label>
                    <input id="title" type="text" bind:value={creationData.s} required/>
                </div>

                <div class="field">
                    <label for="alt_title">Alt title</label>
                    <input id="alt_title" type="text" bind:value={creationData.sc} required/>
                </div>

                <div class="field">
                    <label for="shortcut">Shortcut</label>
                    <input id="shortcut" type="text" bind:value={creationData.t} required/>
                </div>

                <div class="field">
                    <label for="url">URL</label>
                    <input id="url" type="text" bind:value={creationData.u} required/>
                </div>

                <div class="field buttons">
                    <button type="submit">Create</button>
                    <button type="button" onclick={close}>Cancel</button>
                </div>


            </div>

        </form>
    </div>
</div>

<style>

    .fields {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .buttons {
        flex-direction: row;
        justify-content: flex-end;
    }

    button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background-color: var(--accent-bg);
        color: var(--text);
        cursor: pointer;
    }

    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }

    .modal.open {
        opacity: 1;
        pointer-events: auto;
    }

    .modal-content {
        background-color: var(--bg);
        padding: 20px;
        border-radius: 8px;
        max-width: 500px;
        width: 100%;
    }
</style>