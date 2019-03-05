FROM docker:stable-dind
COPY entrypoint.sh ./
RUN cd /usr/local && apk install git npm lerna --global && git clone https://github.com/HomecareHomebase/azure-bake.git
ENV BAKE_AUTH_SUBSCRIPTION_ID=$BAKE_AUTH_SUBSCRIPTION_ID
ENV BAKE_AUTH_SERVICE_ID=$BAKE_AUTH_SERVICE_ID
ENV BAKE_AUTH_SERVICE_KEY=$BAKE_AUTH_SERVICE_KEY
ENV BAKE_AUTH_TENANT_ID=$BAKE_AUTH_TENANT
ENV BAKE_ENV_NAME=Testing
ENV BAKE_ENV_CODE=TEST1
ENV BAKE_ENV_REGIONS={"name":"East US","code":"eus","shortName":"eastus"}
ENTRYPOINT ["/entrypoint.sh"]