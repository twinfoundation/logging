// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { EntitySchemaFactory, EntitySchemaHelper } from "@gtsc/entity";
import { MemoryEntityStorageConnector } from "@gtsc/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@gtsc/entity-storage-models";
import { nameof } from "@gtsc/nameof";
import { LogEntry } from "../src/entities/logEntry";
import { EntityStorageLoggingConnector } from "../src/entityStorageLoggingConnector";

describe("EntityStorageLoggingConnector", () => {
	test("can construct", async () => {
		EntitySchemaFactory.register(nameof<LogEntry>(), () => EntitySchemaHelper.getSchema(LogEntry));
		EntityStorageConnectorFactory.register(
			"logging-entity-storage",
			() =>
				new MemoryEntityStorageConnector<LogEntry>({
					entitySchema: nameof<LogEntry>()
				})
		);
		const logging = new EntityStorageLoggingConnector();
		expect(logging).toBeDefined();
	});
});
