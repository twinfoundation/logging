// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { ICreatedResponse, IRestRoute, ITag } from "@gtsc/api-models";
import { Coerce, Guards } from "@gtsc/core";
import type {
	ILoggingCreateRequest,
	ILoggingListRequest,
	ILoggingListResponse,
	ILoggingService
} from "@gtsc/logging-models";
import { nameof } from "@gtsc/nameof";
import { ServiceFactory, type IRequestContext } from "@gtsc/services";
import { HttpStatusCodes } from "@gtsc/web";

/**
 * The context used when communicating about these routes.
 */
const ROUTES_CONTEXT = "loggingRoutes";

/**
 * The tag to associate with the routes.
 */
export const tags: ITag[] = [
	{
		name: "Logging",
		description: "Endpoints which are part of the Logging service."
	}
];

/**
 * The REST routes for logging.
 * @param routeName Prefix to prepend to the paths.
 * @param serviceName The name of the service to use in the routes.
 * @returns The generated routes.
 */
export function generateRestRoutes(routeName: string, serviceName: string): IRestRoute[] {
	return [
		{
			operationId: "loggingEntryCreate",
			summary: "Create a log entry",
			tag: tags[0].name,
			method: "POST",
			path: `${routeName}/`,
			handler: async (requestContext, request, body) =>
				loggingCreate(requestContext, serviceName, request, body),
			requestType: nameof<ILoggingCreateRequest>(),
			responseType: [
				{
					type: nameof<ICreatedResponse>(),
					statusCode: HttpStatusCodes.CREATED
				}
			]
		},
		{
			operationId: "loggingListEntries",
			summary: "Get a list of the log entries",
			tag: tags[0].name,
			method: "GET",
			path: `${routeName}/`,
			handler: async (requestContext, request, body) =>
				loggingList(requestContext, serviceName, request, body),
			requestType: nameof<ILoggingListRequest>(),
			responseType: [
				{
					type: nameof<ILoggingListResponse>(),
					statusCode: HttpStatusCodes.OK
				}
			]
		}
	];
}

/**
 * Create a new log entry.
 * @param requestContext The request context for the API.
 * @param serviceName The name of the service to use in the routes.
 * @param request The request.
 * @param body The body if required for pure content.
 * @returns The response object with additional http response properties.
 */
export async function loggingCreate(
	requestContext: IRequestContext,
	serviceName: string,
	request: ILoggingCreateRequest,
	body?: unknown
): Promise<ICreatedResponse> {
	Guards.object(ROUTES_CONTEXT, nameof(request.data), request.data);
	const loggingService = ServiceFactory.get<ILoggingService>(serviceName);
	const id = await loggingService.log(requestContext, request.data);
	return {
		statusCode: HttpStatusCodes.CREATED,
		headers: {
			location: id ?? ""
		}
	};
}

/**
 * Get a list of the logging entries.
 * @param requestContext The request context for the API.
 * @param serviceName The name of the service to use in the routes.
 * @param request The request.
 * @param body The body if required for pure content.
 * @returns The response object with additional http response properties.
 */
export async function loggingList(
	requestContext: IRequestContext,
	serviceName: string,
	request: ILoggingListRequest,
	body?: unknown
): Promise<ILoggingListResponse> {
	const loggingService = ServiceFactory.get<ILoggingService>(serviceName);

	const itemsAndCursor = await loggingService.query(
		requestContext,
		request?.query?.level,
		request?.query?.source,
		Coerce.number(request?.query?.timeStart),
		Coerce.number(request?.query?.timeEnd),
		request?.query?.cursor,
		Coerce.number(request?.query?.pageSize)
	);
	return {
		data: itemsAndCursor
	};
}
