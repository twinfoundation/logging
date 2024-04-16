// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Factory } from "@gtsc/core";
import type { ILoggingProvider } from "../models/ILoggingProvider";

/**
 * Factory for creating logging providers.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const LoggingProviderFactory = new Factory<ILoggingProvider>("logging");
