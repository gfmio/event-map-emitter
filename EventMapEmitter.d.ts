import ListenerFunction from "./ListenerFunction";
import Equal from "./Equal";

export default interface EventMapEmitter<T extends object> {
  /** Return an array listing the events for which the emitter has registered listeners. */
  eventNames(): Array<keyof T>;
  /** Return the listeners registered for a given event. */
  listeners<K extends keyof T & string>(event: K): Array<ListenerFunction<T, K>>;
  /** Return the number of listeners listening to a given event. */
  listenerCount<K extends keyof T & string>(event: K): number;
  /** Calls each of the listeners registered for a given event. */
  emit<K extends keyof T & string>(event: Equal<T[K], void, K, never>): boolean;
  emit<K extends keyof T & string>(event: K, props: T[K] extends any[] ? never : T[K]): boolean;
  emit<K extends keyof T & string>(event: K, ...args: T[K] extends any[] ? T[K] : [T[K]]): boolean;
  /** Add a listener for a given event. */
  on<K extends keyof T & string>(event: K, fn: ListenerFunction<T, K>, context?: any): this;
  /** Add a listener for a given event. */
  addListener<K extends keyof T & string>(event: K, fn: ListenerFunction<T, K>, context?: any): this;
  /** Add a one-time listener for a given event. */
  once<K extends keyof T & string>(event: K, fn: ListenerFunction<T, K>, context?: any): this;
  /** Remove the listeners of a given event. */
  removeListener<K extends keyof T & string>(
    event: K,
    fn?: ListenerFunction<T, K>,
    context?: any,
    once?: boolean,
  ): this;
  /** Remove the listeners of a given event. */
  off<K extends keyof T & string>(event: K, fn?: ListenerFunction<T, K>, context?: any, once?: boolean): this;
  /** Remove all listeners, or those of the specified event. */
  removeAllListeners<K extends keyof T & string>(event: K): this;
}
