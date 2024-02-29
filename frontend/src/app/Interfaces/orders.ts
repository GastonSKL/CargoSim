export interface Orders {
    id: number;
    originNodeId: number;
    targetNodeId: number;
    load: number;
    value: number;
    deliveryDateUtc: string;
    expirationDateUtc: string;
}
