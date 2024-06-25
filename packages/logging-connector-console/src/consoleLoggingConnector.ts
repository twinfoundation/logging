// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Guards, I18n, Is, NotImplementedError } from "@gtsc/core";
import type { EntityCondition, SortDirection } from "@gtsc/entity";
import type { ILogEntry, ILoggingConnector, LogLevel } from "@gtsc/logging-models";
import { nameof } from "@gtsc/nameof";
import type { IRequestContext } from "@gtsc/services";
import type { IConsoleLoggingConnectorConfig } from "./models/IConsoleLoggingConnectorConfig";

/**
 * Class for performing logging operations in the console.
 */
export class ConsoleLoggingConnector implements ILoggingConnector {
	/**
	 * Runtime name for the class.
	 * @internal
	 */
	private static readonly _CLASS_NAME: string = nameof<ConsoleLoggingConnector>();

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
	 * Translate messages using the current locale.
	 */
	private readonly _translateMessages: boolean;

	/**
	 * The last group identity.
	 */
	private _lastGroup?: string;

	/**
	 * Create a new instance of ConsoleLoggingConnector.
	 * @param config The configuration for the logging connector.
	 */
	constructor(config?: IConsoleLoggingConnectorConfig) {
		this._levels = config?.levels ?? ["debug", "info", "warn", "error", "trace"];
		this._translateMessages = config?.translateMessages ?? false;
	}

	/**
	 * Log an entry to the connector.
	 * @param requestContext The context for the request.
	 * @param logEntry The entry to log.
	 * @returns Nothing.
	 */
	public async log(requestContext: IRequestContext, logEntry: ILogEntry): Promise<void> {
		Guards.object<IRequestContext>(
			ConsoleLoggingConnector._CLASS_NAME,
			nameof(requestContext),
			requestContext
		);
		Guards.object<ILogEntry>(ConsoleLoggingConnector._CLASS_NAME, nameof(logEntry), logEntry);

		if (this._levels.includes(logEntry.level)) {
			this.handleGroup(logEntry.source);

			logEntry.ts ??= Date.now();

			const params: unknown[] = [
				this.colorize(logEntry.level.toUpperCase(), logEntry.level === "error" ? "red" : "green"),
				this.colorize(`[${new Date(logEntry.ts).toISOString()}]`, "magenta")
			];

			let message = logEntry.message;
			let data = logEntry.data;
			if (this._translateMessages) {
				message = I18n.formatMessage(
					logEntry.message,
					data as {
						[key: string]: unknown;
					}
				);
				data = undefined;
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
	 * @param requestContext The context for the request.
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
		requestContext: IRequestContext,
		conditions?: EntityCondition<ILogEntry>,
		sortProperties?: {
			property: keyof ILogEntry;
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
		/**
		 * Number of entities to return.
		 */
		pageSize?: number;
		/**
		 * Total entities length.
		 */
		totalEntities: number;
	}> {
		throw new NotImplementedError(ConsoleLoggingConnector._CLASS_NAME, "query");
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
		return `\x1b[${ConsoleLoggingConnector._COLORS[color]}m${message}\x1b[39m`;
	}

	/**
	 * Handle a group.
	 * @param group The group.
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
