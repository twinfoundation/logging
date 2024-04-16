// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Is } from "@gtsc/core";
import type { ILogEntry, ILoggingProvider, LogLevel } from "@gtsc/logging-provider-models";
import type { IRequestContext } from "@gtsc/services";
import type { IConsoleLoggingProviderConfig } from "./models/IConsoleLoggingProviderConfig";

/**
 * Class for performing logging operations in the console.
 */
export class ConsoleLoggingProvider implements ILoggingProvider {
	/**
	 * Colors for highlighting.
	 * @internal
	 */
	private static readonly _COLORS: { [id: string]: number } = {
		blue: 34,
		cyan: 36,
		green: 32,
		magenta: 35,
		red: 31
	};

	/**
	 * The log levels to display, will default to all.
	 */
	private readonly _levels: LogLevel[];

	/**
	 * The last group identity.
	 */
	private _lastGroup?: string;

	/**
	 * Create a new instance of ConsoleLoggingProvider.
	 * @param config The configuration for the logging provider.
	 */
	constructor(config?: IConsoleLoggingProviderConfig) {
		this._levels = config?.levels ?? ["debug", "info", "warn", "error", "trace"];
	}

	/**
	 * Log an entry to the provider.
	 * @param requestContext The context for the request.
	 * @param logEntry The entry to log.
	 */
	public log(requestContext: IRequestContext, logEntry: ILogEntry): void {
		if (this._levels.includes(logEntry.level)) {
			this.handleGroup(logEntry.source);

			logEntry.ts ??= Date.now();

			const params: unknown[] = [
				this.colorize(logEntry.level.toUpperCase(), logEntry.level === "error" ? "red" : "green"),
				this.colorize(`[${new Date(logEntry.ts).toISOString()}]`, "magenta"),
				this.colorize(logEntry.message, "cyan")
			];

			if (logEntry.data) {
				if (Is.object(logEntry.data) || Is.array(logEntry.data)) {
					params.push(JSON.stringify(logEntry.data));
				} else {
					params.push(logEntry.data);
				}
			}

			if (logEntry.error) {
				params.push(logEntry.error);
			}

			globalThis.console[logEntry.level](...params);
		}
	}

	/**
	 * Convert a string to a color.
	 * @param str The string to convert.
	 * @returns The color.
	 */
	private stringToColor(str: string): string {
		// eslint-disable-next-line no-bitwise
		const stringUniqueHash = [...str].reduce(
			// eslint-disable-next-line no-bitwise
			(acc, char) => char.charCodeAt(0) + ((acc << 5) - acc),
			0
		);
		return `hsl(${stringUniqueHash % 360}, 95%, 35%)`;
	}

	/**
	 * Add color to a string.
	 * @param string The string to colorize.
	 * @param color The color to use.
	 * @returns The colorized string.
	 * @internal
	 */
	private colorize(message: string, color: "blue" | "cyan" | "green" | "magenta" | "red"): string {
		// eslint-disable-next-line unicorn/escape-case,unicorn/no-hex-escape
		return `\x1b[${ConsoleLoggingProvider._COLORS[color]}m${message}\x1b[39m`;
	}

	/**
	 * Handle a group.
	 * @param group The group.
	 */
	private handleGroup(group: string): void {
		if (this._lastGroup !== group) {
			this._lastGroup = group;
			if (this._lastGroup) {
				console.groupEnd();
			}
			if (group.length > 0) {
				console.group(
					`%c${group}`,
					`color: #ffffff; background: ${this.stringToColor(
						group
					)}; font-size: 10px; font-weight: bold; padding: 2px 4px; border-radius: 5px`
				);
			}
		}
	}
}
