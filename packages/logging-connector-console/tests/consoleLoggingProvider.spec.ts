// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ConsoleLoggingConnector } from "../src/ConsoleLoggingConnector";

describe("ConsoleLoggingConnector", () => {
	test("can construct", async () => {
		const logging = new ConsoleLoggingConnector();
		expect(logging).toBeDefined();
	});
});
