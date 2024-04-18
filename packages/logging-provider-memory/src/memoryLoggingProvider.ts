// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Guards } from "@gtsc/core";
import type { ILogEntry, ILoggingProvider, LogLevel } from "@gtsc/logging-provider-models";
import { nameof } from "@gtsc/nameof";
import type { IRequestContext } from "@gtsc/services";
import type { IMemoryLoggingProviderConfig } from "./models/IMemoryLoggingProviderConfig";

/**
 * Class for performing logging operations in memory.
 */
export class MemoryLoggingProvider implements ILoggingProvider {
	/**
	 * Runtime name for the class.
	 * @internal
	 */
	private static readonly _CLASS_NAME: string = nameof<MemoryLoggingProvider>();

	/**
	 * The log levels to display, will default to all.
	 */
	private readonly _levels: LogLevel[];

	/**
	 * The logs that have been recorded.
	 * @internal
	 */
	private readonly _store: { [tenantId: string]: ILogEntry[] };

	/**
	 * Create a new instance of MemoryLoggingProvider.
	 * @param config The configuration for the logging provider.
	 */
	constructor(config?: IMemoryLoggingProviderConfig) {
		this._levels = config?.levels ?? ["debug", "info", "warn", "error", "trace"];
		this._store = {};
	}

	/**
	 * Log an entry to the provider.
	 * @param requestContext The context for the request.
	 * @param logEntry The entry to log.
	 */
	public log(requestContext: IRequestContext, logEntry: ILogEntry): void {
		Guards.string(
			MemoryLoggingProvider._CLASS_NAME,
			nameof(requestContext.tenantId),
			requestContext.tenantId
		);

		if (this._levels.includes(logEntry.level)) {
			this._store[requestContext.tenantId] ??= [];
			this._store[requestContext.tenantId].push(logEntry);
		}
	}

	/**
	 * Get the memory store for the specified tenant.
	 * @param tenantId The tenant id.
	 * @returns The store.
	 */
	public getStore(tenantId: string): ILogEntry[] | undefined {
		return this._store[tenantId];
	}
}
