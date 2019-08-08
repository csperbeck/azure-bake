import { AzureKubernetesService } from './plugin'
import { AzureKubernetesBaseUtils } from './functions'

exports.plugin = AzureKubernetesService
exports.pluginNS = "@azbake/ingredient-azure-kubernetes-service"
exports.functions = AzureKubernetesBaseUtils
exports.functionsNS = "aksutils"
