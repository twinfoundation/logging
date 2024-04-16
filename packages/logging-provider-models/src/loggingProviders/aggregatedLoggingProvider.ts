// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Guards } from "@gtsc/core";
import { nameof } from "@gtsc/nameof";
import type { IRequestContext } from "@gtsc/services";
import type { ILogEntry } from "../models/ILogEntry";
import type { ILoggingLevelsConfig } from "../models/ILoggingLevelsConfig";
import type { ILoggingProvider } from "../models/ILoggingProvider";
import type { LogLevel } from "../models/logLevel";

/**
 * Class for performing logging operations on multiple providers.
 */
export class AggregatedLoggingProvider implements ILoggingProvider {
	/**
	 * Runtime name for the class.
	 * @internal
	 */
	private static readonly _CLASS_NAME: string = nameof<AggregatedLoggingProvider>();

	/**
	 * The log levels to display, will default to all.
	 */
	private readonly _loggingProviders: ILoggingProvider[];

	/**
	 * The log levels to display, will default to all.
	 */
	private readonly _levels: LogLevel[];

	/**
	 * Create a new instance of AggregatedLoggingProvider.
	 * @param config The configuration for the logging provider.
	 * @param loggingProviders The logging providers to aggregate.
	 */
	constructor(config: ILoggingLevelsConfig | undefined, loggingProviders: ILoggingProvider[]) {
		Guards.array(AggregatedLoggingProvider._CLASS_NAME, nameof(loggingProviders), loggingProviders);
		this._levels = config?.levels ?? ["debug", "info", "warn", "error", "trace"];
		this._loggingProviders = loggingProviders ?? [];
	}

	/**
	 * Log an entry to the provider.
	 * @param requestContext The context for the request.
	 * @param logEntry The entry to log.
	 */
	public log(requestContext: IRequestContext, logEntry: ILogEntry): void {
		if (this._levels.includes(logEntry.level)) {
			logEntry.ts ??= Date.now();

			for (const logger of this._loggingProviders) {
				logger.log(requestContext, logEntry);
			}
		}
	}
}
