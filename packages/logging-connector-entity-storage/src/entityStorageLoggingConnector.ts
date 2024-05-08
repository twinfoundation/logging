// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, Guards, type IError, Is, Urn } from "@gtsc/core";
import type { EntityCondition, SortDirection } from "@gtsc/entity";
import type { IEntityStorageConnector } from "@gtsc/entity-storage-models";
import type { ILogEntry, ILoggingConnector, LogLevel } from "@gtsc/logging-models";
import { nameof } from "@gtsc/nameof";
import type { IRequestContext } from "@gtsc/services";
import type { IEntityLogEntry } from "./models/IEntityLogEntry";
import type { IEntityStorageLoggingConnectorConfig } from "./models/IEntityStorageLoggingConnectorConfig";

/**
 * Class for performing logging operations in entity storage.
 */
export class EntityStorageLoggingConnector implements ILoggingConnector {
	/**
	 * Runtime name for the class.
	 * @internal
	 */
	private static readonly _CLASS_NAME: string = nameof<EntityStorageLoggingConnector>();

	/**
	 * The namespace for the entities.
	 * @internal
	 */
	private static readonly _NAMESPACE: string = "entity-logging";

	/**
	 * The log levels to capture, will default to all.
	 */
	private readonly _levels: LogLevel[];

	/**
	 * The entity storage for the log entries.
	 * @internal
	 */
	private readonly _logEntryStorage: IEntityStorageConnector<IEntityLogEntry>;

	/**
	 * Create a new instance of MemoryLoggingConnector.
	 * @param dependencies The dependencies for the logging connector.
	 * @param dependencies.logEntryStorage The entity storage connector dependency.
	 * @param config The configuration for the logging connector.
	 */
	constructor(
		dependencies: {
			logEntryStorage: IEntityStorageConnector<IEntityLogEntry>;
		},
		config?: IEntityStorageLoggingConnectorConfig
	) {
		Guards.object(EntityStorageLoggingConnector._CLASS_NAME, nameof(dependencies), dependencies);
		Guards.object(
			EntityStorageLoggingConnector._CLASS_NAME,
			nameof(dependencies.logEntryStorage),
			dependencies.logEntryStorage
		);
		this._levels = config?.levels ?? ["debug", "info", "warn", "error", "trace"];
		this._logEntryStorage = dependencies.logEntryStorage;
	}

	/**
	 * Log an entry to the connector.
	 * @param requestContext The context for the request.
	 * @param logEntry The entry to log.
	 * @returns An identifier if one was allocated during the logging process.
	 */
	public async log(
		requestContext: IRequestContext,
		logEntry: ILogEntry
	): Promise<string | undefined> {
		Guards.object(
			EntityStorageLoggingConnector._CLASS_NAME,
			nameof(requestContext),
			requestContext
		);
		Guards.stringValue(
			EntityStorageLoggingConnector._CLASS_NAME,
			nameof(requestContext.tenantId),
			requestContext.tenantId
		);
		Guards.object(EntityStorageLoggingConnector._CLASS_NAME, nameof(logEntry), logEntry);

		let id: string | undefined;
		if (this._levels.includes(logEntry.level)) {
			const idUrn = Urn.generateRandom(EntityStorageLoggingConnector._NAMESPACE);

			let errorsJson;
			if (Is.notEmpty(logEntry.error)) {
				const flattened = BaseError.flatten(logEntry.error);
				errorsJson = JSON.stringify(flattened);
			}

			let dataJson;
			if (Is.notEmpty(logEntry.data)) {
				dataJson = JSON.stringify(logEntry.data);
			}

			const entity: IEntityLogEntry = {
				id: idUrn.namespaceSpecific(),
				level: logEntry.level,
				source: logEntry.source,
				ts: logEntry.ts ?? Date.now(),
				message: logEntry.message,
				error: errorsJson,
				data: dataJson
			};

			id = entity.id;

			await this._logEntryStorage.set(requestContext, entity);
		}
		return id;
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
		Guards.object(
			EntityStorageLoggingConnector._CLASS_NAME,
			nameof(requestContext),
			requestContext
		);
		Guards.stringValue(
			EntityStorageLoggingConnector._CLASS_NAME,
			nameof(requestContext.tenantId),
			requestContext.tenantId
		);

		const result = await this._logEntryStorage.query(
			requestContext,
			conditions as EntityCondition<IEntityLogEntry>,
			sortProperties,
			properties,
			cursor,
			pageSize
		);

		const mappedEntities: Partial<ILogEntry>[] = [];

		for (const entity of result.entities) {
			const errors: IError[] = Is.stringValue(entity.error) ? JSON.parse(entity.error) : undefined;

			mappedEntities.push({
				level: entity.level,
				source: entity.source,
				ts: entity.ts,
				message: entity.message,
				error: BaseError.expand(errors),
				data: Is.stringValue(entity.data) ? JSON.parse(entity.data) : undefined
			});
		}

		return {
			entities: mappedEntities,
			cursor: result.cursor,
			pageSize: result.pageSize,
			totalEntities: result.totalEntities
		};
	}
}
