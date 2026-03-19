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
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Loader2,
  MapPin,
  Package,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { DeliveryType, useCreateParcel } from "../hooks/useQueries";

const PRICE_MAP: Record<DeliveryType, number> = {
  [DeliveryType.local]: 3.99,
  [DeliveryType.state]: 12.99,
  [DeliveryType.international]: 29.99,
};

function estimatePrice(type: DeliveryType, weight: number): number {
  const base = PRICE_MAP[type];
  return +(base + weight * 0.5).toFixed(2);
}

export function BookParcel() {
  const navigate = useNavigate();
  const createParcel = useCreateParcel();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    pickupAddress: "",
    deliveryAddress: "",
    description: "",
    weight: "",
    deliveryType: DeliveryType.local as DeliveryType,
  });

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const priceEstimate = form.weight
    ? estimatePrice(form.deliveryType, Number.parseFloat(form.weight) || 0)
    : estimatePrice(form.deliveryType, 0);

  const handleSubmit = async () => {
    try {
      await createParcel.mutateAsync({
        pickupAddress: form.pickupAddress,
        deliveryAddress: form.deliveryAddress,
        description: form.description,
        weight: Number.parseFloat(form.weight) || 0,
        deliveryType: form.deliveryType,
      });
      toast.success("Parcel booked successfully!");
      setStep(4);
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to book parcel.");
    }
  };

  const steps = ["Pickup", "Delivery", "Parcel Details", "Confirm"];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-foreground mb-2">
          Book a Parcel
        </h1>
        <p className="text-muted-foreground">
          Fill in the details to schedule your parcel pickup and delivery.
        </p>
      </div>

      {/* Progress */}
      {step < 4 && (
        <div className="flex items-center mb-8 gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < step
                    ? "bg-green-500 text-white"
                    : i === step
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span
                className={`text-xs hidden sm:block ${
                  i === step
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <div className="flex-1 h-px bg-border" />
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin size={20} className="text-primary" />
                  Pickup Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="pickup">Full Pickup Address</Label>
                  <Textarea
                    id="pickup"
                    placeholder="Street, City, State, Country"
                    value={form.pickupAddress}
                    onChange={(e) => update("pickupAddress", e.target.value)}
                    className="mt-1.5 bg-input border-border"
                    rows={3}
                    data-ocid="book.pickup.textarea"
                  />
                </div>
                <Button
                  onClick={() => setStep(1)}
                  disabled={!form.pickupAddress.trim()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  data-ocid="book.next_button"
                >
                  Next <ChevronRight size={16} className="ml-1" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin size={20} className="text-blue-400" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="delivery">Full Delivery Address</Label>
                  <Textarea
                    id="delivery"
                    placeholder="Street, City, State, Country"
                    value={form.deliveryAddress}
                    onChange={(e) => update("deliveryAddress", e.target.value)}
                    className="mt-1.5 bg-input border-border"
                    rows={3}
                    data-ocid="book.delivery.textarea"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(0)}
                    className="flex-1"
                    data-ocid="book.back_button"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Back
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!form.deliveryAddress.trim()}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    data-ocid="book.next_button"
                  >
                    Next <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package size={20} className="text-primary" />
                  Parcel Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="desc">Description</Label>
                  <Input
                    id="desc"
                    placeholder="e.g. Electronics, Clothing, Documents"
                    value={form.description}
                    onChange={(e) => update("description", e.target.value)}
                    className="mt-1.5 bg-input border-border"
                    data-ocid="book.description.input"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="e.g. 2.5"
                    value={form.weight}
                    onChange={(e) => update("weight", e.target.value)}
                    className="mt-1.5 bg-input border-border"
                    data-ocid="book.weight.input"
                  />
                </div>
                <div>
                  <Label>Delivery Type</Label>
                  <Select
                    value={form.deliveryType}
                    onValueChange={(v) => update("deliveryType", v)}
                  >
                    <SelectTrigger
                      className="mt-1.5 bg-input border-border"
                      data-ocid="book.deliverytype.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={DeliveryType.local}>
                        🏙️ Local (Same City)
                      </SelectItem>
                      <SelectItem value={DeliveryType.state}>
                        🚛 State-to-State
                      </SelectItem>
                      <SelectItem value={DeliveryType.international}>
                        ✈️ International
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                    data-ocid="book.back_button"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!form.description.trim() || !form.weight}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    data-ocid="book.next_button"
                  >
                    Next <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign size={20} className="text-green-400" />
                  Confirm & Pay
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Pickup</span>
                    <span className="text-foreground font-medium max-w-xs text-right">
                      {form.pickupAddress}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-foreground font-medium max-w-xs text-right">
                      {form.deliveryAddress}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Description</span>
                    <span className="text-foreground">{form.description}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Weight</span>
                    <span className="text-foreground">{form.weight} kg</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Delivery Type</span>
                    <span className="text-foreground capitalize">
                      {form.deliveryType}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 bg-primary/10 rounded-lg px-3">
                    <span className="text-foreground font-semibold">
                      Price Estimate
                    </span>
                    <span className="text-primary font-bold text-lg">
                      ${priceEstimate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1"
                    data-ocid="book.back_button"
                  >
                    <ChevronLeft size={16} className="mr-1" /> Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createParcel.isPending}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    data-ocid="book.submit_button"
                  >
                    {createParcel.isPending ? (
                      <Loader2 size={14} className="mr-2 animate-spin" />
                    ) : null}
                    {createParcel.isPending ? "Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card
              className="bg-card border-border text-center"
              data-ocid="book.success_state"
            >
              <CardContent className="py-12">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-green-400" />
                </div>
                <h2 className="font-display font-bold text-2xl text-foreground mb-2">
                  Parcel Booked!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Your parcel has been booked successfully. A rider will be
                  assigned shortly.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setStep(0);
                      setForm({
                        pickupAddress: "",
                        deliveryAddress: "",
                        description: "",
                        weight: "",
                        deliveryType: DeliveryType.local,
                      });
                    }}
                    data-ocid="book.new_button"
                  >
                    Book Another
                  </Button>
                  <Button
                    onClick={() => navigate({ to: "/dashboard" })}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    data-ocid="book.dashboard_button"
                  >
                    View My Parcels
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
