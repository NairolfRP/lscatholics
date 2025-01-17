/*
|--------------------------------------------------------------------------
| Ally Oauth driver
|--------------------------------------------------------------------------
|
| Make sure you through the code and comments properly and make necessary
| changes as per the requirements of your implementation.
|
*/

import { ApiRequest, Oauth2Driver, RedirectRequest } from "@adonisjs/ally";
import type { HttpContext } from "@adonisjs/core/http";
import type {
    AllyDriverContract,
    AllyUserContract,
    ApiRequestContract,
    Oauth2AccessToken,
} from "@adonisjs/ally/types";
import env from "#start/env";

/**
 *
 * Access token returned by your driver implementation. An access
 * token must have "token" and "type" properties and you may
 * define additional properties (if needed)
 */
export type FacebrowserAccessToken = {
    token: string;
    type: "bearer";
    expiresAt: Exclude<Oauth2AccessToken["expiresAt"], undefined>;
};

/**
 * Scopes accepted by the driver implementation.
 */
export type FacebrowserScopes = string;

/**
 * The configuration accepted by the driver implementation.
 */
export type FacebrowserConfig = {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
    authorizeUrl?: string;
    accessTokenUrl?: string;
    userInfoUrl?: string;
};

/**
 * Driver implementation. It is mostly configuration driven except the API call
 * to get user info.
 */
export class Facebrowser
    extends Oauth2Driver<FacebrowserAccessToken, FacebrowserScopes>
    implements AllyDriverContract<FacebrowserAccessToken, FacebrowserScopes>
{
    /**
     * The URL for the redirect request. The user will be redirected on this page
     * to authorize the request.
     *
     * Do not define query strings in this URL.
     */
    protected authorizeUrl = `${env.get("FACEBROWSER_BASE_URL")}/api/oauth`;

    /**
     * The URL to hit to exchange the authorization code for the access token
     *
     * Do not define query strings in this URL.
     */
    protected accessTokenUrl = `${env.get("FACEBROWSER_BASE_URL")}/api/authorize`;

    /**
     * The URL to hit to get the user details
     *
     * Do not define query strings in this URL.
     */
    protected userInfoUrl = `${env.get("FACEBROWSER_BASE_URL")}/api/get_user_info`;

    /**
     * The param name for the authorization code. Read the documentation of your oauth
     * provider and update the param name to match the query string field name in
     * which the oauth provider sends the authorization_code post redirect.
     */
    protected codeParamName = "auth_key";

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
    protected stateCookieName = "Facebrowser_oauth_state";

    /**
     * Parameter name to be used for sending and receiving the state from.
     * Read the documentation of your oauth provider and update the param
     * name to match the query string used by the provider for exchanging
     * the state.
     */
    protected stateParamName = "";

    /**
     * Parameter name for sending the scopes to the oauth provider.
     */
    protected scopeParamName = "";

    /**
     * The separator indentifier for defining multiple scopes
     */
    protected scopesSeparator = " ";

    private facebrowserAccessTokenExpiration = 60 * 60 * 1000; // One hour

    constructor(
        ctx: HttpContext,
        public config: FacebrowserConfig,
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
    protected configureRedirectRequest(request: RedirectRequest<FacebrowserScopes>) {
        const currentParams = request.getParams();

        Object.keys(currentParams).map((p) => request.clearParam(p));

        request.param("app_id", this.config.clientId);
    }

    /**
     * Optionally configure the access token request. The actual request is made by
     * the base implementation of "Oauth2" driver and this is a hook to pre-configure
     * the request
     */
    protected configureAccessTokenRequest(request: ApiRequest) {
        const currentParams = request.getParams();

        Object.keys(currentParams).map((p) => request.clearParam(p));

        request.param("app_id", this.config.clientId);
        request.param("app_secret", this.config.clientSecret);
        request.param("auth_key", this.getCode());
    }

    /**
     * Fetches the user info
     */
    protected async getUserInfo(
        accessToken: string,
        callback?: (request: ApiRequestContract) => void,
    ) {
        const request = this.httpClient(this.config.userInfoUrl || this.userInfoUrl);

        request.param("access_token", accessToken);
        request.parseAs("json");

        if (typeof callback === "function") {
            callback(request);
        }

        const body = await request.get();

        const userInfo = body["user_info"];

        return {
            id: userInfo.user_id as string,
            email: null,
            emailVerificationState: "unsupported" as "verified" | "unverified" | "unsupported",
            nickName: userInfo.user_name as string,
            name: `${userInfo.user_firstname} ${userInfo.user_lastname}` as string,
            avatarUrl:
                userInfo.profile_picture === `${env.get("FACEBROWSER_BASE_URL")}/content/uploads/`
                    ? null
                    : (userInfo.profile_picture as string),
            original: {
                firstname: userInfo.user_firstname as string,
                lastname: userInfo.user_lastname as string,
                gender: userInfo.user_gender ?? null,
                birthdate: userInfo.user_birthdate ?? null,
                relationship: userInfo.user_relationship ?? null,
            },
        };
    }

    /**
     * Update the implementation to tell if the error received during redirect
     * means "ACCESS DENIED".
     */
    accessDenied() {
        return this.ctx.request.input("error") as boolean;
    }

    /**
     * Get the user details by query the provider API. This method must return
     * the access token and the user details both. Checkout the google
     * implementation for same.
     *
     * https://github.com/adonisjs/ally/blob/develop/src/Drivers/Google/index.ts#L191-L199
     */
    async user(
        callback?: (request: ApiRequestContract) => void,
    ): Promise<AllyUserContract<FacebrowserAccessToken>> {
        const accessToken = await this.accessToken(callback);

        const user = await this.getUserInfo(accessToken.token, callback);

        return {
            ...user,
            token: {
                ...accessToken,
                expiresAt: new Date(Date.now() + this.facebrowserAccessTokenExpiration),
            },
        };
    }

    async userFromToken(
        accessToken: string,
        callback?: (request: ApiRequestContract) => void,
    ): Promise<AllyUserContract<FacebrowserAccessToken>> {
        const user = await this.getUserInfo(accessToken, callback);

        return {
            ...user,
            token: {
                token: accessToken,
                type: "bearer" as const,
                expiresAt: new Date(Date.now() + this.facebrowserAccessTokenExpiration),
            },
        };
    }
}

/**
 * The factory function to reference the driver implementation
 * inside the "config/ally.ts" file.
 */
export function FacebrowserService(config: FacebrowserConfig): (ctx: HttpContext) => Facebrowser {
    return (ctx) => new Facebrowser(ctx, config);
}
