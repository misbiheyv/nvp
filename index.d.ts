type CanUndef<T> = T | undefined;

type Nullable<T> = T | undefined | null;

type CanPromise<T> = T | Promise<T>;

interface Dictionary<T = unknown> {
	[key: PropertyKey]: T;
}

type AnyFunc = (...args: any[]) => any;
