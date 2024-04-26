// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { SortDirection, type IEntityDescriptor } from "@gtsc/entity";
import { nameof } from "@gtsc/nameof";
import type { IEntityLogEntry } from "./IEntityLogEntry";

/**
 * Entity description for a IEntityLogEntry.
 * @returns The descriptor for the IEntityLogEntry.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const EntityLogEntryDescriptor: IEntityDescriptor<IEntityLogEntry> = {
	name: nameof<IEntityLogEntry>(),
	properties: [
		{
			property: "id",
			type: "string",
			isPrimary: true
		},
		{
			property: "level",
			type: "string"
		},
		{
			property: "source",
			type: "string"
		},
		{
			property: "ts",
			type: "timestamp",
			sortDirection: SortDirection.Descending
		},
		{
			property: "message",
			type: "string"
		},
		{
			property: "error",
			type: "string"
		},
		{
			property: "data",
			type: "string"
		}
	]
};
