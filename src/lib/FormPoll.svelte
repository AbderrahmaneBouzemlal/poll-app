<script>
  import { pollActions } from '../data/polls.svelte.js';
  import { fade } from 'svelte/transition';
  import { positionAwareScale } from './transition.js';
  import { handleClickOutside } from '../actions.svelte.js';

  let { addingPoll, closePoll, clickPosition } = $props();
  let countOptions = $state(2);
  let pollType = $state('multiple');
  let question = $state('');
  let options = $state(['', '']);
  let errorMessage = $state('');

  $effect(() => {
    if (options.length < countOptions) {
      options = [...options, ''];
    } else if (options.length > countOptions) {
      options = options.slice(0, countOptions);
    }
  });

  function handleCreating(event) {
    event.preventDefault();
    if (!question.trim()) {
      errorMessage = 'Please enter a poll question.';
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      errorMessage = 'Please fill in all option fields.';
      return;
    }
    if (countOptions < 2) {
      errorMessage = 'A poll must have at least two options.';
      return;
    }
    pollActions.addPoll(question, options, pollType);
    addingPoll = false;
    closePoll();
  }

  function addOption(event) {
    event.preventDefault();
    if (countOptions < 10) {
      countOptions += 1;
    } else {
      errorMessage = 'Maximum 10 options allowed.';
    }
  }

  function removeOption(event, index) {
    event.preventDefault();
    if (countOptions > 2) {
      countOptions -= 1;
      options = options.filter((_, i) => i !== index);
    } else {
      errorMessage = 'A poll must have at least two options.';
    }
  }
</script>

<div
  use:handleClickOutside={closePoll}
  in:positionAwareScale={{ duration: 500, startScale: 0.5, clickPosition }}
  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-2 w-full max-w-md max-h-[80vh] overflow-y-auto p-6 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300"
  role="dialog"
  aria-labelledby="add-poll-title"
>
  <h2 id="add-poll-title" class="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
    Add New Poll
  </h2>
  {#if errorMessage}
    <p
      class="text-red-600 dark:text-red-400 text-sm mb-4 animate-pulse"
      role="alert"
      in:fade={{ duration: 300 }}
    >
      {errorMessage}
    </p>
  {/if}
  <form onsubmit={handleCreating} class="flex flex-col gap-4">
    <input
      type="text"
      bind:value={question}
      placeholder="Poll Question"
      class="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
      aria-label="Poll question"
    />
    <div class="flex flex-wrap gap-4 mb-4">
      <label class="font-semibold text-gray-700 dark:text-gray-300" for="type">Poll Type:</label>
      <div class="flex items-center gap-2">
        <input
          type="radio"
          id="multiple"
          name="type"
          value="multiple"
          bind:group={pollType}
          class="h-4 w-4 text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400"
        />
        <label for="multiple" class="text-gray-700 dark:text-gray-300">Multiple Choice</label>
      </div>
      <div class="flex items-center gap-2">
        <input
          type="radio"
          id="single"
          name="type"
          value="single"
          bind:group={pollType}
          class="h-4 w-4 text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400"
        />
        <label for="single" class="text-gray-700 dark:text-gray-300">Single Choice</label>
      </div>
    </div>
    {#each Array(countOptions) as _, index}
      <div class="flex items-center gap-2" in:fade={{ duration: 200, delay: index * 100 }}>
        <input
          type="text"
          placeholder={`Option ${index + 1}`}
          bind:value={options[index]}
          class="border border-gray-300 dark:border-gray-600 p-2 rounded-lg w-full focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
          aria-label={`Option ${index + 1}`}
        />
        <button
          onclick={(e) => removeOption(e, index)}
          class="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white py-1 px-2 rounded-lg transition-colors duration-200"
          aria-label={`Remove option ${index + 1}`}
          disabled={countOptions <= 2}
        >
          Remove
        </button>
      </div>
    {/each}
    <button
      onclick={addOption}
      class="bg-slate-100 border-2 border-dashed hover:cursor-pointer border-slate-600 hover:bg-slate-200 dark:bg-slate-200 dark:hover:bg-slate-300 text-slate-700 dark:text-slate-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
      aria-label="Add another option"
    >
      Add Another Option
    </button>
    <div class="flex gap-2 mt-4">
      <button
        onclick={(e) => {
          e.preventDefault();
          addingPoll = false;
          closePoll();
        }}
        class="w-full bg-red-600 hover:bg-red-700 hover:cursor-pointer dark:bg-red-500 dark:hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        aria-label="Cancel poll creation"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="w-full bg-gray-700 hover:bg-primary-700 hover:cursor-pointer hover:ring-2 hover:dark:ring-white hover:ring-black dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        aria-label="Create poll"
      >
        Create Poll
      </button>
    </div>
  </form>
</div>
