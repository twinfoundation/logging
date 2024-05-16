// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaHelper } from "@gtsc/entity";
import { MemoryEntityStorageConnector } from "@gtsc/entity-storage-connector-memory";
import { EntityStorageLoggingConnector } from "../src/entityStorageLoggingConnector";
import { EntityLogEntry } from "../src/models/entityLogEntry";

describe("EntityStorageLoggingConnector", () => {
	test("can construct", async () => {
		const memoryEntityStorage = new MemoryEntityStorageConnector<EntityLogEntry>(
			EntitySchemaHelper.getSchema(EntityLogEntry)
		);
		const logging = new EntityStorageLoggingConnector({
			logEntryStorage: memoryEntityStorage
		});
		expect(logging).toBeDefined();
	});
});
