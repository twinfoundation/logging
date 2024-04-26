# @gtsc/logging-rest-server

## Classes

- [LoggingService](classes/LoggingService.md)

## Variables

### tags

• `Const` **tags**: `ITag`[]

The tag to associate with the routes.

## Functions

### generateRestRoutes

▸ **generateRestRoutes**(`routeName`, `serviceName`): `IRestRoute`[]

The REST routes for logging.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `routeName` | `string` | Prefix to prepend to the paths. |
| `serviceName` | `string` | The name of the service to use in the routes. |

#### Returns

`IRestRoute`[]

The generated routes.

___

### loggingCreate

▸ **loggingCreate**(`requestContext`, `serviceName`, `request`, `body?`): `Promise`\<`ICreatedResponse`\>

Create a new log entry.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `requestContext` | `IRequestContext` | The request context for the API. |
| `serviceName` | `string` | The name of the service to use in the routes. |
| `request` | `ILoggingCreateRequest` | The request. |
| `body?` | `unknown` | The body if required for pure content. |

#### Returns

`Promise`\<`ICreatedResponse`\>

The response object with additional http response properties.

___

### loggingList

▸ **loggingList**(`requestContext`, `serviceName`, `request`, `body?`): `Promise`\<`ILoggingListResponse`\>

Get a list of the logging entries.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `requestContext` | `IRequestContext` | The request context for the API. |
| `serviceName` | `string` | The name of the service to use in the routes. |
| `request` | `ILoggingListRequest` | The request. |
| `body?` | `unknown` | The body if required for pure content. |

#### Returns

`Promise`\<`ILoggingListResponse`\>

The response object with additional http response properties.
