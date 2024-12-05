interface Spending {
    id : number;
    name : string;
    amount : number;
    date : string;
    category: string;
    user_id: number;
    split_user_id?: number;
}

export type {Spending}