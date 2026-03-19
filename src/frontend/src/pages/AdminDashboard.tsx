import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Principal } from "@icp-sdk/core/principal";
import {
  Loader2,
  MapPin,
  Package,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/StatusBadge";
import {
  Status,
  UserRole,
  useAssignCallerUserRole,
  useAssignRider,
  useGetAllAvailableRiders,
  useGetAllParcels,
  useGetParcelStatusCounts,
  useUpdateParcelStatus,
} from "../hooks/useQueries";

export function AdminDashboard() {
  const { data: parcels, isLoading: parcelsLoading } = useGetAllParcels();
  const { data: riders, isLoading: ridersLoading } = useGetAllAvailableRiders();
  const { data: statusCounts } = useGetParcelStatusCounts();
  const assignRider = useAssignRider();
  const updateStatus = useUpdateParcelStatus();
  const assignRole = useAssignCallerUserRole();

  const [selectedRider, setSelectedRider] = useState<Record<string, string>>(
    {},
  );
  const [roleInput, setRoleInput] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.user);

  const handleAssignRider = async (parcelId: bigint) => {
    const riderId = selectedRider[String(parcelId)];
    if (!riderId) return;
    try {
      await assignRider.mutateAsync({
        parcelId,
        riderId: Principal.fromText(riderId),
      });
      toast.success("Rider assigned!");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to assign rider.");
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

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignRole.mutateAsync({
        user: Principal.fromText(roleInput),
        role: selectedRole,
      });
      toast.success(`Role ${selectedRole} assigned!`);
      setRoleInput("");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to assign role.");
    }
  };

  const statusCountMap = Object.fromEntries(
    (statusCounts ?? []).map(([k, v]) => [k, Number(v)]),
  );

  const statCards = [
    { label: "Total", value: parcels?.length ?? 0, color: "text-foreground" },
    {
      label: "Pending",
      value: statusCountMap.pending ?? 0,
      color: "text-yellow-400",
    },
    {
      label: "In Transit",
      value: statusCountMap.inTransit ?? 0,
      color: "text-primary",
    },
    {
      label: "Delivered",
      value: statusCountMap.delivered ?? 0,
      color: "text-green-400",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <ShieldCheck size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="font-display font-bold text-3xl text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage all orders, riders, and roles
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <Card key={s.label} className="bg-card border-border">
            <CardContent className="p-5">
              <div className={`font-display font-bold text-3xl ${s.color}`}>
                {s.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {s.label} Parcels
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="orders" data-ocid="admin.tab">
        <TabsList className="mb-6 bg-secondary">
          <TabsTrigger value="orders" data-ocid="admin.orders.tab">
            All Orders
          </TabsTrigger>
          <TabsTrigger value="riders" data-ocid="admin.riders.tab">
            Available Riders
          </TabsTrigger>
          <TabsTrigger value="roles" data-ocid="admin.roles.tab">
            Role Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          {parcelsLoading ? (
            <div className="space-y-3" data-ocid="admin.orders.loading_state">
              {["a", "b", "c", "d"].map((k) => (
                <Skeleton key={k} className="h-24 w-full" />
              ))}
            </div>
          ) : !parcels?.length ? (
            <Card
              className="bg-card border-border"
              data-ocid="admin.orders.empty_state"
            >
              <CardContent className="py-12 text-center">
                <Package
                  size={40}
                  className="text-muted-foreground mx-auto mb-3"
                />
                <p className="text-muted-foreground">No orders yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {parcels.map((parcel, idx) => (
                <motion.div
                  key={String(parcel.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  data-ocid={`admin.item.${idx + 1}`}
                >
                  <Card className="bg-card border-border">
                    <CardContent className="p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm font-semibold text-muted-foreground">
                              #{String(parcel.id).padStart(5, "0")}
                            </span>
                            <StatusBadge status={parcel.status} />
                            <Badge
                              variant="outline"
                              className="text-xs capitalize border-border text-muted-foreground"
                            >
                              {parcel.deliveryType}
                            </Badge>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-start gap-1.5">
                              <MapPin
                                size={12}
                                className="text-green-400 mt-0.5"
                              />
                              <span className="text-muted-foreground line-clamp-1">
                                {parcel.pickupAddress}
                              </span>
                            </div>
                            <div className="flex items-start gap-1.5">
                              <MapPin
                                size={12}
                                className="text-blue-400 mt-0.5"
                              />
                              <span className="text-muted-foreground line-clamp-1">
                                {parcel.deliveryAddress}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          {parcel.status === Status.pending &&
                            riders &&
                            riders.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Select
                                  value={selectedRider[String(parcel.id)] ?? ""}
                                  onValueChange={(v) =>
                                    setSelectedRider((s) => ({
                                      ...s,
                                      [String(parcel.id)]: v,
                                    }))
                                  }
                                >
                                  <SelectTrigger
                                    className="w-44 bg-input border-border text-xs"
                                    data-ocid={`admin.assign_rider.select.${idx + 1}`}
                                  >
                                    <SelectValue placeholder="Select rider" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {riders.map((r) => (
                                      <SelectItem
                                        key={r.id.toString()}
                                        value={r.id.toString()}
                                      >
                                        {r.name} ({r.vehicleType})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Button
                                  size="sm"
                                  onClick={() => handleAssignRider(parcel.id)}
                                  disabled={
                                    !selectedRider[String(parcel.id)] ||
                                    assignRider.isPending
                                  }
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                  data-ocid={`admin.assign_button.${idx + 1}`}
                                >
                                  Assign
                                </Button>
                              </div>
                            )}
                          <Select
                            value={parcel.status}
                            onValueChange={(v) =>
                              handleStatusUpdate(parcel.id, v as Status)
                            }
                          >
                            <SelectTrigger
                              className="w-40 bg-input border-border text-xs"
                              data-ocid={`admin.status.select.${idx + 1}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(Status).map((s) => (
                                <SelectItem
                                  key={s}
                                  value={s}
                                  className="capitalize"
                                >
                                  {s === "inTransit"
                                    ? "In Transit"
                                    : s === "pickedUp"
                                      ? "Picked Up"
                                      : s.charAt(0).toUpperCase() + s.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="riders">
          {ridersLoading ? (
            <div className="space-y-3" data-ocid="admin.riders.loading_state">
              {["a", "b", "c"].map((k) => (
                <Skeleton key={k} className="h-20 w-full" />
              ))}
            </div>
          ) : !riders?.length ? (
            <Card
              className="bg-card border-border"
              data-ocid="admin.riders.empty_state"
            >
              <CardContent className="py-12 text-center">
                <Users
                  size={40}
                  className="text-muted-foreground mx-auto mb-3"
                />
                <p className="text-muted-foreground">
                  No available riders at the moment
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {riders.map((rider, idx) => (
                <motion.div
                  key={rider.id.toString()}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  data-ocid={`admin.rider.item.${idx + 1}`}
                >
                  <Card className="bg-card border-border">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-foreground">
                            {rider.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {rider.phone}
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-500/20 text-green-300 border-green-500/30 capitalize"
                        >
                          {rider.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="capitalize">{rider.vehicleType}</span>{" "}
                        • {rider.bikeModel}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="roles">
          <Card className="bg-card border-border max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog size={18} className="text-primary" />
                Assign User Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssignRole} className="space-y-4">
                <div>
                  <Label htmlFor="principalId">User Principal ID</Label>
                  <Input
                    id="principalId"
                    placeholder="aaaaa-aa..."
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    className="mt-1.5 bg-input border-border font-mono text-xs"
                    required
                    data-ocid="admin.role.input"
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select
                    value={selectedRole}
                    onValueChange={(v) => setSelectedRole(v as UserRole)}
                  >
                    <SelectTrigger
                      className="mt-1.5 bg-input border-border"
                      data-ocid="admin.role.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.user}>
                        👤 User (Sender)
                      </SelectItem>
                      <SelectItem value={UserRole.guest}>🚴 Rider</SelectItem>
                      <SelectItem value={UserRole.admin}>🛡️ Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={assignRole.isPending || !roleInput.trim()}
                  data-ocid="admin.role.submit_button"
                >
                  {assignRole.isPending ? (
                    <Loader2 size={14} className="mr-2 animate-spin" />
                  ) : null}
                  {assignRole.isPending ? "Assigning..." : "Assign Role"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
