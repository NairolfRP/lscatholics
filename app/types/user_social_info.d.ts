interface GTAWCharacter {
    id: number;
    memberid: number;
    firstname: string;
    lastname: string;
}

interface Token {
    token: string;
    expiresIn: number;
    expiresAt: number;
}

export interface Character extends GTAWCharacter {}

export interface UserSocialInfo {
    id: number;
    currentCharacter: number;
    name: string;
    avatarURL: string;
    characters: Character[];
    tokens: Record<string, Token>;
}
