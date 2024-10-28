export interface Message {
    _id: string;
    chatId?: string;
    text: string;
    imageUrl?: string;
    sender: string;
}

export interface ChatType {
    readonly firstName: string;
    readonly lastName: string;
    readonly messages: Message[];
    readonly _id: string;

    // readonly lastMessage?: string[];
    readonly lastMessage?: any;

    setSelectedChat?: (chatId: string | null) => void;
    onClick?: () => void;
}
