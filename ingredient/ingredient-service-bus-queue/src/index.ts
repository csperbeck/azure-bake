import { ServiceBusQueue } from './plugin'
import { ServiceBusQueueUtils } from './functions'

exports.plugin = ServiceBusQueue
exports.pluginNS = "@azbake/ingredient-service-bus-namespace"

 //Allows bake.yaml to access your functions via "sb_queue.my_function()"
exports.functions = ServiceBusQueueUtils
exports.functionsNS = "sb_queue"
