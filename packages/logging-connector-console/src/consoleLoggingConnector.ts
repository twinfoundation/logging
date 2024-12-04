// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Guards, Is, NotImplementedError } from "@twin.org/core";
import type { EntityCondition, SortDirection } from "@twin.org/entity";
import {
	LogEntryHelper,
	type ILogEntry,
	type ILoggingConnector,
	type LogLevel
} from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { IConsoleLoggingConnectorConfig } from "./models/IConsoleLoggingConnectorConfig";

/**
 * Class for performing logging operations in the console.
 */
export class ConsoleLoggingConnector implements ILoggingConnector {
	/**
	 * The namespace for the logging connector.
	 */
	public static readonly NAMESPACE: string = "console";

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
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<ConsoleLoggingConnector>();

	/**
	 * The log levels to display, will default to all.
	 * @internal
	 */
	private readonly _levels: LogLevel[];

	/**
	 * Translate messages using the current locale.
	 * @internal
	 */
	private readonly _translateMessages: boolean;

	/**
	 * Hide the groups.
	 * @internal
	 */
	private readonly _hideGroups: boolean;

	/**
	 * The last group identity.
	 * @internal
	 */
	private _lastGroup?: string;

	/**
	 * Create a new instance of ConsoleLoggingConnector.
	 * @param options The options for the logging connector.
	 * @param options.config The configuration for the logging connector.
	 */
	constructor(options?: { config?: IConsoleLoggingConnectorConfig }) {
		this._levels = options?.config?.levels ?? ["debug", "info", "warn", "error", "trace"];
		this._translateMessages = options?.config?.translateMessages ?? false;
		this._hideGroups = options?.config?.hideGroups ?? false;
	}

	/**
	 * Log an entry to the connector.
	 * @param logEntry The entry to log.
	 * @returns Nothing.
	 */
	public async log(logEntry: ILogEntry): Promise<void> {
		Guards.object<ILogEntry>(this.CLASS_NAME, nameof(logEntry), logEntry);

		if (this._levels.includes(logEntry.level)) {
			logEntry.ts ??= Date.now();

			const params: unknown[] = [
				this.colorize(logEntry.level.toUpperCase(), logEntry.level === "error" ? "red" : "green"),
				this.colorize(`[${new Date(logEntry.ts).toISOString()}]`, "magenta")
			];

			if (!this._hideGroups) {
				this.handleGroup(logEntry.source);
			} else {
				params.push(this.colorize(logEntry.source, "blue"));
			}

			let message = logEntry.message;
			let data = logEntry.data;

			if (this._translateMessages) {
				const translatedMessage = LogEntryHelper.translate(logEntry);
				if (Is.stringValue(translatedMessage)) {
					message = translatedMessage;
					data = undefined;
				}
			}

			params.push(this.colorize(message, "cyan"));

			if (!Is.empty(data)) {
				if (Is.object(data) || Is.array(data)) {
					params.push(JSON.stringify(data));
				} else {
					params.push(data);
				}
			}

			if (logEntry.error) {
				params.push(logEntry.error);
			}

			globalThis.console[logEntry.level](...params);
		}
	}

	/**
	 * Query the log entries.
	 * @param conditions The conditions to match for the entities.
	 * @param sortProperties The optional sort order.
	 * @param properties The optional keys to return, defaults to all.
	 * @param cursor The cursor to request the next page of entities.
	 * @param pageSize The maximum number of entities in a page.
	 * @returns All the entities for the storage matching the conditions,
	 * and a cursor which can be used to request more entities.
	 * @throws NotImplementedError if the implementation does not support retrieval.
	 */
	public async query(
		conditions?: EntityCondition<ILogEntry>,
		sortProperties?: {
			property: keyof Omit<ILogEntry, "error" | "data">;
			sortDirection: SortDirection;
		}[],
		properties?: (keyof ILogEntry)[],
		cursor?: string,
		pageSize?: number
	): Promise<{
		/**
		 * The entities, which can be partial if a limited keys list was provided.
		 */
		entities: Partial<ILogEntry>[];
		/**
		 * An optional cursor, when defined can be used to call find to get more entities.
		 */
		cursor?: string;
	}> {
		throw new NotImplementedError(this.CLASS_NAME, "query");
	}

	/**
	 * Convert a string to a color.
	 * @param str The string to convert.
	 * @returns The color.
	 * @internal
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
		return `\x1b[${ConsoleLoggingConnector._COLORS[color]}m${message}\x1b[39m`;
	}

	/**
	 * Handle a group.
	 * @param group The group.
	 * @internal
	 */
	private handleGroup(group: string): void {
		if (this._lastGroup !== group) {
			this._lastGroup = group;
			if (this._lastGroup) {
				globalThis.console.groupEnd();
			}
			if (group.length > 0) {
				globalThis.console.group(
					`%c${group}`,
					`color: #ffffff; background: ${this.stringToColor(
						group
					)}; font-size: 10px; font-weight: bold; padding: 2px 4px; border-radius: 5px`
				);
			}
		}
	}
}
