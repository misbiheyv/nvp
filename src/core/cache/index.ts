export class TtlCache {
  protected store = new Map<string, {timeoutId: NodeJS.Timeout; value: any}>();

  set(key: string, value: any, ttl: number): void {
    const prevValue = this.store.get(key);

    if (prevValue) {
      clearTimeout(prevValue.timeoutId);
    }

    this.store.set(key, {
      value,
      timeoutId: setTimeout(() => this.store.delete(key), ttl),
    });
  }

  get<T = unknown>(key: string): CanUndef<T> {
    return this.store.get(key)?.value;
  }
}
