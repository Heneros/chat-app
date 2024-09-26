export interface ChatType {
    readonly firstName: string;
    readonly lastName: string;
    readonly firstThreeMessages: string;
    readonly _id: string;
    setSelectedChat?: (chatId: string | null) => void;
    onClick?: () => void;
}
