// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { MemoryEntityStorageConnector } from "@gtsc/entity-storage-connector-memory";
import { EntityStorageLoggingConnector } from "../src/entityStorageLoggingConnector";
import { EntityLogEntryDescriptor } from "../src/models/entityLogEntryDescriptor";

describe("EntityStorageLoggingConnector", () => {
	test("can construct", async () => {
		const memoryEntityStorage = new MemoryEntityStorageConnector(EntityLogEntryDescriptor);
		const logging = new EntityStorageLoggingConnector({
			logEntryStorage: memoryEntityStorage
		});
		expect(logging).toBeDefined();
	});
});
