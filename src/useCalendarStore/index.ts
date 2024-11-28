import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface IEvent {
  title: string;
  start: Date | null;
  end?: Date | null;
  id: string | null;
}
interface IStoreState {
  events: IEvent[];
}
interface IStore extends IStoreState {
  createEvent: (newEvent: IEvent) => Promise<IEvent[]>;
  editEvent: (newEvent: IEvent) => Promise<IEvent[]>;
  getEvents: () => Promise<IEvent[]>;
}

export const useCalendarStore = create<IStore>()(
  persist(
    (set, get) => ({
      events: [],
      getEvents: () =>
        new Promise((resolve) => {
          resolve(get().events);
        }),
      createEvent: (newEvent) =>
        new Promise((resolve) => {
          set((state) => {
            const updatedEvents = [...state.events, newEvent];
            resolve(updatedEvents);
            return { events: updatedEvents };
          });
        }),
      editEvent: (newEvent) =>
        new Promise((resolve) => {
          set((state) => {
            const updatedEvents = state.events?.map((x) =>
              newEvent.id === x.id ? { ...newEvent, title: newEvent.title } : x
            );
            resolve(updatedEvents);
            return { events: updatedEvents };
          });
        }),
    }),
    {
      name: "calendar",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
