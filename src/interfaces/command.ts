export interface Command<T, P = void> {
  execute(params: P): Promise<T>;
}
