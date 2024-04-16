// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRequestContext, IService } from "@gtsc/services";
import type { ILogEntry } from "./ILogEntry";

/**
 * Interface describing a logging provider.
 */
export interface ILoggingProvider extends IService {
	/**
	 * Log an entry to the provider.
	 * @param requestContext The context for the request.
	 * @param logEntry The entry to log.
	 */
	log(requestContext: IRequestContext, logEntry: ILogEntry): void;
}
