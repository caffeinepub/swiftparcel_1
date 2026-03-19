import { Badge } from "@/components/ui/badge";
import { Status } from "../hooks/useQueries";

const statusConfig: Record<Status, { label: string; className: string }> = {
  [Status.pending]: {
    label: "Pending",
    className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  },
  [Status.assigned]: {
    label: "Assigned",
    className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  [Status.pickedUp]: {
    label: "Picked Up",
    className: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  [Status.inTransit]: {
    label: "In Transit",
    className: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  },
  [Status.delivered]: {
    label: "Delivered",
    className: "bg-green-500/20 text-green-300 border-green-500/30",
  },
  [Status.cancelled]: {
    label: "Cancelled",
    className: "bg-red-500/20 text-red-300 border-red-500/30",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}
