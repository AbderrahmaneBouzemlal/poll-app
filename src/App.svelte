<script>
  import { faPlus, faPoll, faVoteYea } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import ItemPoll from './lib/ItemPoll.svelte';
  import FormPoll from './lib/FormPoll.svelte';
  import { pollActions, polls } from './data/polls.svelte';
  import { onMount } from 'svelte';
  import { flip } from 'svelte/animate';
  import { crossfade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import ToggleButton from './lib/ToggleButton.svelte';

  let selectedPoll = $state(null);
  let clickPosition = $state({ x: 0, y: 0 });
  let addingPoll = $state(false);
  let currentTheme = $state('light');

  // @ts-ignore
  const { send, receive } = crossfade({
    duration: 400,
    easing: cubicOut,
    fallback(node) {
      return {
        duration: 400,
        easing: cubicOut,
        css: (t) => `opacity: ${t}`,
      };
    },
  });

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    if (
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      currentTheme = 'dark';
      document.documentElement.classList.add('dark');
    } else {
      currentTheme = 'light';
      document.documentElement.classList.remove('dark');
    }
    pollActions.orderByVotes();
  });

  $effect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  });

  function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  }

  function showPoll(poll, event) {
    clickPosition = { x: event.clientX, y: event.clientY };
    selectedPoll = poll;
  }

  function showAddPoll(event) {
    clickPosition = {
      x: event.clientX || window.innerWidth / 2,
      y: event.clientY || window.innerHeight / 2,
    };
    addingPoll = true;
  }

  function closePoll() {
    selectedPoll = null;
    addingPoll = false;
  }
</script>

<header class="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
  <nav class="h-16" aria-label="Main navigation">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex items-center gap-2">
          <a href="#main" class="text-2xl font-bold text-gray-800 dark:text-gray-200">Poll App</a>
          <FontAwesomeIcon class="text-gray-600 dark:text-gray-300 text-2xl" icon={faPoll} />
        </div>
        <div class="flex items-center space-x-4">
          <ToggleButton {currentTheme} {toggleTheme} />
        </div>
      </div>
    </div>
  </nav>
</header>
<main
  class="relative min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-8 transition-colors duration-300"
  id="main"
  aria-label="Main app"
>
  <h1 class="text-3xl font-extrabold text-gray-800 dark:text-gray-200 text-center mb-8">Polls</h1>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
    {#each $polls as poll (poll.id)}
      <div
        class="bg-white w-full dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col justify-between items-center
              shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 max-w-sm mx-auto"
        role="article"
        aria-labelledby={`poll-${poll.id}`}
        animate:flip={{ duration: 400, easing: cubicOut }}
        in:send={{ key: poll.id }}
        out:receive={{ key: poll.id }}
      >
        <h1
          id={`poll-${poll.id}`}
          class="font-bold text-xl text-gray-800 dark:text-gray-200 text-center mb-4"
        >
          {poll.question}
        </h1>
        <button
          class="bg-primary-600 hover:cursor-pointer text-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600
                dark:text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-200 w-full flex items-center justify-center gap-2"
          onclick={(e) => {
            e.stopPropagation();
            showPoll(poll, e);
          }}
          aria-label={`Vote on ${poll.question}`}
        >
          <FontAwesomeIcon icon={faVoteYea} class="dark:text-white text-primary-600 text-lg" />
          Vote
        </button>
        <p
          class="mt-3 text-sm text-gray-600 dark:text-gray-400 font-medium"
          aria-label={`Total votes: ${poll.totalVotes}`}
        >
          {poll.totalVotes}
          {poll.totalVotes === 1 ? 'vote' : 'votes'}
        </p>
      </div>
    {/each}
    <div
      class="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center
             w-full justify-center shadow-md hover:shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 max-w-sm mx-auto"
    >
      <button
        onclick={showAddPoll}
        class="group flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-primary-100 hover:bg-primary-200
              dark:bg-primary-200 dark:hover:bg-primary-300 text-primary-700 dark:text-white font-semibold transition-all duration-300"
        aria-label="Add a new poll"
      >
        <FontAwesomeIcon
          class="text-primary-600 dark:text-white text-2xl group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300"
          icon={faPlus}
        />
        <span>Add New Poll</span>
      </button>
    </div>
  </div>
  {#if selectedPoll}
    <ItemPoll {clickPosition} poll={selectedPoll} {closePoll} />
  {/if}
  {#if $polls.length === 0}
    <div
      class="text-center text-gray-500 dark:text-gray-400 mt-10"
      in:receive={{ key: 'no-polls' }}
      out:send={{ key: 'no-polls' }}
    >
      <p class="text-lg">No polls available. Please add a new poll.</p>
    </div>
  {/if}
  {#if addingPoll}
    <FormPoll {addingPoll} {clickPosition} {closePoll} />
  {/if}
</main>
