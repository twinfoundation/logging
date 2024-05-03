// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	BaseRestClient,
	type IBaseRestClientConfig,
	type ICreatedResponse
} from "@gtsc/api-models";
import { Guards, StringHelper } from "@gtsc/core";
import type {
	ILogEntry,
	ILoggingContract,
	ILoggingCreateRequest,
	ILoggingListRequest,
	ILoggingListResponse,
	LogLevel
} from "@gtsc/logging-models";
import { nameof } from "@gtsc/nameof";
import type { IRequestContext } from "@gtsc/services";

/**
 * Client for performing logging through to REST endpoints.
 */
export class LoggingClient extends BaseRestClient implements ILoggingContract {
	/**
	 * Runtime name for the class.
	 * @internal
	 */
	private static readonly _CLASS_NAME: string = nameof<LoggingClient>();

	/**
	 * Create a new instance of LoggingClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(LoggingClient._CLASS_NAME, config, StringHelper.kebabCase(nameof<ILoggingContract>()));
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
		Guards.object(LoggingClient._CLASS_NAME, nameof(requestContext), requestContext);
		Guards.stringValue(
			LoggingClient._CLASS_NAME,
			nameof(requestContext.tenantId),
			requestContext.tenantId
		);
		const response = await this.fetch<ILoggingCreateRequest, ICreatedResponse>(
			requestContext,
			"/",
			"POST",
			{
				data: logEntry
			}
		);

		return response.headers.location;
	}

	/**
	 * Query the log entries.
	 * @param requestContext The context for the request.
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
		requestContext: IRequestContext,
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
		Guards.object(LoggingClient._CLASS_NAME, nameof(requestContext), requestContext);
		Guards.stringValue(
			LoggingClient._CLASS_NAME,
			nameof(requestContext.tenantId),
			requestContext.tenantId
		);

		const response = await this.fetch<ILoggingListRequest, ILoggingListResponse>(
			requestContext,
			"/",
			"GET",
			{
				query: {
					level,
					source,
					timeStart,
					timeEnd,
					cursor,
					pageSize
				}
			}
		);

		return response.data;
	}
}
