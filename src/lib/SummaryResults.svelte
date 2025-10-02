<script>
  import { pollActions, polls } from '../data/polls.svelte.js';
  import { fade } from 'svelte/transition';
  import { getContext } from 'svelte';

  let {
    poll = $bindable(),
    closePoll,
    selectedOption = $bindable([]),
    togglehasVoted,
    votingDisabled = $bindable(false),
  } = $props();

  let tweens = getContext('tweens');
  let progressOptions = pollActions.progressOptions(poll.id);
</script>

<div in:fade={{ duration: 300 }}>
  <h2
    class="mt-6 mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-1"
  >
    Poll Summary
  </h2>
  <ul>
    {#each $progressOptions as option, index}
      <li
        class="flex flex-col py-2 px-3 mb-2 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
        in:fade={{ duration: 200, delay: index * 100 }}
      >
        <div class="flex justify-between items-center mb-1">
          <span class="font-medium text-gray-700 dark:text-gray-300">{option.text}</span>
          <span
            class="bg-primary-100 dark:bg-primary-200 text-primary-700 dark:text-primary-800 font-semibold px-3 py-1 rounded-full text-sm"
          >
            {option.votes} votes
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
          <progress
            class="bg-primary-600 dark:bg-primary-500 h-2.5 rounded-full transition-all w-full duration-600 ease-out"
            value={tweens[option.id]?.current}
          ></progress>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {Math.round((tweens[option.id]?.current || 0) * 100)}%
        </p>
      </li>
    {/each}
  </ul>
  <div class="flex gap-2 mt-4">
    <button
      onclick={closePoll}
      class="w-full text-gray-600 dark:bg-gray-500 dark:hover:bg-gray-600 dark:text-white font-semibold py-2 px-4
                rounded-lg shadow transition-colors duration-200"
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
      class="w-full bg-secondary-600 hover:cursor-pointer bg-slate-700 hover:bg-secondary-700 dark:bg-secondary-500
                dark:hover:bg-secondary-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-200"
    >
      Revote
    </button>
  </div>
</div>
