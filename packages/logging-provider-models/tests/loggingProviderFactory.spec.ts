// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { LoggingProviderFactory } from "../src/factories/loggingProviderFactory";
import type { ILoggingProvider } from "../src/models/ILoggingProvider";

describe("LoggingProviderFactory", () => {
	test("can add an item to the factory", async () => {
		LoggingProviderFactory.register("my-logging", () => ({}) as unknown as ILoggingProvider);
	});
});
