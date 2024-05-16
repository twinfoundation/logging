// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseError, Guards, NotImplementedError } from "@gtsc/core";
import type { EntityCondition, SortDirection } from "@gtsc/entity";
import { nameof } from "@gtsc/nameof";
import type { IRequestContext } from "@gtsc/services";
import type { ILogEntry } from "../models/ILogEntry";
import type { ILoggingConnector } from "../models/ILoggingConnector";
import type { ILoggingLevelsConfig } from "../models/ILoggingLevelsConfig";
import type { LogLevel } from "../models/logLevel";

/**
 * Class for performing logging operations on multiple connectors.
 */
export class MultiLoggingConnector implements ILoggingConnector {
	/**
	 * Runtime name for the class.
	 * @internal
	 */
	private static readonly _CLASS_NAME: string = nameof<MultiLoggingConnector>();

	/**
	 * The connectors to send the log entries to.
	 */
	private readonly _loggingConnectors: ILoggingConnector[];

	/**
	 * The log levels to display, will default to all.
	 */
	private readonly _levels: LogLevel[];

	/**
	 * Create a new instance of MultiLoggingConnector.
	 * @param dependencies The dependencies for the logging connector.
	 * @param dependencies.loggingConnectors The logging connectors to aggregate.
	 * @param config The configuration for the logging connector.
	 */
	constructor(
		dependencies: {
			loggingConnectors: ILoggingConnector[];
		},
		config?: ILoggingLevelsConfig | undefined
	) {
		Guards.object(MultiLoggingConnector._CLASS_NAME, nameof(dependencies), dependencies);
		Guards.array(
			MultiLoggingConnector._CLASS_NAME,
			nameof(dependencies.loggingConnectors),
			dependencies.loggingConnectors
		);
		this._levels = config?.levels ?? ["debug", "info", "warn", "error", "trace"];
		this._loggingConnectors = dependencies.loggingConnectors;
	}

	/**
	 * Log an entry to the connector.
	 * @param requestContext The context for the request.
	 * @param logEntry The entry to log.
	 * @returns Nothing.
	 */
	public async log(requestContext: IRequestContext, logEntry: ILogEntry): Promise<void> {
		Guards.object(MultiLoggingConnector._CLASS_NAME, nameof(requestContext), requestContext);
		Guards.stringValue(
			MultiLoggingConnector._CLASS_NAME,
			nameof(requestContext.tenantId),
			requestContext.tenantId
		);
		Guards.object(MultiLoggingConnector._CLASS_NAME, nameof(logEntry), logEntry);

		if (this._levels.includes(logEntry.level)) {
			logEntry.ts ??= Date.now();

			await Promise.allSettled(
				this._loggingConnectors.map(async loggingConnector =>
					loggingConnector.log(requestContext, logEntry)
				)
			);
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
		// See if we can find a connector that supports querying.
		// If it throws anything other than not implemented, we should throw it.
		for (const loggingConnector of this._loggingConnectors) {
			try {
				const result = await loggingConnector.query(
					requestContext,
					conditions,
					sortProperties,
					properties,
					cursor,
					pageSize
				);
				return result;
			} catch (error) {
				if (!BaseError.isErrorName(error, NotImplementedError.CLASS_NAME)) {
					throw error;
				}
			}
		}

		throw new NotImplementedError(MultiLoggingConnector._CLASS_NAME, "query");
	}
}
