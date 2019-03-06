import Equal from "./Equal";
/** Ensures `T` and `U` are precisely equal */
type Precisely<T, U> = Equal<T, U, T, never>;
export default Precisely;
