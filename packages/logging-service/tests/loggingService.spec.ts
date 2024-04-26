// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { ILoggingConnector } from "@gtsc/logging-models";
import { LoggingService } from "../src/loggingService";

describe("LoggingService", () => {
	test("Can create an instance", async () => {
		const service = new LoggingService({ loggingConnector: {} as unknown as ILoggingConnector });
		expect(service).toBeDefined();
	});
});
