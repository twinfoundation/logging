// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@gtsc/api-core";
import type { IBaseRestClientConfig, IOkResponse } from "@gtsc/api-models";
import { Guards } from "@gtsc/core";
import type {
	ILogEntry,
	ILoggingComponent,
	ILoggingCreateRequest,
	ILoggingListRequest,
	ILoggingListResponse,
	LogLevel
} from "@gtsc/logging-models";
import { nameof } from "@gtsc/nameof";

/**
 * Client for performing logging through to REST endpoints.
 */
export class LoggingClient extends BaseRestClient implements ILoggingComponent {
	/**
	 * Runtime name for the class.
	 * @internal
	 */
	private static readonly _CLASS_NAME: string = nameof<LoggingClient>();

	/**
	 * Runtime name for the class.
	 */
	public readonly CLASS_NAME: string = LoggingClient._CLASS_NAME;

	/**
	 * Create a new instance of LoggingClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(LoggingClient._CLASS_NAME, config, "logging");
	}

	/**
	 * Log an entry to the connector.
	 * @param logEntry The entry to log.
	 * @returns Nothing.
	 */
	public async log(logEntry: ILogEntry): Promise<void> {
		Guards.object<ILogEntry>(this.CLASS_NAME, nameof(logEntry), logEntry);

		await this.fetch<ILoggingCreateRequest, IOkResponse>("/", "POST", {
			body: logEntry
		});
	}

	/**
	 * Query the log entries.
	 * @param level The level of the log entries.
	 * @param source The source of the log entries.
	 * @param timeStart The inclusive time as the start of the log entries.
	 * @param timeEnd The inclusive time as the end of the log entries.
	 * @param cursor The cursor to request the next page of entities.
	 * @param pageSize The maximum number of entities in a page.
	 * @returns All the entities for the storage matching the conditions,
	 * and a cursor which can be used to request more entities.
	 * @throws NotImplementedError if the implementation does not support retrieval.
	 */
	public async query(
		level?: LogLevel,
		source?: string,
		timeStart?: number,
		timeEnd?: number,
		cursor?: string,
		pageSize?: number
	): Promise<{
		/**
		 * The entities, which can be partial if a limited keys list was provided.
		 */
		entities: ILogEntry[];
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
		const response = await this.fetch<ILoggingListRequest, ILoggingListResponse>("/", "GET", {
			query: {
				level,
				source,
				timeStart,
				timeEnd,
				cursor,
				pageSize
			}
		});

		return response.body;
	}
}
