const core = require('@azbake/core')
const helper = require('./helper')
const ns = require('@azbake/ingredient-service-bus-namespace')

const BaseUtility = core.BaseUtility
const IngredientManager = core.IngredientManager


export class ServiceBusQueueUtils extends BaseUtility {

    public create_resource_name(app?: string): string {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context)
        const name = util.create_resource_name("sbn_q", app, false);
        return name;
    }

    public get_auth_rules(nsApp?: string, app?: string, rg: string = this.context.Config.variables.rgOverride): Array<string> {
        let nsName = ns.create_resource_name(nsApp)
        let queueName = this.create_resource_name(app)
        let baseUri = `https://${nsName}.servicebus.windows.net/${queueName}`
        let sbClient = helper.sbLogin(this.context.AuthToken, this.context.Environment.authentication.subscriptionId, baseUri)
        let authRules = sbClient.listAuthorizationRules(rg, nsName, queueName)
        let authRuleNames = authRules.from(x => x.name);
        return authRuleNames
    }

    public get_queue_keys(nsApp?: string, app?: string, rg: string = this.context.Config.variables.rgOverride, authRule?: string): Array<any> {
        let nsName = ns.create_resource_name(nsApp)
        let queueName = this.create_resource_name(app)
        let rule = this.get_auth_rules(nsApp, app, rg)
        let ruleMatch = rule[0]
        if (authRule) {
            rule.forEach(item => {
                if (item.match(authRule)) {
                    ruleMatch = item
                }
            });    
        }

        let baseUri = `https://${nsName}.servicebus.windows.net/${queueName}`
        let sbClient = helper.sbLogin(this.context.AuthToken, this.context.Environment.authentication.subscriptionId, baseUri)
        let queueKeys = sbClient.listKeys(rg, nsName, queueName, ruleMatch)
        //Returns Servicebus AccessKeys object
        return queueKeys
    }
}