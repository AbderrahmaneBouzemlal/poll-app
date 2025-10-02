<script>
  // @ts-ignore
  import SummaryResults from './SummaryResults.svelte';
  import { positionAwareScale } from './transition.js';
  import { pollActions } from '../data/polls.svelte.js';
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { handleClickOutside } from '../actions.svelte.js';
  import { setContext } from 'svelte';

  let { closePoll, poll = $bindable(), clickPosition } = $props();
  let selectedOption = $state(null);
  let hasVoted = $state(false);
  let votingDisabled = $state(false);
  let progressOptions = pollActions.progressOptions(poll.id);
  let tweens = $state({});

  $effect(() => {
    updateTweens();
  });
  setContext('tweens', tweens);

  function updateTweens() {
    $progressOptions.forEach((option) => {
      if (!tweens[option.id]) {
        tweens[option.id] = new Tween(0, { duration: 600, easing: cubicOut });
      }
      tweens[option.id].target = option.progress || 0;
    });
  }
  function togglehasVoted() {
    hasVoted = !hasVoted;
  }
  function disableVoting() {
    votingDisabled = !disableVoting;
  }
  function handleSubmit(event) {
    event.preventDefault();
    if (selectedOption === null) {
      votingDisabled = true;
      return;
    }
    pollActions.vote(poll.id, selectedOption);
    pollActions.pushToEnd(poll.id);
    hasVoted = true;
    votingDisabled = true;
  }
</script>

<main
  use:handleClickOutside={closePoll}
  in:positionAwareScale={{ duration: 500, startScale: 0.5, clickPosition }}
  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-2 min-w-[50%] max-w-md max-h-[80vh] overflow-y-auto p-4 border rounded-lg shadow-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-colors duration-300"
>
  {#if !hasVoted}
    <form action="vote" onsubmit={handleSubmit} class="mb-4">
      <label for="options" class="font-bold text-xl text-gray-800 dark:text-gray-200"
        >{poll.question}</label
      >
      {#if selectedOption === null && votingDisabled}
        <p class="text-red-600 dark:text-red-400 text-sm mt-2 animate-pulse" role="alert">
          Please select an option before voting.
        </p>
      {/if}
      <div
        class="flex flex-col mt-2 w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2"
      >
        {#each poll.options as option, index}
          <div class="flex items-center py-1">
            {#if poll.type === 'multiple'}
              <input
                type="checkbox"
                name="options"
                id={`option-${index}`}
                value={option.id}
                bind:group={selectedOption}
                class="mr-2 h-4 w-4 text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400"
                aria-labelledby={`label-${index}`}
              />
            {:else}
              <input
                type="radio"
                name="options"
                id={`option-${index}`}
                value={option.id}
                bind:group={selectedOption}
                class="mr-2 h-4 w-4 text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400"
                aria-labelledby={`label-${index}`}
              />
            {/if}
            <label
              id={`label-${index}`}
              for={`option-${index}`}
              class="py-2 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer w-full transition-colors duration-200"
            >
              {option.text}
            </label>
          </div>
        {/each}
      </div>
      <button
        type="submit"
        class="mt-4 w-full bg-slate-600 hover:cursor-pointer dark:bg-slate-500 dark:hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-200"
      >
        Vote Now
      </button>
      <button
        onclick={(e) => {
          e.preventDefault();
          closePoll();
        }}
        class="mt-2 w-full text-gray-600 dark:bg-gray-500 dark:hover:bg-gray-600 dark:text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-200"
      >
        Close
      </button>
    </form>
  {:else}
    <SummaryResults {poll} {selectedOption} {closePoll} {togglehasVoted} {votingDisabled} />
  {/if}
</main>
