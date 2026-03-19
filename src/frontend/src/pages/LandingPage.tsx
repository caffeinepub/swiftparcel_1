import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Globe,
  Mail,
  MapPin,
  Package,
  Phone,
  Quote,
  Shield,
  Star,
  Truck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const recentDeliveries = [
  {
    from: "New York, NY",
    to: "Los Angeles, CA",
    status: "Delivered",
    type: "State-to-State",
    time: "2 days ago",
  },
  {
    from: "Houston, TX",
    to: "Miami, FL",
    status: "In Transit",
    type: "State-to-State",
    time: "1 day ago",
  },
  {
    from: "Chicago, IL",
    to: "London, UK",
    status: "In Transit",
    type: "International",
    time: "3 hours ago",
  },
  {
    from: "Seattle, WA",
    to: "Portland, OR",
    status: "Picked Up",
    type: "Local",
    time: "30 min ago",
  },
];

export function LandingPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-delivery.dim_1600x800.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-36">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-6">
              <Zap size={14} />
              Fast & Reliable Delivery
            </div>
            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight text-foreground mb-6">
              Ship Anything, <span className="text-primary">Anywhere</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl">
              RDS delivers your parcels across states and internationally with
              real-time tracking, instant pickup, and guaranteed safe delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              {isAuthenticated ? (
                <Link to="/book">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                    data-ocid="hero.primary_button"
                  >
                    Book a Parcel <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                  onClick={login}
                  disabled={loginStatus === "logging-in"}
                  data-ocid="hero.primary_button"
                >
                  {loginStatus === "logging-in"
                    ? "Connecting..."
                    : "Get Started"}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              )}
              <Link to="/rider">
                <Button
                  size="lg"
                  variant="outline"
                  data-ocid="hero.secondary_button"
                >
                  Become a Rider
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10K+", label: "Deliveries Completed" },
              { value: "50+", label: "States Covered" },
              { value: "30+", label: "Countries" },
              { value: "99.2%", label: "On-Time Rate" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="font-display font-bold text-3xl md:text-4xl text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          custom={0}
          className="text-center mb-12"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
            Delivery Services
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose the right delivery option — from local same-day to
            international shipping.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <MapPin size={28} />,
              title: "Local Delivery",
              desc: "Same-city delivery within hours. Perfect for urgent packages.",
              price: "From ₹49",
              color: "text-green-400",
              bg: "bg-green-500/10",
            },
            {
              icon: <Truck size={28} />,
              title: "State-to-State",
              desc: "Reliable inter-state shipping. Delivered within 1–3 business days.",
              price: "From ₹299",
              color: "text-primary",
              bg: "bg-primary/10",
            },
            {
              icon: <Globe size={28} />,
              title: "International",
              desc: "Global shipping to 30+ countries with customs handling.",
              price: "From ₹999",
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
          ].map((service, i) => (
            <motion.div
              key={service.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}
            >
              <Card className="h-full border-border hover:border-primary/50 transition-colors bg-card">
                <CardContent className="p-6">
                  <div
                    className={`w-14 h-14 rounded-xl ${service.bg} ${service.color} flex items-center justify-center mb-4`}
                  >
                    {service.icon}
                  </div>
                  <h3 className="font-display font-semibold text-xl text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.desc}
                  </p>
                  <div className="font-semibold text-primary">
                    {service.price}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Three simple steps to send your parcel
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Package size={24} />,
                title: "Book Online",
                desc: "Fill in pickup & delivery addresses, parcel details, and confirm your booking in minutes.",
              },
              {
                step: "02",
                icon: <Truck size={24} />,
                title: "We Pick Up",
                desc: "A verified rider arrives at your location to collect the parcel at the scheduled time.",
              },
              {
                step: "03",
                icon: <CheckCircle size={24} />,
                title: "Delivered Safe",
                desc: "Your parcel is delivered to the recipient with real-time status updates along the way.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-foreground">
                        {i + 1}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{step.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] border-t-2 border-dashed border-border" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-6">
              Why Choose RDS?
            </h2>
            <div className="space-y-4">
              {[
                {
                  icon: <Clock size={20} />,
                  title: "Real-Time Tracking",
                  desc: "Track your parcel's journey with live status updates.",
                },
                {
                  icon: <Shield size={20} />,
                  title: "Insured Deliveries",
                  desc: "Every parcel is fully insured against damage or loss.",
                },
                {
                  icon: <Star size={20} />,
                  title: "Verified Riders",
                  desc: "Background-checked, trained delivery professionals.",
                },
                {
                  icon: <Zap size={20} />,
                  title: "Express Options",
                  desc: "Same-day and next-day delivery available in most areas.",
                },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex gap-4 items-start"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {f.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {f.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            className="bg-card rounded-2xl border border-border p-6"
          >
            <h3 className="font-display font-semibold text-xl text-foreground mb-4">
              Recent Deliveries
            </h3>
            <div className="space-y-3">
              {recentDeliveries.map((d) => (
                <div
                  key={`${d.from}-${d.to}`}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      {d.from} → {d.to}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {d.type} • {d.time}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      d.status === "Delivered"
                        ? "bg-green-500/20 text-green-400"
                        : d.status === "In Transit"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About & Founder */}
      <section className="bg-card border-y border-border py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-3">
              About RDS
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We are on a mission to make parcel delivery fast, reliable, and
              accessible to everyone — from your neighbourhood to the world.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* About Text + Contact */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={1}
            >
              <p className="text-muted-foreground leading-relaxed mb-4">
                RDS was founded with a simple belief: shipping should be
                stress-free. Whether you're a small business owner dispatching
                products to customers across states, or an individual sending a
                gift to a loved one overseas, we have built the infrastructure
                and the team to make it happen — seamlessly.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Today we operate across 50+ states and 30+ countries, powered by
                a network of thousands of verified riders and logistics partners
                committed to on-time, safe delivery.
              </p>

              <h4 className="font-semibold text-foreground mb-4">
                Contact RDS
              </h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Call Us</div>
                    <a
                      href="tel:9010430509"
                      className="font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      9010430509
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Email Us
                    </div>
                    <a
                      href="mailto:saiguptha05@gmail.com"
                      className="font-semibold text-foreground hover:text-primary transition-colors"
                    >
                      saiguptha05@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Founder Card — Editorial / Magazine Style */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={2}
            >
              <div className="relative bg-background rounded-3xl border border-border overflow-hidden shadow-lg">
                {/* Top accent bar */}
                <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/60 to-transparent" />

                <div className="flex flex-col sm:flex-row gap-0">
                  {/* Portrait Image */}
                  <div className="relative sm:w-52 flex-shrink-0">
                    <img
                      src="/assets/uploads/WhatsApp-Image-2026-03-12-at-2.27.19-AM-1.jpeg"
                      alt="Sai Guptha — Founder & CEO of RDS"
                      className="w-full h-64 sm:h-full object-cover object-top"
                      style={{ minHeight: "280px" }}
                    />
                    {/* Gradient overlay for image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-background/30" />
                    {/* Star badge top-right */}
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-md">
                      <Star
                        size={16}
                        className="text-primary-foreground"
                        fill="currentColor"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-display font-bold text-2xl text-foreground leading-tight">
                            Sai Guptha
                          </h3>
                          <p className="text-primary font-semibold text-sm mt-0.5">
                            Founder &amp; CEO, RDS Logistics
                          </p>
                        </div>
                      </div>

                      {/* Decorative quote icon */}
                      <div className="mt-4 mb-3">
                        <Quote size={20} className="text-primary/40" />
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                        Sai Guptha is the visionary founder and CEO of RDS — a
                        next-generation delivery platform redefining what speed,
                        reliability, and trust mean in logistics. With a deep
                        passion for technology and a relentless drive to solve
                        real-world problems, Sai built RDS from the ground up
                        with one clear goal: to make parcel delivery as
                        effortless as sending a message.
                      </p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        From local same-day runs to seamless international
                        shipping, Sai's leadership has powered RDS to connect
                        thousands of senders with verified, professional riders
                        across 50+ states and 30+ countries. His work sits at
                        the intersection of entrepreneurship, technology, and
                        community — ensuring that every package, no matter how
                        big or how far, arrives safely and on time.
                      </p>
                    </div>

                    {/* Footer chips */}
                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        <Zap size={11} /> Logistics Visionary
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full font-medium">
                        <Globe size={11} /> 30+ Countries
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full font-medium">
                        <Truck size={11} /> 50+ States
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/10 border-y border-primary/20 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={0}
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Ready to Send Your First Parcel?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Join thousands of happy customers who trust RDS for their
              deliveries.
            </p>
            {isAuthenticated ? (
              <Link to="/book">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                  data-ocid="cta.primary_button"
                >
                  Book a Parcel Now <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            ) : (
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
                onClick={login}
                disabled={loginStatus === "logging-in"}
                data-ocid="cta.primary_button"
              >
                Start Shipping Today <ArrowRight size={16} className="ml-2" />
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
