/*
|--------------------------------------------------------------------------
| Ally Oauth driver
|--------------------------------------------------------------------------
|
| Make sure you through the code and comments properly and make necessary
| changes as per the requirements of your implementation.
|
*/

/**
 |--------------------------------------------------------------------------
 *  GTA World Oauth driver
 |--------------------------------------------------------------------------
 */

import { Oauth2Driver, RedirectRequest } from "@adonisjs/ally";
import type { HttpContext } from "@adonisjs/core/http";
import type {
    AllyDriverContract,
    AllyUserContract,
    ApiRequestContract,
} from "@adonisjs/ally/types";
import env from "#start/env";

/**
 *
 * Access token returned by your driver implementation. An access
 * token must have "token" and "type" properties, and you may
 * define additional properties (if needed)
 */
export type GTAWorldDriverAccessToken = {
    token: string;
    type: "bearer";
};

/**
 * Scopes accepted by the driver implementation.
 */
export type GTAWorldDriverScopes = string;

/**
 * The configuration accepted by the driver implementation.
 */
export type GTAWorldDriverConfig = {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    authorizeUrl?: string;
    accessTokenUrl?: string;
    userInfoUrl?: string;
    scopes?: string[];
};

export type GTAWorldUser = {
    id: number;
    username: string;
    confirmed: 0 | 1;
    role: {
        id: number;
        user_id: number;
        role_id: string;
        server: number;
    };
    character: GTAWorldCharacter[];
};

export type GTAWorldCharacter = {
    id: number;
    memberid: number;
    firstname: string;
    lastname: string;
};

export type GTAWorldDriverUserInfo = {
    user: GTAWorldUser;
};

/**
 * Driver implementation. It is mostly configuration driven except the API call
 * to get user info.
 */
export class GTAWorldDriver
    extends Oauth2Driver<GTAWorldDriverAccessToken, GTAWorldDriverScopes>
    implements AllyDriverContract<GTAWorldDriverAccessToken, GTAWorldDriverScopes>
{
    protected GTAWUCPBaseUrl = env.get("GTAW_UCP_BASE_URL") || "https://ucp.gta.world";

    /**
     * The URL for the redirect request. The user will be redirected on this page
     * to authorize the request.
     *
     * Do not define query strings in this URL.
     */
    protected authorizeUrl = `${this.GTAWUCPBaseUrl}/oauth/authorize`;

    /**
     * The URL to hit to exchange the authorization code for the access token
     *
     * Do not define query strings in this URL.
     */
    protected accessTokenUrl = `${this.GTAWUCPBaseUrl}/oauth/token`;

    /**
     * The URL to hit to get the user details
     *
     * Do not define query strings in this URL.
     */
    protected userInfoUrl = `${this.GTAWUCPBaseUrl}/api/user`;

    /**
     * The param name for the authorization code. Read the documentation of your oauth
     * provider and update the param name to match the query string field name in
     * which the oauth provider sends the authorization_code post redirect.
     */
    protected codeParamName = "code";

    /**
     * The param name for the error. Read the documentation of your oauth provider and update
     * the param name to match the query string field name in which the oauth provider sends
     * the error post redirect
     */
    protected errorParamName = "error";

    /**
     * Cookie name for storing the CSRF token. Make sure it is always unique. So a better
     * approach is to prefix the oauth provider name to `oauth_state` value. For example:
     * For example: "facebook_oauth_state"
     */
    protected stateCookieName = "GTAWorldDriver_oauth_state";

    /**
     * Parameter name to be used for sending and receiving the state from.
     * Read the documentation of your oauth provider and update the param
     * name to match the query string used by the provider for exchanging
     * the state.
     */
    protected stateParamName = "state";

    /**
     * Parameter name for sending the scopes to the oauth provider.
     */
    protected scopeParamName = "scope";

    /**
     * The separator indentifier for defining multiple scopes
     */
    protected scopesSeparator = " ";

    constructor(
        ctx: HttpContext,
        public config: GTAWorldDriverConfig,
    ) {
        super(ctx, config);

        /**
         * Extremely important to call the following method to clear the
         * state set by the redirect request.
         *
         * DO NOT REMOVE THE FOLLOWING LINE
         */
        this.loadState();
    }

    /**
     * Optionally configure the authorization redirect request. The actual request
     * is made by the base implementation of "Oauth2" driver and this is a
     * hook to pre-configure the request.
     */
    protected configureRedirectRequest(request: RedirectRequest<GTAWorldDriverScopes>) {
        request.param("grant_type", "authorization_code");
        request.param("response_type", "code");
        request.scopes(this.config.scopes || []);
    }

    /**
     * Optionally configure the access token request. The actual request is made by
     * the base implementation of "Oauth2" driver and this is a hook to pre-configure
     * the request
     */
    // protected configureAccessTokenRequest(request: ApiRequest) {}

    /**
     * Returns the HTTP request with th authorization header set
     */
    protected getAuthenticatedRequest(url: string, token: string) {
        const request = this.httpClient(url);
        request.header("Authorization", `Bearer ${token}`);
        request.header("Accept", "application/json");
        request.parseAs("json");
        return request;
    }

    protected async getUserInfo(token: string, callback?: (request: ApiRequestContract) => void) {
        const request = this.getAuthenticatedRequest(
            this.config.userInfoUrl || this.userInfoUrl,
            token,
        );
        if (typeof callback === "function") {
            callback(request);
        }

        const original = (await request.get()) as GTAWorldDriverUserInfo;
        const user = original.user;
        const character = original.user.character[0];

        return {
            id: user.id.toString(),
            nickName: `${character.firstname} ${character.lastname}`,
            name: user.username,
            email: null,
            emailVerificationState: "unsupported" as "verified" | "unverified" | "unsupported",
            avatarUrl: null,
            original,
        };
    }

    /**
     * Update the implementation to tell if the error received during redirect
     * means "ACCESS DENIED".
     */
    accessDenied() {
        const error = this.getError();
        if (!error) {
            return false;
        }
        return error === "user_denied";
    }

    /**
     * Get the user details by query the provider API. This method must return
     * the access token and the user details both. Checkout the Google
     * implementation for same.
     *
     * https://github.com/adonisjs/ally/blob/develop/src/Drivers/Google/index.ts#L191-L199
     */
    async user(
        callback?: (request: ApiRequestContract) => void,
    ): Promise<AllyUserContract<GTAWorldDriverAccessToken>> {
        const token = await this.accessToken(callback);
        const user = await this.getUserInfo(token.token, callback);
        return {
            ...user,
            token,
        };
    }

    async userFromToken(
        token: string,
        callback?: (request: ApiRequestContract) => void,
    ): Promise<AllyUserContract<{ token: string; type: "bearer" }>> {
        const user = await this.getUserInfo(token, callback);

        return {
            ...user,
            token: { token, type: "bearer" as const },
        };
    }
}

/**
 * The factory function to reference the driver implementation
 * inside the "config/ally.ts" file.
 */
export function GTAWorldDriverService(
    config: GTAWorldDriverConfig,
): (ctx: HttpContext) => GTAWorldDriver {
    return (ctx) => new GTAWorldDriver(ctx, config);
}
