import { VirtualMachineExtensions} from './plugin'
import {VirtualMachineExtensionsUtils} from './functions'

exports.plugin = VirtualMachineExtensions
exports.pluginNS = "@azbake/ingredient-azure-vm-extension" //name of the ingredient to reference in a bake.yaml recipe
<<<<<<< HEAD
exports.functions = VirtualMachineExtensionsUtils
exports.functionsNS = "vmextensionsutility" //bake.yaml expressions can access your functions via "myutils.my_function()"
=======

/* comment out these entries if you are not including a set of expression functions*/
exports.functions = VMExtUtils
exports.functionsNS = "vmextutils" //bake.yaml expressions can access your functions via "myutils.my_function()"
>>>>>>> added framework logic to construct portions of the ARM template based on recipe parameters
