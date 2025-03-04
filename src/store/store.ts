import { configureStore } from '@reduxjs/toolkit';
import diagramReducer from './diagramSlice';
import { RootState } from './types';

// Load state from localStorage
const loadState = (): RootState | undefined => {
  try {
    const serializedState = localStorage.getItem('stack-diagram-state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('stack-diagram-state', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

const store = configureStore({
  reducer: {
    diagram: diagramReducer
  },
  preloadedState: loadState()
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;
export default store; 