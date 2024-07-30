// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { EntityCondition, SortDirection } from "@gtsc/entity";
import { nameof } from "@gtsc/nameof";
import type { IServiceRequestContext } from "@gtsc/services";
import { LoggingConnectorFactory } from "../factories/loggingConnectorFactory";
import type { ILogEntry } from "../models/ILogEntry";
import type { ILoggingConnector } from "../models/ILoggingConnector";

/**
 * Class for performing logging and automatically apply the system partition id to request context.
 */
export class SystemLoggingConnector implements ILoggingConnector {
	/**
	 * The namespace for the logging connector.
	 */
	public static readonly NAMESPACE: string = "system";

	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = nameof<SystemLoggingConnector>();

	/**
	 * The logging connector.
	 * @internal
	 */
	private readonly _loggingConnector: ILoggingConnector;

	/**
	 * The system partition id for logging.
	 * @internal
	 */
	private readonly _systemPartitionId: string;

	/**
	 * Create a new instance of SystemLoggingConnector.
	 * @param options The options for the server.
	 * @param options.loggingConnectorType The type of the logging connector to use, defaults to "logging".
	 * @param options.systemPartitionId The system partition id to use when logging information.
	 */
	constructor(options: { loggingConnectorType?: string; systemPartitionId: string }) {
		this._loggingConnector = LoggingConnectorFactory.get(options.loggingConnectorType ?? "logging");
		this._systemPartitionId = options?.systemPartitionId;
	}

	/**
	 * Log an entry to the connector.
	 * @param logEntry The entry to log.
	 * @param requestContext The context for the request.
	 * @returns Nothing.
	 */
	public async log(logEntry: ILogEntry, requestContext?: IServiceRequestContext): Promise<void> {
		return this._loggingConnector.log(logEntry, { partitionId: this._systemPartitionId });
	}

	/**
	 * Query the log entries.
	 * @param conditions The conditions to match for the entities.
	 * @param sortProperties The optional sort order.
	 * @param properties The optional keys to return, defaults to all.
	 * @param cursor The cursor to request the next page of entities.
	 * @param pageSize The maximum number of entities in a page.
	 * @param requestContext The context for the request.
	 * @returns All the entities for the storage matching the conditions,
	 * and a cursor which can be used to request more entities.
	 * @throws NotImplementedError if the implementation does not support retrieval.
	 */
	public async query(
		conditions?: EntityCondition<ILogEntry>,
		sortProperties?: {
			property: keyof ILogEntry;
			sortDirection: SortDirection;
		}[],
		properties?: (keyof ILogEntry)[],
		cursor?: string,
		pageSize?: number,
		requestContext?: IServiceRequestContext
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
		return this._loggingConnector.query(conditions, sortProperties, properties, cursor, pageSize, {
			partitionId: this._systemPartitionId
		});
	}
}
