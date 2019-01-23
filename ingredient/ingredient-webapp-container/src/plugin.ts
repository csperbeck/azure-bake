import { ResourceManagementClient } from "@azure/arm-resources";
import { Deployment, DeploymentProperties } from "@azure/arm-resources/esm/models";
import { BaseIngredient, IngredientManager } from "@azbake/core"
import { IIngredient,  DeploymentContext } from "@azbake/core";

import arm from './arm.json';

export class WebAppContainer extends BaseIngredient {
    constructor(name: string, ingredient: IIngredient, ctx: DeploymentContext) {
        super(name, ingredient, ctx);
    }

    public async Execute(): Promise<void> {

        let util = IngredientManager.getIngredientFunction("coreutils", this._ctx);

        try {

            this._logger.log('starting arm deployment for web-app-container');

            //build the properties as a standard object.
            let props : any = {};

            this._ingredient.properties.parameters.forEach( (v,n)=>
            {
                props[n] = {
                    "value": v.value(this._ctx)
                };
                let p = `${n}=${v.value(this._ctx)}`;
                this._logger.log(`param: ${p}`);
            });
            
            props["app_service_name"] = util.create_resource_name("appsvc", null, true);
            props["webapp_name"] = util.create_resource_name("webapp", null, true);

            let deployment = <Deployment>{
                properties : <DeploymentProperties>{
                    template: arm,
                    parameters: props,
                    mode: "Incremental"               
                }
            };

            let client = new ResourceManagementClient(this._ctx.AuthToken, this._ctx.Environment.authentication.subscriptionId);

            this._logger.log("validating deployment...");
            let validate = await client.deployments.validate(util.resource_group(), this._name, deployment);
            if (validate.error)
            {
                let errorMsg = `Validation failed (${(validate.error.code || "unknown")})`;
                if (validate.error.target){
                    errorMsg = `${errorMsg}\nTarget: ${validate.error.target}`;
                }
                if (validate.error.message) {
                    errorMsg = `${errorMsg}\nMessage: ${validate.error.message}`;
                }
                if (validate.error.details){
                    errorMsg = `${errorMsg}\nDetails:`;
                    validate.error.details.forEach(x=>{
                        errorMsg = `${errorMsg}\n${x.message}`;
                    });
                }

                this._ctx.Logger.error(errorMsg);
                throw new Error('validate failed');
            }

            this._logger.log("starting deployment...");
            let result = await client.deployments.createOrUpdate(util.resource_group(), this._name, deployment);
            if ( result._response.status >299){
                throw new Error(`ARM error ${result._response.bodyAsText}`);
            }

            this._logger.log('deployment finished');
        } catch(error){
            this._logger.error(`deployment failed: ${error}`);
            throw error;
        }
    }
}