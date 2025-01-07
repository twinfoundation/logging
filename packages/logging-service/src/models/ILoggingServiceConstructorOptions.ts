// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Options for the logging service constructor.
 */
export interface ILoggingServiceConstructorOptions {
	/**
	 * The type of the logging connector to use.
	 * @default logging
	 */
	loggingConnectorType?: string;
}
