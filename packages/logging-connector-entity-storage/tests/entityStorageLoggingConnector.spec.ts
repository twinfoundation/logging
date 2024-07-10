// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaFactory, EntitySchemaHelper } from "@gtsc/entity";
import { MemoryEntityStorageConnector } from "@gtsc/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@gtsc/entity-storage-models";
import { nameof } from "@gtsc/nameof";
import { LogEntry } from "../src/entities/logEntry";
import { EntityStorageLoggingConnector } from "../src/entityStorageLoggingConnector";

describe("EntityStorageLoggingConnector", () => {
	beforeAll(() => {
		EntitySchemaFactory.register(nameof<LogEntry>(), () => EntitySchemaHelper.getSchema(LogEntry));
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
