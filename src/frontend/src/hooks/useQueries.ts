import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Parcel, RiderProfile, UserProfile } from "../backend";
import {
  AvailabilityStatus,
  DeliveryType,
  Status,
  UserRole,
  VehicleType,
} from "../backend";
import type { ParcelInput } from "../backend";
import { useActor } from "./useActor";

export { AvailabilityStatus, DeliveryType, Status, UserRole, VehicleType };
export type { Parcel, RiderProfile, UserProfile, ParcelInput };

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();
  return useQuery<UserRole>({
    queryKey: ["callerUserRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetMyParcels() {
  const { actor, isFetching } = useActor();
  return useQuery<Parcel[]>({
    queryKey: ["myParcels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyParcels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRiderParcels() {
  const { actor, isFetching } = useActor();
  return useQuery<Parcel[]>({
    queryKey: ["riderParcels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRiderParcels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllParcels() {
  const { actor, isFetching } = useActor();
  return useQuery<Parcel[]>({
    queryKey: ["allParcels"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllParcels();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllAvailableRiders() {
  const { actor, isFetching } = useActor();
  return useQuery<RiderProfile[]>({
    queryKey: ["availableRiders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAvailableRiders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetParcelStatusCounts() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, bigint]>>({
    queryKey: ["parcelStatusCounts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getParcelStatusCounts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

export function useCreateParcel() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ParcelInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.createParcel(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myParcels"] });
    },
  });
}

export function useRegisterRider() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      bikeModel: string;
      phone: string;
      vehicleType: VehicleType;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerRider(
        data.name,
        data.bikeModel,
        data.phone,
        data.vehicleType,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["riderParcels"] });
      qc.invalidateQueries({ queryKey: ["callerUserRole"] });
    },
  });
}

export function useUpdateParcelStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      parcelId,
      status,
    }: { parcelId: bigint; status: Status }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateParcelStatus(parcelId, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["riderParcels"] });
      qc.invalidateQueries({ queryKey: ["allParcels"] });
      qc.invalidateQueries({ queryKey: ["myParcels"] });
    },
  });
}

export function useUpdateRiderAvailability() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (status: AvailabilityStatus) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateRiderAvailability(status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["availableRiders"] });
    },
  });
}

export function useAssignRider() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      parcelId,
      riderId,
    }: { parcelId: bigint; riderId: any }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignRider(parcelId, riderId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allParcels"] });
      qc.invalidateQueries({ queryKey: ["parcelStatusCounts"] });
    },
  });
}

export function useAssignCallerUserRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: any; role: UserRole }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerUserRole"] });
    },
  });
}
