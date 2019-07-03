import {BaseUtility, IngredientManager} from '@azbake/core'
import { ApiManagementClient } from "@azure/arm-apimanagement"

export class ApimBaseUtil extends BaseUtility {

    public create_resource_name(): string {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context);
        const name = util.create_resource_name("vm", null, false);
        return name;
    }
}