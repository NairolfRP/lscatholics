import { HttpContext } from "@adonisjs/core/http";
import type { Character, UserSocialInfo } from "../types/user_social_info.d.ts";
import { inject } from "@adonisjs/core";

@inject()
export default class CharacterService {
    constructor(protected ctx: HttpContext) {}

    public async getCurrentCharacter(): Promise<Character | null> {
        const { auth, session } = this.ctx;

        if (!(await auth.check()) || !session.has("user_social_info")) return null;

        const userSocialInfo = session.get("user_social_info") as UserSocialInfo;

        return (
            userSocialInfo.characters.find((char) => char.id === userSocialInfo.currentCharacter) ||
            null
        );
    }

    public async syncCurrentCharacterWithRequestBody(): Promise<boolean> {
        const currentCharacter = await this.getCurrentCharacter();

        if (!currentCharacter) return false;

        this.ctx.request.body().firstname = currentCharacter.firstname;
        this.ctx.request.body().lastname = currentCharacter.lastname;
        return true;
    }
}
