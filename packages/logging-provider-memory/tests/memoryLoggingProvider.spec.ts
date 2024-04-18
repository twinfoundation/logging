// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { MemoryLoggingProvider } from "../src/memoryLoggingProvider";

describe("MemoryLoggingProvider", () => {
	test("can construct", async () => {
		const logging = new MemoryLoggingProvider();
		expect(logging).toBeDefined();
	});
});
