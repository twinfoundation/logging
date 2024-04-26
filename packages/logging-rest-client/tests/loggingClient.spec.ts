// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { LoggingClient } from "../src/loggingClient";

describe("LoggingClient", () => {
	test("Can create an instance", async () => {
		const client = new LoggingClient({ endpoint: "http://localhost:8080" });
		expect(client).toBeDefined();
	});
});
