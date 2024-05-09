// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { ICreatedResponse, IRestRoute, ITag } from "@gtsc/api-models";
import { Coerce, Guards } from "@gtsc/core";
import type {
	ILogging,
	ILoggingCreateRequest,
	ILoggingListRequest,
	ILoggingListResponse
} from "@gtsc/logging-models";
import { nameof } from "@gtsc/nameof";
import { ServiceFactory, type IRequestContext } from "@gtsc/services";
import { HttpStatusCodes } from "@gtsc/web";

/**
 * The source used when communicating about these routes.
 */
const ROUTES_SOURCE = "loggingRoutes";

/**
 * The tag to associate with the routes.
 */
export const tags: ITag[] = [
	{
		name: "Logging",
		description: "Endpoints which are modelled to access a logging contract."
	}
];

/**
 * The REST routes for logging.
 * @param baseRouteName Prefix to prepend to the paths.
 * @param factoryServiceName The name of the service to use in the routes store in the ServiceFactory.
 * @returns The generated routes.
 */
export function generateRestRoutes(
	baseRouteName: string,
	factoryServiceName: string
): IRestRoute[] {
	const createRoute: IRestRoute<ILoggingCreateRequest, ICreatedResponse> = {
		operationId: "loggingEntryCreate",
		summary: "Create a log entry",
		tag: tags[0].name,
		method: "POST",
		path: `${baseRouteName}/`,
		handler: async (requestContext, request, body) =>
			loggingCreate(requestContext, factoryServiceName, request, body),
		requestType: {
			type: nameof<ILoggingCreateRequest>(),
			examples: [
				{
					body: {
						level: "info",
						message: "This is an information message",
						source: "source",
						ts: 1715252922273
					}
				},
				{
					body: {
						level: "info",
						message: "This is an error message",
						source: "source",
						ts: 1715252922273,
						error: {
							name: "GeneralError",
							message: "component.error",
							properties: {
								foo: "bar"
							}
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<ICreatedResponse>()
			}
		]
	};

	const listRoute: IRestRoute<ILoggingListRequest, ILoggingListResponse> = {
		operationId: "loggingListEntries",
		summary: "Get a list of the log entries",
		tag: tags[0].name,
		method: "GET",
		path: `${baseRouteName}/`,
		handler: async (requestContext, request, body) =>
			loggingList(requestContext, factoryServiceName, request, body),
		requestType: {
			type: nameof<ILoggingListRequest>()
		},
		responseType: [
			{
				type: nameof<ILoggingListResponse>()
			}
		]
	};

	return [createRoute, listRoute];
}

/**
 * Create a new log entry.
 * @param requestContext The request context for the API.
 * @param factoryServiceName The name of the service to use in the routes.
 * @param request The request.
 * @param body The body if required for pure content.
 * @returns The response object with additional http response properties.
 */
export async function loggingCreate(
	requestContext: IRequestContext,
	factoryServiceName: string,
	request: ILoggingCreateRequest,
	body?: unknown
): Promise<ICreatedResponse> {
	Guards.object(ROUTES_SOURCE, nameof(request.body), request.body);
	const service = ServiceFactory.get<ILogging>(factoryServiceName);
	const id = await service.log(requestContext, request.body);
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
 * @param factoryServiceName The name of the service to use in the routes.
 * @param request The request.
 * @param body The body if required for pure content.
 * @returns The response object with additional http response properties.
 */
export async function loggingList(
	requestContext: IRequestContext,
	factoryServiceName: string,
	request: ILoggingListRequest,
	body?: unknown
): Promise<ILoggingListResponse> {
	const service = ServiceFactory.get<ILogging>(factoryServiceName);

	const itemsAndCursor = await service.query(
		requestContext,
		request?.query?.level,
		request?.query?.source,
		Coerce.number(request?.query?.timeStart),
		Coerce.number(request?.query?.timeEnd),
		request?.query?.cursor,
		Coerce.number(request?.query?.pageSize)
	);
	return {
		body: itemsAndCursor
	};
}
