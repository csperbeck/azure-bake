import { ServiceBusQueuePlugIn } from './plugin'
import { ServiceBusQueueUtils } from './functions'

exports.plugin = ServiceBusQueuePlugIn
exports.pluginNS = "@azbake/ingredient-service-bus-namespace"

exports.functions = ServiceBusQueueUtils
exports.functionsNS = "sb_queue"
