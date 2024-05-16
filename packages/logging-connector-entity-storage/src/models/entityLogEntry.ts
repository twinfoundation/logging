// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { SortDirection, entity, property } from "@gtsc/entity";
import type { LogLevel } from "@gtsc/logging-models";

/**
 * Interface describing a log entry.
 */
@entity()
export class EntityLogEntry {
	/**
	 * The id.
	 */
	@property({ type: "string", isPrimary: true })
	public id!: string;

	/**
	 * The level of the error being logged.
	 */
	@property({ type: "string" })
	public level!: LogLevel;

	/**
	 * The source of the log entry.
	 */
	@property({ type: "string" })
	public source!: string;

	/**
	 * The timestamp of the log entry.
	 */
	@property({ type: "integer", sortDirection: SortDirection.Descending })
	public ts!: number;

	/**
	 * The message.
	 */
	@property({ type: "string" })
	public message!: string;

	/**
	 * JSON version of flattened error array.
	 */
	@property({ type: "string" })
	public error?: string;

	/**
	 * JSON data for the message.
	 */
	@property({ type: "string" })
	public data?: string;
}
