<script>
  import { faMoon, faS, faSun } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  let { currentTheme, toggleTheme } = $props();
</script>

<button
  onclick={toggleTheme}
  class="p-2 rounded-full bg-primary-100 dark:bg-primary-200 text-primary-700 dark:text-primary-800
        hover:bg-primary-200 dark:hover:bg-primary-300 hover:scale-105 focus:ring-2 focus:ring-primary-500
        dark:focus:ring-white transition-all duration-200"
  aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
>
  <div class={currentTheme === 'dark' ? 'hidden' : 'block'}>
    <FontAwesomeIcon
      icon={faMoon}
      class="w-5 h-5 transition-transform duration-300 group-hover:rotate-180"
    />
  </div>
  <div class={currentTheme === 'light' ? 'hidden' : 'block'}>
    <FontAwesomeIcon
      icon={faSun}
      class=" w-5 h-5 text-white transition-transform duration-300 group-hover:rotate-180"
    />
  </div>
</button>
