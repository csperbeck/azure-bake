const sb = require('azure/service-bus');
const ServiceBusManagementClient = sb.ServiceBusManagementClient;
const TokenCredentials = sb.TokenCredentials;

export class ServiceBusHelper {

    public sbLogin (token: string, subscriptionId: string, baseUri?: string): any {
        let creds = new TokenCredentials(token)
        let sbClient = new ServiceBusManagementClient (creds, subscriptionId, baseUri);
        return sbClient;
    }

}