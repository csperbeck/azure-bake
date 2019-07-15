import { BaseUtility, IngredientManager } from '@azbake/core'
import { ComputeManagementClient, VirtualMachines, ComputeManagementModels } from '@azure/arm-compute'
import { StorageManagementClient } from '@azure/arm-storage'
import { NetworkManagementClient, NetworkInterfaces } from '@azure/arm-network'
import { PublicIPAddress } from '@azure/arm-network/esm/models';
import { ImageReference } from '@azure/arm-compute/esm/models';

export class AzureVmUtils extends BaseUtility {

    public create_resource_name(appName?: string): string {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context)        
        const name = util.create_resource_name("vm", appName, false);
        return name;
    }

    public async get_private_ip(rg?: string, vm?: string): Promise<string> {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context);
        const resourceGroup = rg || util.resource_group()
        const vmName = vm || this.create_resource_name()
        let computeClient = new ComputeManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)
        let storageClient = new StorageManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)
        let networkClient = new NetworkManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)
        let vmResults = await computeClient.virtualMachines.get(resourceGroup, vmName) || {}
        let net = vmResults.networkProfile ? vmResults.networkProfile : NetworkProfile
        let netInterface = net.networkInterfaces[0].id
        let finalResult = await networkClient.networkInterfaces.get(resourceGroup, netId)
        let ip = finalResult.ipConfigurations[0].privateIPAddress || ""   
        return ip
    }

    public async get_public_ip(rg?: string, vm?: string): Promise<PublicIPAddress> {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context);
        const resourceGroup = rg || util.resource_group()
        const vmName = vm || this.create_resource_name()
        let computeClient = new ComputeManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)        
        let networkClient = new NetworkManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)
        let vmResults = await computeClient.virtualMachines.get(resourceGroup, vmName)
        let netId = vmResults.networkProfile.networkInterfaces[0].id.match(/([^\/]*)\/*$/)[1]
        let finalResult = await networkClient.networkInterfaces.get(resourceGroup, netId)
        let ip = finalResult.ipConfigurations[0].publicIPAddress || {}
        return ip
    }

    public async get_subnet(rg?: string, vm?: string): Promise<string> {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context);
        const resourceGroup = rg || util.resource_group()
        const vmName = vm || this.create_resource_name()
        let computeClient = new ComputeManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)        
        let networkClient = new NetworkManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)
        let vmResults = await computeClient.virtualMachines.get(resourceGroup, vmName)
        let netId = vmResults.networkProfile.networkInterfaces[0].id.match(/([^\/]*)\/*$/)[1] 
        let finalResult = await networkClient.networkInterfaces.get(resourceGroup, netId)
        let subnetArr = finalResult.ipConfigurations[0].subnet.id.split("/")
        let subnet = `${subnetArr[subnetArr.length-3]}/${subnetArr[subnetArr.length-1]}`
        return subnet
    }    

    public async get_os(rg?: string, vm?: string): Promise<ImageReference> {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context);
        const resourceGroup = rg || util.resource_group()
        const vmName = vm || this.create_resource_name()
        let computeClient = new ComputeManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)        
        let vmResults = await computeClient.virtualMachines.get(resourceGroup, vmName)
        let osInfo = vmResults.storageProfile.imageReference || {}
        return osInfo
    }

    public async get_os_type(rg?: string, vm?: string): Promise<string> {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context);
        const resourceGroup = rg || util.resource_group()
        const vmName = vm || this.create_resource_name()
        let computeClient = new ComputeManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)        
        let vmResults = await computeClient.virtualMachines.get(resourceGroup, vmName)
        let osInfo = vmResults.storageProfile.osDisk.osType || ""
        return osInfo
    }

    public async get_osdisk_size(rg?: string, vm?: string): Promise<string|number> {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context);
        const resourceGroup = rg || util.resource_group()
        const vmName = vm || this.create_resource_name()
        let computeClient = new ComputeManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)
        let storageClient = new StorageManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)
        let networkClient = new NetworkManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)
        let vmResults = await computeClient.virtualMachines.get(resourceGroup, vmName)        
        let osDiskSize = vmResults.storageProfile.osDisk.diskSizeGB || ""
        let osDiskName = vmResults.storageProfile.osDisk.name || ""
        return osDiskSize
    }

    public async get_vm_size(rg?: string, vm?: string): Promise<string|number> {
        let util = IngredientManager.getIngredientFunction("coreutils", this.context);
        const resourceGroup = rg || util.resource_group()
        const vmName = vm || this.create_resource_name()
        let computeClient = new ComputeManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)
        let storageClient = new StorageManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)
        let networkClient = new NetworkManagementClient(this.context.AuthToken, this.context.Environment.authentication.subscriptionId)
        let vmResults = await computeClient.virtualMachines.get(resourceGroup, vmName)        
        let vmSize = vmResults.hardwareProfile.vmSize || ""
        return vmSize
    }
    
}