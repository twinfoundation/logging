// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, Converter, Guards, type IError, Is, RandomHelper } from "@twin.org/core";
import type { EntityCondition, SortDirection } from "@twin.org/entity";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import type { ILogEntry, ILoggingConnector, LogLevel } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { LogEntry } from "./entities/logEntry";
import type { LogEntryError } from "./entities/logEntryError";
import type { IEntityStorageLoggingConnectorConfig } from "./models/IEntityStorageLoggingConnectorConfig";

/**
 * Class for performing logging operations in entity storage.
 */
export class EntityStorageLoggingConnector implements ILoggingConnector {
	/**
	 * The namespace for the logging connector.
	 */
	public static readonly NAMESPACE: string = "entity-storage";

	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<EntityStorageLoggingConnector>();

	/**
	 * The log levels to capture, will default to all.
	 * @internal
	 */
	private readonly _levels: LogLevel[];

	/**
	 * The entity storage for the log entries.
	 * @internal
	 */
	private readonly _logEntryStorage: IEntityStorageConnector<LogEntry>;

	/**
	 * Create a new instance of EntityStorageLoggingConnector.
	 * @param options The options for the connector.
	 * @param options.logEntryStorageConnectorType The type of the entity storage connector to use, defaults to "log-entry".
	 * @param options.config The configuration for the logging connector.
	 */
	constructor(options?: {
		logEntryStorageConnectorType?: string;
		config?: IEntityStorageLoggingConnectorConfig;
	}) {
		this._levels = options?.config?.levels ?? ["debug", "info", "warn", "error", "trace"];
		this._logEntryStorage = EntityStorageConnectorFactory.get(
			options?.logEntryStorageConnectorType ?? "log-entry"
		);
	}

	/**
	 * Log an entry to the connector.
	 * @param logEntry The entry to log.
	 * @returns Nothing.
	 */
	public async log(logEntry: ILogEntry): Promise<void> {
		Guards.object<ILogEntry>(this.CLASS_NAME, nameof(logEntry), logEntry);

		if (this._levels.includes(logEntry.level)) {
			const id = Converter.bytesToHex(RandomHelper.generate(32));

			const entity: LogEntry = {
				id,
				level: logEntry.level,
				source: logEntry.source,
				ts: logEntry.ts ?? Date.now(),
				message: logEntry.message,
				error: Is.object<IError>(logEntry.error) ? BaseError.flatten(logEntry.error) : undefined,
				data: logEntry.data
			};

			await this._logEntryStorage.set(entity);
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
		const result = await this._logEntryStorage.query(
			conditions as EntityCondition<LogEntry>,
			sortProperties,
			properties,
			cursor,
			pageSize
		);

		const mappedEntities: Partial<ILogEntry>[] = [];

		for (const entity of result.entities) {
			mappedEntities.push({
				level: entity.level,
				source: entity.source,
				ts: entity.ts,
				message: entity.message,
				error: Is.arrayValue<LogEntryError>(entity.error)
					? BaseError.expand(entity.error)
					: undefined,
				data: entity.data
			});
		}

		return {
			entities: mappedEntities,
			cursor: result.cursor
		};
	}
}
