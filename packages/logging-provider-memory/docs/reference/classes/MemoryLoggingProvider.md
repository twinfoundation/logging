# Class: MemoryLoggingProvider

Class for performing logging operations in memory.

## Implements

- `ILoggingProvider`

## Constructors

### constructor

• **new MemoryLoggingProvider**(`config?`): [`MemoryLoggingProvider`](MemoryLoggingProvider.md)

Create a new instance of MemoryLoggingProvider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config?` | `ILoggingLevelsConfig` | The configuration for the logging provider. |

#### Returns

[`MemoryLoggingProvider`](MemoryLoggingProvider.md)

## Properties

### \_levels

• `Private` `Readonly` **\_levels**: `LogLevel`[]

The log levels to display, will default to all.

## Methods

### getStore

▸ **getStore**(`tenantId`): `undefined` \| `ILogEntry`[]

Get the memory store for the specified tenant.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tenantId` | `string` | The tenant id. |

#### Returns

`undefined` \| `ILogEntry`[]

The store.

___

### log

▸ **log**(`requestContext`, `logEntry`): `void`

Log an entry to the provider.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `requestContext` | `IRequestContext` | The context for the request. |
| `logEntry` | `ILogEntry` | The entry to log. |

#### Returns

`void`

#### Implementation of

ILoggingProvider.log
