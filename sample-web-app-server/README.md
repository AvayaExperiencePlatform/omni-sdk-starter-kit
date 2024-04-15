# Sample Web App Server (Token Server)

SDK requires a JSON Web Token (JWT) to initialize and connect to Avaya Experience Platform™ Digital services. A unique token must be used for each end user (your customers using the chat client). Since your backend web application is aware of the user using your services, it should securely fetch the token from Avaya Experience Platform™ Digital for the user whenever your web page requires it.

This reference application is a simple Express JS web server which illustrates the flow of procuring a unique JWT token for an end user.

> ⚠ WARNING
>
> This application is provided as a sample for the purpose of **reference only** and shouldn't be used in production. Existing production provisioning may impact to Sample Code’s expected working.

## Setup

The Sample Token Server requires Node JS version `v20.9.0 LTS` or above.

1. Run `npm install`

2. Make appropriate configuration changes in the file `src/configuration.js`.

## Start server

Once the configuration changes are done, to start server run `npm start`.

### For starting server in HTTP

For starting server in HTTP mode, make the `ssl` flag false in the `src/configuration.js` file, in the `server` related configuration section.

### For starting server in HTTPS mode

For starting server in HTTPS mode, make the `ssl` flag true in the `src/configuration.js` file, in the `server` related configuration section.

For HTTPS mode, make sure that the `certificatePath` and `privateKeyPath` configurations points to the location of SSL certificate and its private key, and the `passPhrase` is the correct pass phrase which was used to create the private key. These configurations are also present in the `server` related configuration section in the config file.

### For fetching a token

The server starts listening to HTTP requests (by default on port 3000). To fetch JWT, use the following URL:
http://<server-hostname>:<server.port>/token

### Debugging mode

To see all the internal debug logs of the Express JS please start the server with the following command - `npm run start:debug`.

**Note:** If you are running the Sample Token Server on Windows, please start the server with this command instead - `npm run start:debug-windows`.

## Configuration Reference

All configurations are present in the `src/configuration.js` file.

### `server`

These are the configurations related to the Sample Token Server. Following are the configuration options.

1. `port` : The port on which the Sample Token Server server will listen for incoming HTTP requests. Default value is `3000`.
2. `allowedOrigins` : An Array of origins allowed by this server. This is required for CORS. Typically the URL of the website hosting the chat widget. For example `["http://www.example.com"]`. Use `["*"]` for allowing all origins. Default value is `["*"]`.
3. `ssl`: This configuration controls whether the server is started in HTTPS mode or normal HTTP mode. Make this `true` to start this server in HTTPS mode. `false` for starting in HTTP mode. Default value is `false`.
4. `sslCertificatePath` : Path to the SSL certificate required for HTTPS. Required if `server.ssl` is true. Default value is `""` (empty string).
5. `sslPrivateKeyPath` : Path to the private key required for decrypting SSL certificate. Required if `server.ssl` is true. Default value is `""` (empty string).

### `axp`

These are AXP account related configurations required to access the AXP APIs. Following are the configuration options.

1. `accountId` : The unique 6 character internal id that represents the AXP customer account.
2. `hostName` : Host region specific to AXP. For example - `na.api.avayacloud.com` for North America region.
3. `integrationId` : The unique 36 character Integration ID available to your account administrator when the integration was created.
4. `clientId` : Client ID required to authenticate AXP APIs.
5. `clientSecret` : Secret for the above Client ID (`axp.clientId`) used to authenticate AXP APIs.
6. `jwtValidityInterval` : Time to live for the JWT token, in minutes. Min 15 mins, Max 60 mins. Default value is `30`.
7. `appKey` : API App Key required to authenticate AXP APIs.
