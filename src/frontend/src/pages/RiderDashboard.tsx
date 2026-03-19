import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Loader2, MapPin, Navigation, Truck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/StatusBadge";
import {
  AvailabilityStatus,
  Status,
  VehicleType,
  useGetRiderParcels,
  useRegisterRider,
  useUpdateParcelStatus,
  useUpdateRiderAvailability,
} from "../hooks/useQueries";

const nextStatus: Partial<Record<Status, Status>> = {
  [Status.assigned]: Status.pickedUp,
  [Status.pickedUp]: Status.inTransit,
  [Status.inTransit]: Status.delivered,
};

const nextStatusLabel: Partial<Record<Status, string>> = {
  [Status.assigned]: "Mark Picked Up",
  [Status.pickedUp]: "Mark In Transit",
  [Status.inTransit]: "Mark Delivered",
};

export function RiderDashboard() {
  const { data: parcels, isLoading } = useGetRiderParcels();
  const registerRider = useRegisterRider();
  const updateStatus = useUpdateParcelStatus();
  const updateAvailability = useUpdateRiderAvailability();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    bikeModel: "",
    vehicleType: VehicleType.bike as VehicleType,
  });
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [availability, setAvailability] = useState<AvailabilityStatus>(
    AvailabilityStatus.available,
  );

  const riderRegistered = parcels !== undefined;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerRider.mutateAsync(form);
      toast.success("Registered as rider!");
      setIsRegistered(true);
    } catch (err: any) {
      toast.error(err?.message ?? "Registration failed.");
    }
  };

  const handleStatusUpdate = async (parcelId: bigint, status: Status) => {
    try {
      await updateStatus.mutateAsync({ parcelId, status });
      toast.success("Status updated!");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update status.");
    }
  };

  const handleAvailabilityChange = async (status: AvailabilityStatus) => {
    setAvailability(status);
    try {
      await updateAvailability.mutateAsync(status);
      toast.success(`Status set to ${status}`);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to update availability.");
    }
  };

  const availabilityColors: Record<AvailabilityStatus, string> = {
    [AvailabilityStatus.available]:
      "bg-green-500/20 text-green-300 border-green-500/30",
    [AvailabilityStatus.busy]:
      "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    [AvailabilityStatus.offline]:
      "bg-muted text-muted-foreground border-border",
  };

  if (isLoading) {
    return (
      <div
        className="max-w-4xl mx-auto px-4 py-10"
        data-ocid="rider.loading_state"
      >
        <Skeleton className="h-10 w-48 mb-6" />
        <div className="space-y-4">
          {["a", "b", "c"].map((k) => (
            <Skeleton key={k} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!riderRegistered || isRegistered === false) {
    return (
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground mb-2">
            Become a Rider
          </h1>
          <p className="text-muted-foreground">
            Register to start delivering parcels and earn money.
          </p>
        </div>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Label htmlFor="rname">Full Name</Label>
                <Input
                  id="rname"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="mt-1.5 bg-input border-border"
                  required
                  data-ocid="rider.name.input"
                />
              </div>
              <div>
                <Label htmlFor="rphone">Phone Number</Label>
                <Input
                  id="rphone"
                  placeholder="+1 555 000 0000"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  className="mt-1.5 bg-input border-border"
                  required
                  data-ocid="rider.phone.input"
                />
              </div>
              <div>
                <Label htmlFor="rmodel">Vehicle Model</Label>
                <Input
                  id="rmodel"
                  placeholder="e.g. Honda CB500, Toyota Corolla"
                  value={form.bikeModel}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, bikeModel: e.target.value }))
                  }
                  className="mt-1.5 bg-input border-border"
                  required
                  data-ocid="rider.model.input"
                />
              </div>
              <div>
                <Label>Vehicle Type</Label>
                <Select
                  value={form.vehicleType}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, vehicleType: v as VehicleType }))
                  }
                >
                  <SelectTrigger
                    className="mt-1.5 bg-input border-border"
                    data-ocid="rider.vehicle.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={VehicleType.bike}>🏍️ Bike</SelectItem>
                    <SelectItem value={VehicleType.car}>🚗 Car</SelectItem>
                    <SelectItem value={VehicleType.van}>🚐 Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={registerRider.isPending}
                data-ocid="rider.register_button"
              >
                {registerRider.isPending ? (
                  <Loader2 size={14} className="mr-2 animate-spin" />
                ) : (
                  <Truck size={14} className="mr-2" />
                )}
                {registerRider.isPending
                  ? "Registering..."
                  : "Register as Rider"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-foreground">
            Rider Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your assigned deliveries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Availability:</span>
          <Select
            value={availability}
            onValueChange={(v) =>
              handleAvailabilityChange(v as AvailabilityStatus)
            }
          >
            <SelectTrigger
              className="w-36 bg-input border-border"
              data-ocid="rider.availability.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AvailabilityStatus.available}>
                🟢 Available
              </SelectItem>
              <SelectItem value={AvailabilityStatus.busy}>🟡 Busy</SelectItem>
              <SelectItem value={AvailabilityStatus.offline}>
                ⚫ Offline
              </SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className={availabilityColors[availability]}>
            {availability}
          </Badge>
        </div>
      </div>

      {!parcels?.length ? (
        <Card className="bg-card border-border" data-ocid="rider.empty_state">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Truck size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-xl text-foreground mb-2">
              No deliveries assigned
            </h3>
            <p className="text-muted-foreground">
              Stay available to receive new delivery assignments
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {parcels.map((parcel, idx) => (
            <motion.div
              key={String(parcel.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-ocid={`rider.item.${idx + 1}`}
            >
              <Card className="bg-card border-border">
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-muted-foreground">
                          #{String(parcel.id).padStart(5, "0")}
                        </span>
                        <StatusBadge status={parcel.status} />
                        <span className="text-xs text-muted-foreground capitalize">
                          {parcel.deliveryType}
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="flex items-start gap-2">
                          <MapPin
                            size={14}
                            className="text-green-400 mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Pickup
                            </div>
                            <div className="text-sm text-foreground">
                              {parcel.pickupAddress}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin
                            size={14}
                            className="text-blue-400 mt-0.5 flex-shrink-0"
                          />
                          <div>
                            <div className="text-xs text-muted-foreground">
                              Delivery
                            </div>
                            <div className="text-sm text-foreground">
                              {parcel.deliveryAddress}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {parcel.description} • {parcel.weight} kg
                      </div>
                    </div>
                    {nextStatus[parcel.status] && (
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(
                            parcel.id,
                            nextStatus[parcel.status]!,
                          )
                        }
                        disabled={updateStatus.isPending}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                        data-ocid={`rider.update_button.${idx + 1}`}
                      >
                        {updateStatus.isPending ? (
                          <Loader2 size={12} className="mr-1 animate-spin" />
                        ) : (
                          <Navigation size={12} className="mr-1" />
                        )}
                        {nextStatusLabel[parcel.status]}
                      </Button>
                    )}
                    {parcel.status === Status.delivered && (
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle size={16} /> Delivered
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
