/** Evaluates to `Then`, if `T1` is identical to `T2` or else to `Else` */
type Equal<T1, T2, Then, Else> = T1 extends T2 ? (T2 extends T1 ? Then : Else) : Else;
export default Equal;
