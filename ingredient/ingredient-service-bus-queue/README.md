## Changelogs
* [@azbake/ingredient-storage](./CHANGELOG.md)

## Overview

The Service Bus Queue ingredient is a plugin for Bake.  When included in a recipe this will create a standard Service Bus Queue.

## Usage

This typically would be included as a dependent resource in a recipe with a reference to a ServiceBus Namespace. It is possible to setup a **stand alone** instance, but would not be a typical inclusion.

### Recipe
```yaml
name: My package
shortName: mypkg
version: 0.0.1
ingredients:
  - "@azbake/ingredient-servicebus-queue@~0"
parallelRegions: false
resourceGroup: true
recipe:
  mypkg-queue:
    properties:
      type: "@azbake/ingredient-servicebus-queue"
      source: ""
      parameters:
        serviceBusNamespaceName: MyServiceBusName
        serviceBusQueueName: MyServiceBusQueueName
```


| property|required|description|
|---------|--------|-----------|
| serviceBusNamespaceName | yes | Name for the servicebus namespace resource |
| serviceBusQueueName | yes | Name for the servicebus queue resource |

## Utilities

Utility classes can be used inside of the bake.yaml file for parameter and source values.

### ``sb_queue`` class

|function|description|
|--------|-----------|
|create_resource_name()| Returns the name created for the traffic manager profile when deployed.|

### Function Details

#### create_resource_name()
Gets the name create for the traffic manager profile deployed.

```yaml
...
parameters:
    storageName: "[sb_queue.create_resource_name()]"
...
```

#### Returns
string
