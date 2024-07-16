// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { MemoryEntityStorageConnector } from "@gtsc/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@gtsc/entity-storage-models";
import { nameof } from "@gtsc/nameof";
import type { LogEntry } from "../src/entities/logEntry";
import { EntityStorageLoggingConnector } from "../src/entityStorageLoggingConnector";
import { initSchema } from "../src/schema";

describe("EntityStorageLoggingConnector", () => {
	beforeAll(() => {
		initSchema();
		EntityStorageConnectorFactory.register(
			"log-entry",
			() =>
				new MemoryEntityStorageConnector<LogEntry>({
					entitySchema: nameof<LogEntry>()
				})
		);
	});

	test("can construct", async () => {
		const logging = new EntityStorageLoggingConnector();
		expect(logging).toBeDefined();
	});
});
