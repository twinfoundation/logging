# Class: SystemLoggingConnector

Class for performing logging and automatically apply the system partition id to request context.

## Implements

- [`ILoggingConnector`](../interfaces/ILoggingConnector.md)

## Constructors

### new SystemLoggingConnector()

> **new SystemLoggingConnector**(`options`): [`SystemLoggingConnector`](SystemLoggingConnector.md)

Create a new instance of SystemLoggingConnector.

#### Parameters

• **options**

The options for the server.

• **options.loggingConnectorType**: `string`

The type of the logging connector to use, if undefined, no logging will happen.

• **options.systemPartitionId**: `string`

The system partition id to use when logging information.

#### Returns

[`SystemLoggingConnector`](SystemLoggingConnector.md)

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

Runtime name for the class.

#### Implementation of

[`ILoggingConnector`](../interfaces/ILoggingConnector.md).[`CLASS_NAME`](../interfaces/ILoggingConnector.md#class_name)

## Methods

### log()

> **log**(`logEntry`, `requestContext`?): `Promise`\<`void`\>

Log an entry to the connector.

#### Parameters

• **logEntry**: [`ILogEntry`](../interfaces/ILogEntry.md)

The entry to log.

• **requestContext?**: `IServiceRequestContext`

The context for the request.

#### Returns

`Promise`\<`void`\>

Nothing.

#### Implementation of

[`ILoggingConnector`](../interfaces/ILoggingConnector.md).[`log`](../interfaces/ILoggingConnector.md#log)

***

### query()

> **query**(`conditions`?, `sortProperties`?, `properties`?, `cursor`?, `pageSize`?, `requestContext`?): `Promise`\<`object`\>

Query the log entries.

#### Parameters

• **conditions?**: `EntityCondition`\<[`ILogEntry`](../interfaces/ILogEntry.md)\>

The conditions to match for the entities.

• **sortProperties?**: `object`[]

The optional sort order.

• **properties?**: keyof [`ILogEntry`](../interfaces/ILogEntry.md)[]

The optional keys to return, defaults to all.

• **cursor?**: `string`

The cursor to request the next page of entities.

• **pageSize?**: `number`

The maximum number of entities in a page.

• **requestContext?**: `IServiceRequestContext`

The context for the request.

#### Returns

`Promise`\<`object`\>

All the entities for the storage matching the conditions,
and a cursor which can be used to request more entities.

##### entities

> **entities**: `Partial`\<[`ILogEntry`](../interfaces/ILogEntry.md)\>[]

The entities, which can be partial if a limited keys list was provided.

##### cursor?

> `optional` **cursor**: `string`

An optional cursor, when defined can be used to call find to get more entities.

##### pageSize?

> `optional` **pageSize**: `number`

Number of entities to return.

##### totalEntities

> **totalEntities**: `number`

Total entities length.

#### Implementation of

[`ILoggingConnector`](../interfaces/ILoggingConnector.md).[`query`](../interfaces/ILoggingConnector.md#query)

#### Throws

NotImplementedError if the implementation does not support retrieval.