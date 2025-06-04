import { configureStore } from "@reduxjs/toolkit";
import audioReducer from "./audioSlice";
import podcastReducer from "./podcastSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    audio: audioReducer,
    podcast: podcastReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
