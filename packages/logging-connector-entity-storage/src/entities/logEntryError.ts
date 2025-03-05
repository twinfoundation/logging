// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { entity, property } from "@twin.org/entity";

/**
 * Call defining a log entry error.
 */
@entity()
export class LogEntryError {
	/**
	 * The name for the error.
	 */
	@property({ type: "string" })
	public name!: string;

	/**
	 * The message for the error.
	 */
	@property({ type: "string" })
	public message!: string;

	/**
	 * The source of the error.
	 */
	@property({ type: "string", optional: true })
	public source?: string;

	/**
	 * Any additional information for the error.
	 */
	@property({ type: "object", optional: true })
	public properties?: {
		[id: string]: unknown;
	};

	/**
	 * The stack trace for the error.
	 */
	@property({ type: "string", optional: true })
	public stack?: string;
}
