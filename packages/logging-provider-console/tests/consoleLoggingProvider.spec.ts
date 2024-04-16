// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { ConsoleLoggingProvider } from "../src/consoleLoggingProvider";

describe("ConsoleLoggingProvider", () => {
	test("can construct", async () => {
		const logging = new ConsoleLoggingProvider();
		expect(logging).toBeDefined();
	});
});
