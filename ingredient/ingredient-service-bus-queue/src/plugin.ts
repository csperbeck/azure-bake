const core = require('@azbake/core');
const h = require('./helper')
const f = require('./functions')
import { ServiceBusManagementClient, ServiceBusManagementModels, ServiceBusManagementMappers } from '@azure/arm-servicebus';
import { SBQueue } from '@azure/arm-servicebus/esm/models/mappers';
//const { ServiceBusClient } = require("@azure/service-bus"); 
//const nsing = require('@azbake/ingredient-service-bus-namespace')

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
            let ns = IngredientManager.getIngredientFunction("servicebusnamespace", this._ctx)
            let qe = IngredientManager.getIngredientFunction("servicebusnamespace", this._ctx)
            let nsName = 'ptstsbntstpkg'//ctxVars.name_space || ns.create_resource_name()         
            let queueName = 'sb-qe-charliedev' //ctxVars.queue_name || f.create_resource_name()
            let baseUri = `https://${nsName}.servicebus.windows.net/${queueName}`            
            let sbClient = new ServiceBusManagementClient(this._ctx.AuthToken, this._ctx.Environment.authentication.subscriptionId)                                  
            this._logger.log('Service Bus Queue Plugin Logging: ' + this._ingredient.properties.source)           
            
            /*{lockDuration: "PT5M",
                                 maxSizeInMegabytes: "1024",
                                 requiresDuplicateDetection: "false",
                                 requiresSession: "false",
                                 defaultMessageTimeToLive: "P10675199DT2H48M5.4775807S",
                                 deadLetteringOnMessageExpiration: "false",
                                 duplicateDetectionHistoryTimeWindow: "PT10M",
                                 maxDeliveryCount: "10",
                                 autoDeleteOnIdle: "P10675199DT2H48M5.4775807S",
                                 enablePartitioning: "false",
                                 enableExpressS: "false" }*/
            

            //await sbClient.queues.createOrUpdate(ctxVars.resourceGroup, nsName, queueName)

        } catch(error){
            this._logger.error('deployment failed: ' + error)
            throw error
        }
    }
}