import { create } from 'zustand';

// Part 1: Reference
// Define the store type interface
// interface CounterState {
//     count: number;
//     increment: () => void;
//     decrement: () => void;
//     reset: () => void;
// }

// // Create typed store
// export const useCounterStore = create<CounterState>(
//     (set) => ({
//         count: 0,
//         increment: () => set((state) => ({ count: state.count + 1 })),
//         decrement: () => set((state) => ({ count: state.count - 1 })),
//         reset: () => set({ count: 0 }),
// }));


interface CounterState {
    count: number,
    increament: () => void,
    decrement: () => void,
    update: (value: number) => void
}

export const useCounterStore = create<CounterState>((set) => {
    return ({
        count: 0,
        increament: () => {
            set((state) => ({ count: (state.count + 1) }))
        },
        decrement: () => {
            set((state) => ({ count: (state.count - 1) }))
        },
        update: (value) => {
            set(state => ({ count: (value) }))
        },
    })
})