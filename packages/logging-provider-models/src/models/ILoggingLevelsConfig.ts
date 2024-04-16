// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { LogLevel } from "./logLevel";

/**
 * Configuration for the logging providers to specify the levels to display.
 */
export interface ILoggingLevelsConfig {
	/**
	 * The log levels to display, will default to all.
	 */
	levels?: LogLevel[];
}
