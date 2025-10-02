//@ts-nocheck
import { derived, writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';

const pollStore = writable([{
    id: uuidv4(),
    question: 'What is your favorite programming language?',
    type: 'single',
    options: [
      { id: 1, text: 'JavaScript', votes: 10 },
      { id: 2, text: 'Python', votes: 15 },
      { id: 3, text: 'Java', votes: 16 },
      { id: 4, text: 'C#', votes: 3 }
    ]
  },
  {
    id: uuidv4(),
    question: 'What is your preferred development environment?',
    type: 'single',
    options: [
      { id: 1, text: 'VS Code', votes: 20 },
      { id: 2, text: 'IntelliJ', votes: 8 },
      { id: 3, text: 'Sublime Text', votes: 4 },
      { id: 4, text: 'Vim', votes: 2 }
    ]
  },
  {
    id: uuidv4(),
    question: 'Which frontend framework do you use the most?',
    type: 'single',
    options: [
      { id: 1, text: 'React', votes: 2093 },
      { id: 2, text: 'Vue', votes: 100 },
      { id: 3, text: 'Angular', votes: 5100 },
      { id: 4, text: 'Svelte', votes: 347 }
    ]
  },
  {
    id: uuidv4(),
    question: 'What is your favorite database?',
    type: 'single',
    options: [
      { id: 1, text: 'MySQL', votes: 12 },
      { id: 2, text: 'PostgreSQL', votes: 19 },
      { id: 3, text: 'MongoDB', votes: 7 },
      { id: 4, text: 'SQLite', votes: 1 }
    ]
  }
]);

export const polls = derived(pollStore, ($polls) => {
  return $polls.map(poll => ({
    ...poll,
    totalVotes: poll.options.reduce((sum, option) => sum + option.votes, 0)
  }))
})

export const pollActions = {
  addPoll: (question, options, pollType) => {
    pollStore.update(polls => {
      const newId = uuidv4();
      const newPoll = {
        id: newId,
        question,
        type: pollType,
        options: options.map((text, index) => ({
          id: index + 1, 
          text,
          votes: 0
        }))
        };
      return [...polls, newPoll];
    }
  )},
  removePoll: (id) => {
    pollStore.update(polls => polls.filter(poll => poll.id !== id));
  },
  vote: (pollId, optionId) => {
    pollStore.update(polls => {
      return polls.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map(option => {
              if (optionId && Array.isArray(optionId)) {
                for (let opid of optionId) {
                  if (option.id ===  opid){ 
                    return { ...option, votes: option.votes + 1 };
                }}
              } else if (option.id ===  optionId) {
                return { ...option, votes: option.votes + 1 };
              }
              return option;
            })
          };
        }
        return poll;
      });
    });
  },
  unvote: (pollId, optionId) => {
    pollStore.update(polls => {
      return polls.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map(option => {
            if (optionId && Array.isArray(optionId)) {
              for (let opid of optionId) {
                if (option.id ===  opid){ 
                  return { ...option, votes: option.votes + 1 };
              }}
            } else if (option.id ===  optionId) {               
                return { ...option, votes: option.votes - 1 };
              }
              return option;
            })
          };
        }
        return poll;
      });
    });
  },
  getPollById: (pollId) => {
    return derived(polls, ($polls) => {
      return $polls.find(poll => poll.id === pollId) || null;
    });
  },
  orderByVotes: (pollId) => {
    pollStore.update(polls => {
      return [...polls].sort((a, b) => {
        const totalVotesA = a.options.reduce((sum, option) => sum + option.votes, 0);
        const totalVotesB = b.options.reduce((sum, option) => sum + option.votes, 0);
        return totalVotesB - totalVotesA;
      });
    });
  },
  pushToEnd: (pollId) => {
    pollStore.update(polls => {
      const index = polls.findIndex(poll => poll.id === pollId);
      if (index === -1) return polls;
      const [poll] = polls.splice(index, 1);
      return [...polls, poll];
    });
  },
  progressOptions: (pollId) => {
    return derived(polls, ($polls) => {
      const poll = $polls.find(p => p.id === pollId);
      if (!poll) return [];
      const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
      return poll.options.map(option => ({
        ...option,
        progress: totalVotes > 0 ? option.votes / totalVotes : 0
      }));
    });
  }
}