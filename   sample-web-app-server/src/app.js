import express from "express";
import cors from "cors";
import https from "https";
import { config } from "./configuration.js";
import { fetchAuthToken, fetchJwtToken } from "./utils/token-management.js";
import { LogFormat } from "./utils/logging.js";
import { loadSslCertificateDetails } from "./utils/certificate-management.js";

const corsConfig = {
    origin: config.server.allowedOrigins.includes("*") ? "*" : config.server.allowedOrigins
}

const app = express();

app.disable('x-powered-by');
app.use(express.json());

/**
 * POST /token API is used by the clients to fetch JWT token which is required by SDKs to function.
 */
app.route('/token')
    .options(cors(corsConfig))
    .post(cors(corsConfig), async (request, response) => {
        /**
         * POST /token request body: Details of the User for which JWT is requested.
         * @typedef UserDetails
         * @property {string} userId Unique ID for the particular user for which JWT is requested.
         * @property {string} [userName] Name of the user for which JWT is requested (optional).
         * @property {Record<string, Array<string>>} [userIdentifiers] Map of identifier type and list of identifiers for the User for which JWT is requested. Each entry is a type of identifier ex. emailAddresses and values are the list of identifiers of that type.
         * @property {boolean} [verified] Whether the User is a verified User as per the Client.
         */

        /**
         * POST /token response body: JWT and other tenant specific details.
         * @typedef TokenDetails
         * @property {string} jwtToken The JWT token.
         * @property {string} axpIntegrationId Integration ID of the AXP tenant.
         * @property {string} axpHostName Host name of AXP to connect.
         */

        console.log(LogFormat.info(`${request.method} ${request.path}`));

        /**
         * @type UserDetails
         */
        const userDetails = request.body;

        // Since `userId` field is mandatory in the request body, validate if it is present
        // In the request body. 
        if (!(userDetails && typeof userDetails.userId === 'string')) {
            if (!userDetails) { 
                console.log(LogFormat.warn("Invalid request: Expected body in request, got none")); 
            }
            else { 
                console.log(LogFormat.warn(`Invalid request: Expected userId in body to be string, received ${typeof userDetails.userId}`)); 
            }

            response.status(400).send({
                title: "Constraint violation",
                status: "400",
                violations: [{
                    field: "userId",
                    message: "userId is mandatory and should be a string"
                }]
            });
            return;
        }

        console.log(LogFormat.info(`Generating JWT for userId: ${userDetails.userId}`));

        try {
            /**
             * Generating the access token required to use the AXP APIs.
             * Refer to this website for more details: https://developers.avayacloud.com/avaya-experience-platform/reference/postgeneratetoken
             */
            const hostName = config.axp.hostName;
            const axpRegion = config.axp.axpRegion;
            const accountId = config.axp.accountId;
            const clientId = config.axp.clientId;
            const clientSecret = config.axp.clientSecret;
			const jwtValidityInterval = config.axp.jwtValidityInterval;
			const integrationId = config.axp.integrationId;
            const fcmConnectorBaseUrl = config.axp.fcmConnectorBaseUrl;
            const pushConfigId = config.axp.configId;
            const appKey = config.axp.appKey;
            const authToken = await fetchAuthToken(hostName, accountId, clientId, clientSecret);
            
            console.log(LogFormat.info("Fetched auth token."));

            /**
             * Generating JWT token for the requested user.
             * Refer to this website for more details: https://developers.avayacloud.com/avaya-experience-platform/reference/generatedigitalchattoken
             */
            const jwtToken = await fetchJwtToken({
                customerId: userDetails.userId,
                customerName: userDetails.userName,
                customerIdentifiers: userDetails.userIdentifiers,
                verifiedCustomer: userDetails.verified,
            }, hostName, axpRegion, accountId, integrationId, jwtValidityInterval, authToken);
            console.log(LogFormat.info(`Fetched JWT for userId: ${userDetails.userId}`));
			console.log(LogFormat.info(`Fetched JWT for customerIdentifiers: ${userDetails.userIdentifiers}`));

            /** @type TokenDetails */
            const responseBody = {
                jwtToken: jwtToken,
                axpIntegrationId: integrationId,
                axpHostName: hostName,
                axpRegion: axpRegion,
                fcmConnectorBaseUrl: fcmConnectorBaseUrl,
                configId: pushConfigId,
                appKey: appKey
            };
            
            response.json(responseBody);

        } catch (error) {
            let responseMessage = "Unexpected error occurred while generating JWT token";
            
            if ("cause" in error && error.cause.error instanceof Error) {
                
                /**
                 * {@link error.cause} will have the details and the name of the underlying that failed.
                 * @type {{error: Error, api: string}}
                 */
                const cause = error.cause;
                const failedApiName = cause.api;

                responseMessage = `Unexpected error occurred while fetching ${failedApiName}.`;
                
                if (("cause" in cause.error) && ("invalidResponse" in cause.error.cause)) {
                    responseMessage = `${responseMessage} ${cause.error.message}`;
                } 
            }
            
            console.error(LogFormat.error(responseMessage), error);

            response
                .status(500)
                .send({
                    title: "Server Error",
                    status: 500,
                    detail: responseMessage
                });
        }
    });

const server = (() => {
    // HTTPS mode.
    if (config.server.ssl) {
        // Load the SSL certificates and related details.
        const sslCertificateDetails = loadSslCertificateDetails(config.server.sslCertificatePath, config.server.sslPrivateKeyPath);
    
        const httpsServer = https.createServer({
            cert: sslCertificateDetails.certificate,
            key: sslCertificateDetails.privateKey,
            passphrase: config.server.sslPassPhrase
        }, app);

        // Start listening for requests on the configured port. 
        httpsServer.listen(config.server.port, () => {
            console.log(`[HTTPS] Sample Token Server started on port: ${config.server.port}`);
        });

        return httpsServer;
        
    } 

    // HTTP mode.
    else {
        // Start listening for requests on the configured port. 
        return app.listen(config.server.port, () => {
            console.log(`[HTTP] Sample Token Server started on port: ${config.server.port}`);
        });
    }
})();
