# Bake YAML

Here is a detailed reference guild to the bake.yaml file reference.

## Structure

a bake recipe is one or more ingredients that should be excuted for deployment. Ingredients may include local parameters, and the recipe itself may define global variables.

## Conventions

* To the left of `:` are literal keywords used in bake definitions.
* To the right of `:` are data types. These can be primitives like **string** or references to rich structures defined elsewhere in this topic.
* `[` *datatype* `]` indicates an array of the mentioned data type. For instance, `[ string ]` is an array of strings.
* `{` *datatype* `:` *datatype* `}` indicates a mapping of one data type to another. For instance, `{ string: string }` is a mapping of strings to strings.

## YAML basics

This document covers the schema of a Bake recipe YAML file.
To learn the basics of YAML, see [Learn YAML in Y Minutes](https://learnxinyminutes.com/docs/yaml/).
Note: Not all features are supported, such as functions.

## Recipe

```yaml
name: string
shortName: string
version: string
ingredients: [ ingredientTag ]
resourceGroup: bool
rgOverride: string | expression
parallelRegions: bool
variables: {string: string | variable}
recipe: {string: ingredient block}
```

| property | required | description|
|----------|----------|------------|
|name|yes|Descriptive name for recipe|
|shortName|yes|code use for resource naming [a-z][A-Z][0-9], 8 chars max|
|version|yes|version should match the docker tag|
|ingredients|yes|List of bake ingredients to use in the recipe|
|resourceGroup|no (default true)|Create a resource group for the recipe deployment |
|rgOverride|no (default blank)|Name of the resource group to create, if set. Otherwise standard format will be used|
|parallelRegions|no (default true)|Should all regions deploy in parallel or sequential|
|recipe|yes|list of ingredients and config to deploy|

### ingredientTag

```yaml
<name>@<version>
```

* name: name of bake recipe (npm pakage). i.e @azbake/ingredient-arm
* version: npm based version tag, supports ^ and ~ ranges: [npm semver](https://github.com/npm/node-semver#tilde-ranges-123-12-1). i.e ~1.0.0
* example: *@azbake/ingredient-arm@~1.0.0*

### variable

```yaml
string: string | expression
```

* *example: MY_VAR: test value*

### expression

```yaml
"[<utilgroup>.<method>(<parameters>)]"
```

An expression is a yaml string surrounded by square brakets `[]`. Within the expression you can eval simple javascript expressions and call any included ingredient utility group methods. See ingredient documentation for any utility group methods that are exposed. The expression result will become the value of the left side variable.

### ingredient block

An ingredient block describes an instance of an ingredient to deploy. It has a left side name key which must be unique within the recipe, followed by an ingredient schema described below.

```yaml
properties:
    type: string
    source: string
    parameters {string: variable}
dependsOn: [string]
```

| property | required | description|
|----------|----------|------------|
|type|yes|name of ingredient to deploy (check ingredient docs for name)|
|source|depends on ingredient|source file/option for some ingredients|
|parameters|depends on ingredient|check ingredient docs for parameter options|
|dependsOn|no|list of ingredient blocks that must be deployed before this block|

*note: ingredients are always deployed in parallel when possible, depending on dependency requirements*

### Bake.yaml Example

```yaml
name: My Package
shortName: mypkg
version: 1.0.0
ingredients:
  - "@azbake/ingredient-arm@~0"
  - "@azbake/ingredient-script@~0"
resourceGroup: true
rgOverride: "[coreutils.variable('rg_name')]"
parallelRegions: true
variables:
  rg_name: rg-override-test
recipe:
  custom-script:
    properties:
      type: "@azbake/ingredient-script"
      source: ./script.ts
      parameters:
        name: "[coreutils.create_storage_name('wpoctest1')]"
    dependsOn:
      - storage1
      - storage2
  storage1:
    properties:
      type: "@azbake/ingredient-arm"
      source: ./arm.json
      parameters:
        resource_name: "[coreutils.create_storage_name('wpoctest1')]"
  storage2:
    properties:
      type: "@azbake/ingredient-arm"
      source: ./arm2.json
      parameters:
        resource_name: "[coreutils.create_storage_name('wpoctest2')]"
```