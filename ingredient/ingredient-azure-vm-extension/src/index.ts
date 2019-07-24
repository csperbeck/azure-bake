import {AzureVMExtension} from './plugin'
import {VMExtUtils} from './functions'

/*  comment out these entries if you are not including an ingredient plugin runner*/
exports.plugin = AzureVMExtension
exports.pluginNS = "@azbake/ingredient-azure-vm-extension" //name of the ingredient to reference in a bake.yaml recipe

/* comment out these entries if you are not including a set of expression functions*/
exports.functions = VMExtUtils
exports.functionsNS = "vmextutils" //bake.yaml expressions can access your functions via "myutils.my_function()"
