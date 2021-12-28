export type Maybe<T> = T | undefined;

export type SaralEvent<T extends object> = CustomEvent<T & { cancel: () => void }>;
