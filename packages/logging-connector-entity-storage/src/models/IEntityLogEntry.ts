// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { LogLevel } from "@gtsc/logging-models";

/**
 * Interface describing a log entry.
 */
export interface IEntityLogEntry {
	/**
	 * The id.
	 */
	id: string;

	/**
	 * The level of the error being logged.
	 */
	level: LogLevel;

	/**
	 * The source of the log entry.
	 */
	source: string;

	/**
	 * The timestamp of the log entry.
	 */
	ts: number;

	/**
	 * The message.
	 */
	message: string;

	/**
	 * JSON version of flattened error array.
	 */
	error?: string;

	/**
	 * JSON data for the message.
	 */
	data?: string;
}
