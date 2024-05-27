/** 
 * All configurations of the Sample Token Server 
 */
export const config = {
    /** Properties specific to Sample Token Server. */
    server: {
        /** 
         * The port on which the Sample Token Server server will listen for incoming HTTP requests. 
         */
        port: 3000,
 
        /** 
         * An Array of origins allowed by this server. This is required for CORS. 
         * 
         * Typically the URL of the website hosting the messaging widget. 
         * For example - `["http://www.example.com"]`. Use `["*"]` for allowing all origins. 
         */
        allowedOrigins: ["*"],

        /** 
         * Controls whether the server is started in HTTPS mode or normal HTTP mode. 
         * 
         * Value should be `true` to start this server in HTTPS mode. `false`
         * for starting in HTTP mode. 
         */
        ssl: false,
 
        /** 
         * Path to the SSL certificate required for HTTPS. 
         * Required if {@link config.server.ssl} is true. 
         */
        sslCertificatePath: "",
 
        /** 
         * Path to the private key required for decrypting SSL certificate. 
         * Required if {@link config.server.ssl} is true. 
         */
        sslPrivateKeyPath: "",
 
        /** 
         * Passphrase required for required for decrypting SSL certificate. 
         * Required if {@link config.server.ssl} is true. 
         */
        sslPassPhrase: "",
    },
 
    /** AXP-related configuration. */
    axp: {
        /** 
         * Hostname of the regional AXP server to connect to. 
         * 
         * For example - `na.api.avayacloud.com` for North America region 
         */
        hostName: "<Host Name>",

        /** 
         * The unique 6 character AXP customer account ID. 
         */
        accountId: "<Account Id>",
        
        /**
         * The 36 character integration ID that your app will connect through.
         *
         * This is obtained from your account administrator when setting up an
         * AXP SDK integration.
         */
        integrationId: "<Integration Id>",

        /** 
         * Client ID used to obtain an access token that will be used by the
         * client to authenticate with AXP APIs.
         */
        clientId: "<Client Id>",
        
        /** 
         * Secret for the above Client ID ({@link config.axp.clientId}). 
         */
        clientSecret: "<Client Secret>",
        
        /**
         * The application key used to authenticate your application with AXP.
         *
         * This key is received along with your client ID and client secret when
         * registering an application with AXP. This must be included in the
         * `appkey` HTTP header for all AXP requests.
         */
        appKey: "<App Key>",
        
        /** 
         * Time to live for the JWT token to be used by the client, in minutes. 
         * Must be between 15 and 60 minutes.
         * 
         * Once this token expires the client application will need to request
         * a new token to continue using the AXP Omni SDK.
         */
        jwtValidityInterval: 15,
        
        /**
         * The remote address (typically a phone number) used for placing voice
         * calls to your contact center. This field is only used by the SDK's
         * calling module.
         */
        callingRemoteAddress: "<Phone Number>",

        /**
         * Base URL of the Sample Firebase Cloud Messaging connector used by 
         * the mobile messaging demo application.
         *
         * This is used to register the device's push token to be able to
         * receive push notifications from Firebase.
         */
        fcmConnectorBaseUrl: "<Sample FCM Connector Base URL>",

        /**
         * The AXP Push notification configuration ID used to receive messaging push
         * notifications.
         * 
         * This ID is obtained from your account administrator when setting up an
         * AXP SDK Push Notification Configuration.
         */
        configId: "<Push Notification Config Id>",
    },
}