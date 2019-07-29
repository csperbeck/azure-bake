import { VirtualMachineExtensions } from './plugin'
import { VirtualMachineExtensionsUtils } from './functions'
exports.plugin = VirtualMachineExtensions
exports.pluginNS = "@azbake/ingredient-azure-vm-extension"
exports.functions = VirtualMachineExtensionsUtils
exports.functionsNS = "vmextutils"
