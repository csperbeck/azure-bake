const core = require('@azbake/core');
const sb = require("@azure/service-bus");
const h = require('./helper')
const f = require('./functions')
const ns = require('@azbake/ingredient-service-bus-namespace')

const ARMHelper = core.ARMHelper;
const ARMTemplate = core.ARMTemplate;
const BaseIngredient = core.BaseIngredient;
const BaseUtility = core.BaseUtility;
const IngredientManager = core.IngredientManager;

export class ServiceBusQueue extends BaseIngredient {

    public async Execute(): Promise<void> {
        try {
            let ctxVars = this._ctx.Config.variables
            let util = IngredientManager.getIngredientFunction("coreutils", this._ctx)
            this._logger.log('Service Bus Queue Plugin Logging: ' + this._ingredient.properties.source)
            let nsName = ctxVars.name_space || ns.create_resource_name()
            let queueName = ctxVars.queue_name || this.create_resource_name()
            let baseUri = `https://${nsName}.servicebus.windows.net/${queueName}`
            let sbClient = h.sbLogin(this.context.AuthToken, this.context.Environment.authentication.subscriptionId, baseUri, )
            /*
            "lockDuration": "PT5M",
                        "maxSizeInMegabytes": "1024",
                        "requiresDuplicateDetection": "false",
                        "requiresSession": "false",
                        "defaultMessageTimeToLive": "P10675199DT2H48M5.4775807S",
                        "deadLetteringOnMessageExpiration": "false",
                        "duplicateDetectionHistoryTimeWindow": "PT10M",
                        "maxDeliveryCount": "10",
                        "autoDeleteOnIdle": "P10675199DT2H48M5.4775807S",
                        "enablePartitioning": "false",
                        "enableExpress": "false"
            */

            await sbClient.createOrUpdate(ctxVars.resourceGroup || ctxVars.rgOverride, nsName, queueName)

        } catch(error){
            this._logger.error('deployment failed: ' + error)
            throw error
        }
    }
}