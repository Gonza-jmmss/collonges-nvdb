export interface Query<T, P = void> {
  execute(params: P): Promise<T>;
}
