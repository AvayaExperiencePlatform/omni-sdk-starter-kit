/**
 * Fetch the Auth token required to use the AXP APIs.
 * 
 * @param {string} axpHostName Host name of AXP.
 * @param {string} axpAccountId The Account Id to use.
 * @param {string} axpClientId Client ID required to authenticate AXP APIs.
 * @param {string} axpClientSecret Secret for the {@link axpClientId} used to authenticate AXP APIs.
 * @param {string} appKey API App Key.
 * @returns {Promise<string>} A promise that resolves to the string access token.
 */
export async function fetchAuthToken(
    axpHostName,
    axpAccountId,
    axpClientId,
    axpClientSecret,
    appKey,
) {
    const URL = `https://${axpHostName}/api/auth/v1/${axpAccountId}/protocol/openid-connect/token`;
    
    const requestBody = new URLSearchParams();
    requestBody.append("grant_type", "client_credentials");
    requestBody.append("client_id", axpClientId);
    requestBody.append("client_secret", axpClientSecret);

    try {
        const response = await fetch(URL, {
            method: 'POST',
            body: requestBody,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'appKey': appKey,
            },
            keepalive: true
        });

        const responseBodyText = await response.text();
        
        if (response.status !== 200) {
            throw new Error(
                `Expected 200 from server but got ${response.status}.`, 
                {cause: {
                    invalidResponse: true,
                    apiResponseBody: responseBodyText,
                    apiResponseStatus: response.status
                }}
            );
        }

        const responseBody = JSON.parse(responseBodyText);

        if (!(responseBody && responseBody.access_token)) {
            throw new Error(
                `Expected response to contain auth token, received none`,
                {cause: {
                    invalidResponse: true,
                    apiResponseBody: responseBody,
                    apiResponseStatus: response.status
                }}
            );
        }

        return responseBody.access_token;
    } catch (error) {
        throw new Error("Error occurred while fetching Auth token", {
            cause: {
                error: error,
                api: "authToken"
            }
        });
    }
}

/**
 * @typedef CustomerDetails
 * @property {string} customerId The Unique id of the customer for which JWT is required.
 * @property {string} customerName Name of the customer.
 * @property {Record<string, string[]>} customerIdentifiers Map of customer identifier type -> Array customerIdentifiers of that type.
 * @property {boolean} verifiedCustomer Whether the customer is verified of not. 
 */

/**
 * 
 * @param {CustomerDetails} customerDetails 
 * @param {string} axpHostName Host name of AXP.
 * @param {*} axpAccountId The Account Id to use.
 * @param {*} axpIntegrationId The Integration ID available to your account administrator when the integration was created.
 * @param {*} requiredJwtValidity TTL of JWT to be requested. Min 15 mins, Max 60 mins.
 * @param {*} authToken Auth token required to make AXP API calls.
 * @param {*} appKey API App Key.
 * @returns {Promise<string>} JWT toke for the requested user.
 */
export async function fetchJwtToken(
    customerDetails,
    axpHostName,
    axpRegion,
    axpAccountId,
    axpIntegrationId,
    requiredJwtValidity,
    authToken,
    appKey,
) {

    const URL = axpHostName ? `https://${axpHostName}/api/digital/chat/v1/accounts/${axpAccountId}/tokens` : `https://${axpRegion}.cc.avayacloud.com/api/digital/chat/v1/accounts/${axpAccountId}/tokens`;

    const requestBody = {
        ...customerDetails,
        integrationId: axpIntegrationId,
        ttl: requiredJwtValidity,
    }

    try {
        const response = await fetch(URL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
                'appKey': appKey,
            }
        });

        const responseBodyText = await response.text();
		
        if (response.status !== 201) {
            throw new Error(
                `Expected 201 from server but got ${response.status}.`, 
                {cause: {
                    invalidResponse: true,
                    apiResponseBody: responseBodyText,
                    apiResponseStatus: response.status
                }}
            );
        }

        const responseBody = JSON.parse(responseBodyText);

        if (!(responseBody && responseBody.jwtToken)) {
            throw new Error(
                `Expected response to contain JWT token, received none`,
                {cause: {
                    invalidResponse: true,
                    apiResponseBody: responseBody,
                    apiResponseStatus: response.status
                }}
            );
        }

        return responseBody.jwtToken;
    } catch (error) {
        throw new Error("Error occurred while fetching JWT token", {
            cause: {
                error: error,
                api: "jwtToken"
            }
        })
    }
}