# Interface: ILoggingComponent

Interface describing a logging contract.

## Extends

- `IComponent`

## Properties

### CLASS\_NAME

> `readonly` **CLASS\_NAME**: `string`

The name of the component.

#### Inherited from

`IComponent.CLASS_NAME`

## Methods

### bootstrap()?

> `optional` **bootstrap**(`nodeLoggingConnectorType`?): `Promise`\<`boolean`\>

Bootstrap the component by creating and initializing any resources it needs.

#### Parameters

• **nodeLoggingConnectorType?**: `string`

The node logging connector type, defaults to "node-logging".

#### Returns

`Promise`\<`boolean`\>

True if the bootstrapping process was successful.

#### Inherited from

`IComponent.bootstrap`

***

### start()?

> `optional` **start**(`nodeIdentity`, `nodeLoggingConnectorType`?): `Promise`\<`void`\>

The component needs to be started when the node is initialized.

#### Parameters

• **nodeIdentity**: `string`

The identity of the node starting the component.

• **nodeLoggingConnectorType?**: `string`

The node logging connector type, defaults to "node-logging".

#### Returns

`Promise`\<`void`\>

Nothing.

#### Inherited from

`IComponent.start`

***

### stop()?

> `optional` **stop**(`nodeIdentity`, `nodeLoggingConnectorType`?): `Promise`\<`void`\>

The component needs to be stopped when the node is closed.

#### Parameters

• **nodeIdentity**: `string`

The identity of the node stopping the component.

• **nodeLoggingConnectorType?**: `string`

The node logging connector type, defaults to "node-logging".

#### Returns

`Promise`\<`void`\>

Nothing.

#### Inherited from

`IComponent.stop`

***

### log()

> **log**(`logEntry`): `Promise`\<`void`\>

Log an entry to the component.

#### Parameters

• **logEntry**: [`ILogEntry`](ILogEntry.md)

The entry to log.

#### Returns

`Promise`\<`void`\>

Nothing.

***

### query()

> **query**(`level`?, `source`?, `timeStart`?, `timeEnd`?, `cursor`?, `pageSize`?): `Promise`\<`object`\>

Query the log entries.

#### Parameters

• **level?**: [`LogLevel`](../type-aliases/LogLevel.md)

The level of the log entries.

• **source?**: `string`

The source of the log entries.

• **timeStart?**: `number`

The inclusive time as the start of the log entries.

• **timeEnd?**: `number`

The inclusive time as the end of the log entries.

• **cursor?**: `string`

The cursor to request the next page of entities.

• **pageSize?**: `number`

The maximum number of entities in a page.

#### Returns

`Promise`\<`object`\>

All the entities for the storage matching the conditions,
and a cursor which can be used to request more entities.

##### entities

> **entities**: [`ILogEntry`](ILogEntry.md)[]

The entities, which can be partial if a limited keys list was provided.

##### cursor?

> `optional` **cursor**: `string`

An optional cursor, when defined can be used to call find to get more entities.

#### Throws

NotImplementedError if the implementation does not support retrieval.
