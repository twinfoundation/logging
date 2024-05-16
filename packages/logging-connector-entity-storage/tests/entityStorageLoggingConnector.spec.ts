// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaHelper } from "@gtsc/entity";
import { MemoryEntityStorageConnector } from "@gtsc/entity-storage-connector-memory";
import { LogEntry } from "../src/entities/logEntry";
import { EntityStorageLoggingConnector } from "../src/entityStorageLoggingConnector";

describe("EntityStorageLoggingConnector", () => {
	test("can construct", async () => {
		const memoryEntityStorage = new MemoryEntityStorageConnector<LogEntry>(
			EntitySchemaHelper.getSchema(LogEntry)
		);
		const logging = new EntityStorageLoggingConnector({
			logEntryStorage: memoryEntityStorage
		});
		expect(logging).toBeDefined();
	});
});
