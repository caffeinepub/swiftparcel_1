import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface RiderProfile {
    id: Principal;
    status: AvailabilityStatus;
    vehicleType: VehicleType;
    name: string;
    bikeModel: string;
    phone: string;
}
export interface ParcelInput {
    weight: number;
    deliveryAddress: string;
    description: string;
    deliveryType: DeliveryType;
    pickupAddress: string;
}
export interface Parcel {
    id: bigint;
    weight: number;
    status: Status;
    deliveryAddress: string;
    description: string;
    assignedRiderId?: Principal;
    deliveryType: DeliveryType;
    priceEstimate: number;
    pickupAddress: string;
    createdTimestamp: bigint;
    senderId: Principal;
}
export interface UserProfile {
    name: string;
}
export enum AvailabilityStatus {
    busy = "busy",
    available = "available",
    offline = "offline"
}
export enum DeliveryType {
    local = "local",
    international = "international",
    state = "state"
}
export enum Status {
    assigned = "assigned",
    cancelled = "cancelled",
    pending = "pending",
    inTransit = "inTransit",
    pickedUp = "pickedUp",
    delivered = "delivered"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VehicleType {
    car = "car",
    van = "van",
    bike = "bike"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignRider(parcelId: bigint, riderId: Principal): Promise<void>;
    createParcel(input: ParcelInput): Promise<number>;
    getAllAvailableRiders(): Promise<Array<RiderProfile>>;
    getAllParcels(): Promise<Array<Parcel>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyParcels(): Promise<Array<Parcel>>;
    getParcelStatusCounts(): Promise<Array<[string, bigint]>>;
    getRiderParcels(): Promise<Array<Parcel>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerRider(name: string, bikeModel: string, phone: string, vehicleType: VehicleType): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateParcelStatus(parcelId: bigint, status: Status): Promise<void>;
    updateRiderAvailability(status: AvailabilityStatus): Promise<void>;
}
