import { BaseUtility, IngredientManager } from '@azbake/core'
import { ServiceBusManagementClient } from '@azure/arm-servicebus'
/*"outputs": {
      "NamespaceConnectionString": {
        "type": "string",
        "value": "[listkeys(variables('authRuleResourceId'), '2017-04-01').primaryConnectionString]"
      },
      "SharedAccessPolicyPrimaryKey": {
        "type": "string",
        "value": "[listkeys(variables('authRuleResourceId'), '2017-04-01').primaryKey]"
      }
    }*/

export class ServiceBusQueueUtils extends BaseUtility {

public create_resource_name(): string {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context)
        const name = util.create_resource_name("sb_ns", null, false);
        return name;
}

    public async get_queue_pk(ns: string, name: string, authRule: string, rg: string) {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context)
        let resource_group = rg || await util.resource_group()

       const client = new ServiceBusManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId);
       let response = await client.queues.listKeys(rg, ns, name, authRule);

       let key: string = ""
        if (response.keys) {
            key = response.keys[0].value || ""
        }
        return key        
    }
   
    public async get_queue_authrule(ns: string, name: string, authRule: string, rg: string) {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context)
        let resource_group = rg || await util.resource_group()

       const client = new ServiceBusManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId);
       let response = await client.queues.listAuthorizationRules(rg, ns, name);

       let key: string = ""
        if (response.keys) {
            rule = response.keys[0].value || ""
        }
        return rule
    }
}