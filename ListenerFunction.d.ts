import Precisely from "./Precisely";

/** A typed listener function for the event `K` of event map `T` */
type ListenerFunction<T, K extends keyof T> = T[K] extends Precisely<T[K], void>
  ? (event: K) => any
  : T[K] extends any[]
  ? (event: K, ...args: T[K]) => any
  : (event: K, props: T[K]) => any;

export default ListenerFunction;
