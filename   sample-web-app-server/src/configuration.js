/** All configurations of the Sample Token Server */
export const config = {
    /** Properties specific to Sample Token Server. */
    server: {
        /** The port on which the Sample Token Server server will listen for incoming HTTP requests. */
        port: 3000,
 
        /** 
         * An Array of origins allowed by this server. This is required for CORS. 
         * Typically the URL of the website hosting the chat widget. 
         * For example - `["http://www.example.com"]`. Use `["*"]` for allowing all origins. 
         */
        allowedOrigins: ["*"],
        /** This configuration controls whether the server is started in HTTPS mode or normal HTTP mode. Value should be `true` to start this server in HTTPS mode. `false` for starting in HTTP mode. */
        ssl: false,
 
        /** Path to the SSL certificate required for HTTPS. Required if {@link config.server.ssl} is true. */
        sslCertificatePath: "",
 
        /** Path to the private key required for decrypting SSL certificate. Required if {@link config.server.ssl} is true. */
        sslPrivateKeyPath: "",
 
        /** Passphrase required for required for decrypting SSL certificate. Required if {@link config.server.ssl} is true. */
        sslPassPhrase: "",
    },
 
    /** AXP related configuration. */
    axp: {
        /** Host region specific to AXP. For example - `na.api.avayacloud.com` for North America region */
        hostName: "<Host Name>",

        /** The unique 6 character internal id that represents the AXP customer account. */
        accountId: "<Account Id>",

        /** Client ID required to authenticate AXP APIs. */
        clientId: "<Client Id>",

        /** Secret for the above Client ID ({@link config.axp.clientId}) used to authenticate AXP APIs. */
        clientSecret: "<Cliet Secret>",
        
        /** API App Key */
        appKey: "<App Key>",

        /** The unique 36 character Integration ID available to your account administrator when the integration was created. */
        integrationId: "<Integration Id>",

        /** Time to live for the JWT token, in minutes. Min 15 mins, Max 60 mins. */
        jwtValidityInterval: 15,
		
		/** Push Notification Config ID */
		configId: "<Config Id>",

        /** Base URL of Sample FCM Based Push Notification Connector */
		fcmConnectorBaseUrl: "<Sample FCM Connector Base Url>"

        /**
         * The remote address (typically a phone number) used for placing voice
         * calls to your contact center. This field is only used by the SDK's
         * calling module.
         */
        callingRemoteAddress: "<Phone Number>"
    },
}