import { BaseUtility, IngredientManager } from '@azbake/core'
import { ContainerServiceClient } from "@azure/arm-containerservice"

export class AzureKubernetesBaseUtils extends BaseUtility {
    async getKey () {
        let containerClient: ContainerServiceClient = new ContainerServiceClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)
    }
    

}

