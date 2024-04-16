// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRequestContext } from "@gtsc/services";
import type { ILogEntry } from "../models/ILogEntry";
import type { ILoggingProvider } from "../models/ILoggingProvider";

/**
 * Class for performing logging operations to nowhere.
 */
export class SilentLoggingProvider implements ILoggingProvider {
	/**
	 * Log an entry to the provider.
	 * @param requestContext The context for the request.
	 * @param logEntry The entry to log.
	 */
	public log(requestContext: IRequestContext, logEntry: ILogEntry): void {}
}
