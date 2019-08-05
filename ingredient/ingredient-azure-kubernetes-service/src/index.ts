import { AzureKubernetesService } from './plugin'
import { AzureKubernetesBaseUtils } from './functions'

exports.plugin = AzureKubernetesService
exports.pluginNS = "aks"

exports.functions = AzureKubernetesBaseUtils
exports.functionsNS = "aksutils"
