/* eslint-disable no-unused-vars */
export default abstract class BaseBot {
	abstract command(name: string, cb: (...args: any[]) => any, description?: string);

	abstract run(): void;
}
