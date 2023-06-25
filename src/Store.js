import { create } from 'zustand'

const useStore = create((set, get) => ({
  environments: [], // the shared state

  // function to initialize the array
  setEnvironments: (initialItems) => set(() => ({ environments: initialItems })),

  // function to add an item
  addEnvironment: async (item) => set(state => ({ environments: [...state.environments, item] })),

  // function to update an item
  updEnvironment: async (id, newItem) => set(state => ({ environments: state.environments.map(item => item.name === id ? newItem : item) })),

  // function to remove an item
  remEnvironment: async (id) => set(state => ({ environments: state.environments.filter(i => i.name !== id) })),

  // function to get all items
  getEnvironments: () => set(state => state.environments)
}));

export default useStore;
