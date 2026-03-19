import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Package, Plus, Weight } from "lucide-react";
import { motion } from "motion/react";
import { StatusBadge } from "../components/StatusBadge";
import { useGetCallerUserProfile, useGetMyParcels } from "../hooks/useQueries";

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SenderDashboard() {
  const { data: parcels, isLoading } = useGetMyParcels();
  const { data: profile } = useGetCallerUserProfile();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-foreground">
            Welcome back, {profile?.name ?? "User"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all your parcels
          </p>
        </div>
        <Link to="/book">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            data-ocid="dashboard.book_button"
          >
            <Plus size={16} className="mr-2" /> Book New Parcel
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="dashboard.loading_state"
        >
          {["a", "b", "c"].map((k) => (
            <Card key={k} className="bg-card border-border">
              <CardContent className="p-5 space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !parcels?.length ? (
        <Card
          className="bg-card border-border"
          data-ocid="dashboard.empty_state"
        >
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-xl text-foreground mb-2">
              No parcels yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Book your first parcel to get started
            </p>
            <Link to="/book">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                data-ocid="dashboard.book_button"
              >
                <Plus size={16} className="mr-2" /> Book a Parcel
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parcels.map((parcel, idx) => (
            <motion.div
              key={String(parcel.id)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-ocid={`dashboard.item.${idx + 1}`}
            >
              <Card className="bg-card border-border hover:border-border/80 transition-colors h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">
                      #{String(parcel.id).padStart(5, "0")}
                    </CardTitle>
                    <StatusBadge status={parcel.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin
                      size={14}
                      className="text-green-400 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Pickup
                      </div>
                      <div className="text-sm text-foreground line-clamp-2">
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
                      <div className="text-sm text-foreground line-clamp-2">
                        {parcel.deliveryAddress}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Weight size={12} />
                      {parcel.weight} kg
                    </div>
                    <div className="text-xs font-semibold text-primary">
                      ${parcel.priceEstimate.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    {formatDate(parcel.createdTimestamp)}
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
