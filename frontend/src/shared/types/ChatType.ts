export interface Message {
    text: string;
    sender: string;
}

export interface ChatType {
    readonly firstName: string;
    readonly lastName: string;
    readonly messages: Message[];
    readonly _id: string;

    readonly firstThreeMessages?: string[];
    setSelectedChat?: (chatId: string | null) => void;
    onClick?: () => void;
}
