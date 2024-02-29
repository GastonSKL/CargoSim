import { Orders } from "./orders";

export interface CargoResponse {
    id: number;
    positionNodeId: number;
    inTransit: boolean;
    capacity: number;
    load: number;
    loadedOrders: Orders[];
}
