import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Activity,
  ArrowRight,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";

type FeatureItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const features: FeatureItem[] = [
  {
    icon: ShieldCheck,
    title: "Early Detection",
    desc: "Identify possible risk factors early through symptom and health indicator analysis.",
  },
  {
    icon: Activity,
    title: "Care & Awareness",
    desc: "Help expecting mothers understand warning signs and take timely action.",
  },
  {
    icon: HeartPulse,
    title: "Better Outcomes",
    desc: "Support faster awareness and encourage early medical consultation when needed.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const floatingIcon = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
    },
  },
};

const HomePage = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        <motion.div
          className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.4, 0.65, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
        />

        <motion.div
          className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.35, 0.55, 0.35],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
        />

        <div className="container relative py-16 md:py-24 lg:py-28">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-4xl text-center"
          >
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-sm"
            >
              <motion.div variants={floatingIcon} animate="animate">
                <HeartPulse className="h-4 w-4" />
              </motion.div>
              {t("projectTitle")}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="mx-auto mb-6 max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl"
            >
              Early Miscarriage Risk
              <motion.span
                className="block text-primary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                Awareness & Screening
              </motion.span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            >
              {t("heroSubtitle")}
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground/85"
            >
              {t("heroDescription")}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/screening"
                  className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25"
                >
                  {t("startScreeningBtn")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/about"
                  className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-2xl border border-border bg-card/80 px-8 py-3.5 font-display text-sm font-semibold text-foreground backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted"
                >
                  {t("learnMore")}
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border/70 bg-card/70 p-4 text-left shadow-sm backdrop-blur"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start gap-3">
                <motion.div
                  className="mt-0.5 rounded-xl bg-primary/10 p-2"
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(0,0,0,0)",
                      "0 0 18px rgba(59,130,246,0.15)",
                      "0 0 0px rgba(0,0,0,0)",
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <Activity className="h-5 w-5 text-primary" />
                </motion.div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Awareness support, not diagnosis
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    This tool helps users understand possible warning signs and
                    risk patterns, but it does not replace professional medical
                    advice or diagnosis.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/60 py-16 md:py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="mx-auto mb-10 max-w-2xl text-center"
          >
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Why this platform matters
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              Built to combine healthcare awareness, machine learning prediction,
              and a calm user-friendly interface for better understanding.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {features.map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  className="group rounded-3xl border border-border/70 bg-card/90 p-6 shadow-sm"
                >
                  <motion.div
                    className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"
                    whileHover={{ rotate: 4, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="h-7 w-7 text-primary" />
                  </motion.div>

                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border/60 py-8">
        <div className="container">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-muted-foreground"
          >
            {t("disclaimer")}
          </motion.p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;