<script>
  import { pollActions } from '../data/polls.svelte.js';
  import { fade } from 'svelte/transition';
  import { getContext } from 'svelte';

  let {
    poll = $bindable(),
    closePoll,
    selectedOption = $bindable([]),
    togglehasVoted,
    votingDisabled = $bindable(false)
  } = $props();

  let tweens = getContext('tweens');
  let progressOptions = pollActions.progressOptions(poll.id);
</script>

<div in:fade={{ duration: 300 }}>
  <h2
    class="mt-6 mb-2 border-b border-gray-200 pb-1 text-lg font-semibold text-gray-800 dark:border-gray-600 dark:text-gray-200"
  >
    Poll Summary
  </h2>
  <ul>
    {#each $progressOptions as option, index (option.id)}
      <li
        class="mb-2 flex flex-col rounded-lg bg-gray-50 px-3 py-2 shadow-sm dark:bg-gray-700"
        in:fade={{ duration: 200, delay: index * 100 }}
      >
        <div class="mb-1 flex items-center justify-between">
          <span class="font-medium text-gray-700 dark:text-gray-300">{option.text}</span>
          <span
            class="bg-primary-100 dark:bg-primary-200 text-primary-700 dark:text-primary-800 rounded-full px-3 py-1 text-sm font-semibold"
          >
            {option.votes} votes
          </span>
        </div>
        <div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
          <progress
            class="bg-primary-600 dark:bg-primary-500 h-2.5 w-full rounded-full transition-all duration-600 ease-out"
            value={tweens[option.id]?.current}
          ></progress>
        </div>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {Math.round((tweens[option.id]?.current || 0) * 100)}%
        </p>
      </li>
    {/each}
  </ul>
  <div class="mt-4 flex gap-2">
    <button
      onclick={closePoll}
      class="w-full rounded-lg px-4 py-2 font-semibold text-gray-600 shadow transition-colors
                duration-200 dark:bg-gray-500 dark:text-white dark:hover:bg-gray-600"
    >
      Close
    </button>
    <button
      onclick={() => {
        if (selectedOption !== null) {
          pollActions.unvote(poll.id, selectedOption);
        }
        togglehasVoted();
        votingDisabled = false;
        selectedOption = null;
      }}
      class="bg-secondary-600 hover:bg-secondary-700 dark:bg-secondary-500 dark:hover:bg-secondary-600 w-full rounded-lg
                bg-slate-700 px-4 py-2 font-semibold text-white shadow transition-colors duration-200 hover:cursor-pointer"
    >
      Revote
    </button>
  </div>
</div>
