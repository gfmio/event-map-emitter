# event-map-emitter

<p align="center">
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/gfmio/event-map-emitter.svg" alt="Github license" title="Github license" />
  </a>
  <!-- NPM -->
  <a href="https://www.npmjs.com/package/event-map-emitter">
    <img src="https://img.shields.io/npm/v/event-map-emitter.svg" alt="" title="" />
  </a>
  <a href="https://www.npmjs.com/package/event-map-emitter">
    <img src="https://img.shields.io/npm/types/event-map-emitter.svg" alt="" title="" />
  </a>
  <!-- Code Climate -->
  <a href="https://codeclimate.com/github/gfmio/event-map-emitter/issues">
    <img src="https://img.shields.io/codeclimate/issues/gfmio/event-map-emitter.svg" alt="Code Climate issues" title="Code Climate issues" />
  </a>
  <a href="https://codeclimate.com/github/gfmio/event-map-emitter/maintainability">
    <img src="https://img.shields.io/codeclimate/maintainability/gfmio/event-map-emitter.svg" alt="Code Climate maintainability" title="Code Climate maintainability" />
  </a>
  <a href="https://codeclimate.com/github/gfmio/event-map-emitter/maintainability">
    <img src="https://img.shields.io/codeclimate/maintainability-percentage/gfmio/event-map-emitter.svg" alt="Code Climate maintainability (percentage)" title="Code Climate maintainability (percentage)" />
  </a>
  <a href="https://codeclimate.com/github/gfmio/event-map-emitter">
    <img src="https://img.shields.io/codeclimate/tech-debt/gfmio/event-map-emitter.svg" alt="Code Climate technical debt" title="Code Climate technical debt" />
  </a>
</p>

This package provides an event emitter interface for building strongly typed event emitters based on event maps.

It has zero dependencies and the types are only used at compile time, so they don't add anything to your application bundle.

## Why

Most event emitter libraries allow arbitrary events to be subscribed to and arguments to be sent.

An event map is an object type containing the names of the allowed events as its keys and the arguments of each emitted event on each key.

Since there are many fast event emitter libraries out there already, this project only provides an interface for casting existing implementations to ensure they are used in a type-safe manner.

## Install

```sh
# If you're using yarn
yarn add -D event-map-emitter

# If you're using NPM
npm install --save-dev event-map-emitter
```

## Usage

`EventMapEmitter` can be used with any compatible library, such as `eventemitter3`.

```ts
import EventMapEmitter from "event-map-emitter";
import EventEmitter3 from "eventemitter3";

/** These are the events we want to emit */
interface MyEventMap {
  singleValueEvent: number;
  voidEvent: void;
  multiArgumentEvent: [number, string, boolean];
  arrayEvent: [number[]];
}

// `eventEmitter` is now an EventMapEmitter<MyEventMap> using eventemitter3 internally to emit events
const eventEmitter = new EventEmitter3() as EventMapEmitter<MyEventMap>;

// This will work
eventEmitter.on(
  "singleValueEvent",
  (event: "singleValueEvent", value: number) => {
    /* Do something with value */
  },
);
// This won't, because value needs to be a number
eventEmitter.on(
  "singleValueEvent",
  (event: "singleValueEvent", value: string) => {
    /* ... */
  },
);
// This will work
eventEmitter.emit("singleValueEvent", 2);
// This won't, because value needs to be a number
eventEmitter.emit("singleValueEvent", "abc");

// For void events, no value argument needs to be supplied
eventEmitter.on("voidEvent", (event: "voidEvent") => {
  /* ... */
});
// This will work
eventEmitter.emit("voidEvent");
// This won't, because we do not expect additional arguments
eventEmitter.emit("voidEvent", "abc");

// To emit events with several arguments, supply an array / tuple type with the types of the arguments

// This will work
eventEmitter.on(
  "multiArgumentEvent",
  (event: "multiArgumentEvent", a: number, b: string, c: boolean) => {
    /* ... */
  },
);
// This won't
eventEmitter.on(
  "multiArgumentEvent",
  (event: "multiArgumentEvent", a: number, b: string) => {
    /* ... */
  },
);
// This will work
eventEmitter.emit("multiArgumentEvent", 1, "abc", true);
// This won't
eventEmitter.emit("multiArgumentEvent", 1, "abc");

// To accept a single array value as an event argument, wrap the array inside a tuple

eventEmitter.on("arrayEvent", (event: "arrayEvent", numbers: number[]) => {
  /* ... */
});
eventEmitter.emit("arrayEvent", [1, 2, 3]);
```

### All supported methods

```ts
interface EventMapEmitter<T extends object> {
  /** Return an array listing the events for which the emitter has registered listeners. */
  eventNames(): Array<keyof T>;
  /** Return the listeners registered for a given event. */
  listeners<K extends keyof T & string>(
    event: K,
  ): Array<ListenerFunction<T, K>>;
  /** Return the number of listeners listening to a given event. */
  listenerCount<K extends keyof T & string>(event: K): number;
  /** Calls each of the listeners registered for a given event. */
  emit<K extends keyof T & string>(event: Equal<T[K], void, K, never>): boolean;
  emit<K extends keyof T & string>(
    event: K,
    props: T[K] extends any[] ? never : T[K],
  ): boolean;
  emit<K extends keyof T & string>(
    event: K,
    ...args: T[K] extends any[] ? T[K] : [T[K]]
  ): boolean;
  /** Add a listener for a given event. */
  on<K extends keyof T & string>(
    event: K,
    fn: ListenerFunction<T, K>,
    context?: any,
  ): this;
  /** Add a listener for a given event. */
  addListener<K extends keyof T & string>(
    event: K,
    fn: ListenerFunction<T, K>,
    context?: any,
  ): this;
  /** Add a one-time listener for a given event. */
  once<K extends keyof T & string>(
    event: K,
    fn: ListenerFunction<T, K>,
    context?: any,
  ): this;
  /** Remove the listeners of a given event. */
  removeListener<K extends keyof T & string>(
    event: K,
    fn?: ListenerFunction<T, K>,
    context?: any,
    once?: boolean,
  ): this;
  /** Remove the listeners of a given event. */
  off<K extends keyof T & string>(
    event: K,
    fn?: ListenerFunction<T, K>,
    context?: any,
    once?: boolean,
  ): this;
  /** Remove all listeners, or those of the specified event. */
  removeAllListeners<K extends keyof T & string>(event: K): this;
}

type ListenerFunction<T, K extends keyof T> = T[K] extends Precisely<T[K], void>
  ? (event: K) => any
  : T[K] extends any[]
  ? (event: K, ...args: T[K]) => any
  : (event: K, props: T[K]) => any;

/** Evaluates to `Then`, if `T1` is identical to `T2` or else to `Else` */
type Equal<T1, T2, Then, Else> = T1 extends T2
  ? (T2 extends T1 ? Then : Else)
  : Else;

/** Ensures `T` and `U` are precisely equal */
type Precisely<T, U> = Equal<T, U, T, never>;
```
