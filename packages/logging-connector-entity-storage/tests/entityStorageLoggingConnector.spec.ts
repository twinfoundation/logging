// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { MemoryEntityStorageConnector } from "@gtsc/entity-storage-connector-memory";
import { EntityStorageLoggingConnector } from "../src/entityStorageLoggingConnector";
import { IEntityLogEntryDescriptor } from "../src/models/IEntityLogEntryDescriptor";

describe("EntityStorageLoggingConnector", () => {
	test("can construct", async () => {
		const memoryEntityStorage = new MemoryEntityStorageConnector(IEntityLogEntryDescriptor);
		const logging = new EntityStorageLoggingConnector({
			entityStorageConnector: memoryEntityStorage
		});
		expect(logging).toBeDefined();
	});
});
