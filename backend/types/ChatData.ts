interface Message {
    content: string;
    sender: string;
}

export interface ChatData {
    messages: Message[];
    [key: string]: any;
}
