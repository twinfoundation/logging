// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

import type { INoContentResponse, IRestRoute, ITag } from "@gtsc/api-models";
import { Coerce, Guards } from "@gtsc/core";
import type {
	ILogging,
	ILoggingCreateRequest,
	ILoggingListRequest,
	ILoggingListResponse
} from "@gtsc/logging-models";
import { nameof } from "@gtsc/nameof";
import { ServiceFactory, type IRequestContext } from "@gtsc/services";

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
	const createRoute: IRestRoute<ILoggingCreateRequest, void> = {
		operationId: "loggingEntryCreate",
		summary: "Create a log entry",
		tag: tags[0].name,
		method: "POST",
		path: `${baseRouteName}/`,
		handler: async (requestContext, request) =>
			loggingCreate(requestContext, factoryServiceName, request),
		requestType: {
			type: nameof<ILoggingCreateRequest>(),
			examples: [
				{
					id: "loggingEntryCreateInfoExample",
					request: {
						body: {
							level: "info",
							message: "This is an information message",
							source: "source",
							ts: 1715252922273
						}
					}
				},
				{
					id: "loggingEntryCreateErrorExample",
					request: {
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
				}
			]
		},
		responseType: [
			{
				type: nameof<INoContentResponse>()
			}
		]
	};

	const listRoute: IRestRoute<ILoggingListRequest, ILoggingListResponse> = {
		operationId: "loggingListEntries",
		summary: "Get a list of the log entries",
		tag: tags[0].name,
		method: "GET",
		path: `${baseRouteName}/`,
		handler: async (requestContext, request) =>
			loggingList(requestContext, factoryServiceName, request),
		requestType: {
			type: nameof<ILoggingListRequest>(),
			examples: [
				{
					id: "loggingListRequestExample",
					request: {
						query: {
							level: "info"
						}
					}
				}
			]
		},
		responseType: [
			{
				type: nameof<ILoggingListResponse>(),
				examples: [
					{
						id: "listResponseExample",
						response: {
							body: {
								entities: [
									{
										level: "info",
										message: "This is an information message",
										source: "source",
										ts: 1715252922273
									}
								],
								cursor: "1",
								pageSize: 10,
								totalEntities: 20
							}
						}
					}
				]
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
 * @returns The response object with additional http response properties.
 */
export async function loggingCreate(
	requestContext: IRequestContext,
	factoryServiceName: string,
	request: ILoggingCreateRequest
): Promise<void> {
	Guards.object<ILoggingCreateRequest>(ROUTES_SOURCE, nameof(request), request);
	Guards.object<ILoggingCreateRequest["body"]>(ROUTES_SOURCE, nameof(request.body), request.body);
	const service = ServiceFactory.get<ILogging>(factoryServiceName);
	await service.log(requestContext, request.body);
}

/**
 * Get a list of the logging entries.
 * @param requestContext The request context for the API.
 * @param factoryServiceName The name of the service to use in the routes.
 * @param request The request.
 * @returns The response object with additional http response properties.
 */
export async function loggingList(
	requestContext: IRequestContext,
	factoryServiceName: string,
	request: ILoggingListRequest
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
