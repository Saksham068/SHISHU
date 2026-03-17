import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Siren,
  RotateCcw,
  TrendingUp,
  Info,
  Heart,
  Activity,
} from "lucide-react";

interface StoredPredictionResult {
  risk_score?: number;
  percentage?: number;
  category?: string;
  usedFallback?: boolean;
}

interface RiskLevel {
  category: string;
  advice: string;
  Icon: typeof CheckCircle2;
  bgClass: string;
  borderClass: string;
  iconBgClass: string;
  iconColorClass: string;
  textColorClass: string;
  scoreColorClass: string;
  ringClass: string;
  glowClass: string;
}

const RiskResultPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { percentage, level, usedFallback } = useMemo(() => {
    let result: StoredPredictionResult | null = null;

    try {
      const raw = sessionStorage.getItem("predictionResult");
      result = raw ? JSON.parse(raw) : null;
    } catch (error) {
      result = null;
    }

    const pct = Math.max(
      0,
      Math.min(100, Number(result?.percentage ?? result?.risk_score ?? 0))
    );

    const fallback = result?.usedFallback ?? false;

    let lvl: RiskLevel;

    if (pct <= 32) {
      lvl = {
        category: t("low"),
        advice:
          "Current indicators suggest a low risk level. Continue monitoring your health and stay attentive to any new symptoms.",
        Icon: CheckCircle2,
        bgClass: "bg-green-50",
        borderClass: "border-green-200",
        iconBgClass: "bg-green-100",
        iconColorClass: "text-green-600",
        textColorClass: "text-green-700",
        scoreColorClass: "text-green-600",
        ringClass: "ring-green-100",
        glowClass: "bg-green-200/30",
      };
    } else if (pct <= 66) {
      lvl = {
        category: t("moderate"),
        advice:
          "Some warning signs may require attention. Consider consulting a healthcare professional if symptoms persist or increase.",
        Icon: AlertTriangle,
        bgClass: "bg-orange-50",
        borderClass: "border-orange-200",
        iconBgClass: "bg-orange-100",
        iconColorClass: "text-orange-600",
        textColorClass: "text-orange-700",
        scoreColorClass: "text-orange-600",
        ringClass: "ring-orange-100",
        glowClass: "bg-orange-200/30",
      };
    } else if (pct <= 90) {
      lvl = {
        category: t("high"),
        advice:
          "Important warning signs detected. Medical consultation is strongly recommended for proper evaluation and care.",
        Icon: ShieldAlert,
        bgClass: "bg-red-50",
        borderClass: "border-red-200",
        iconBgClass: "bg-red-100",
        iconColorClass: "text-red-600",
        textColorClass: "text-red-700",
        scoreColorClass: "text-red-600",
        ringClass: "ring-red-100",
        glowClass: "bg-red-200/30",
      };
    } else {
      lvl = {
        category: t("critical"),
        advice:
          "Serious warning signs detected. Please seek medical help immediately and do not ignore these symptoms.",
        Icon: Siren,
        bgClass: "bg-rose-50",
        borderClass: "border-rose-300",
        iconBgClass: "bg-rose-100",
        iconColorClass: "text-rose-700",
        textColorClass: "text-rose-800",
        scoreColorClass: "text-rose-700",
        ringClass: "ring-rose-100",
        glowClass: "bg-rose-200/30",
      };
    }

    return { percentage: pct, level: lvl, usedFallback: fallback };
  }, [t]);

  const { Icon } = level;

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getStrokeColor = () => {
    if (percentage <= 32) return "#16a34a";
    if (percentage <= 66) return "#ea580c";
    if (percentage <= 90) return "#dc2626";
    return "#be123c";
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden py-10">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      <motion.div
        className={`absolute -left-24 top-16 h-72 w-72 rounded-full ${level.glowClass} blur-3xl`}
        animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative max-w-xl">
        {usedFallback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-start gap-2.5 rounded-2xl border border-orange-200 bg-orange-50 p-4 shadow-sm"
          >
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              ML API not connected — this result is being shown using a fallback estimate.
            </p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative"
        >
          <div
            className={`relative overflow-hidden rounded-[2rem] border-2 ${level.borderClass} ${level.bgClass} p-7 sm:p-8 ring-4 ${level.ringClass} shadow-2xl backdrop-blur-sm`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />

            <div className="mb-4 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                <Activity className="h-3.5 w-3.5 text-primary" />
                {t("riskResult")}
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.84, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="relative mx-auto mb-5 h-52 w-52"
            >
              <motion.div
                className={`absolute inset-[22%] rounded-full ${level.iconBgClass} blur-3xl`}
                animate={{ scale: [1, 1.06, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              />

              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  strokeWidth="8"
                  stroke="#e5e7eb"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r={radius}
                  fill="none"
                  strokeWidth="8"
                  strokeLinecap="round"
                  stroke={getStrokeColor()}
                  style={{ strokeDasharray: circumference }}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ delay: 0.3, duration: 1.3 }}
                />
              </svg>

              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
                <motion.div
                  className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl ${level.iconBgClass}`}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.35 }}
                >
                  <Icon className={`h-7 w-7 ${level.iconColorClass}`} />
                </motion.div>

                <div className="flex items-end justify-center leading-none">
                  <motion.span
                    className={`font-display text-6xl font-extrabold tracking-tight ${level.scoreColorClass}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                  >
                    {percentage}
                  </motion.span>
                  <span
                    className={`ml-1 mb-1 text-2xl font-bold leading-none ${level.scoreColorClass}`}
                  >
                    %
                  </span>
                </div>

                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Risk Score
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-4 text-center"
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {t("riskCategory")}
              </p>
              <p className={`mt-2 font-display text-3xl font-bold ${level.textColorClass}`}>
                {level.category}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="rounded-2xl border border-border/50 bg-card/80 p-5 shadow-sm backdrop-blur-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {t("medicalAdvice")}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-foreground">{level.advice}</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 flex flex-col gap-3"
        >
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.985 }}>
            <Link
              to="/trend"
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
            >
              <TrendingUp className="h-4 w-4" />
              {t("viewTrend")}
            </Link>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => {
              sessionStorage.clear();
              navigate("/");
            }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <RotateCcw className="h-4 w-4" />
            {t("startOver")}
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95 }}
          className="mx-auto mt-8 max-w-md text-center text-xs leading-relaxed text-muted-foreground"
        >
          {t("disclaimer")}
        </motion.p>
      </div>
    </div>
  );
};

export default RiskResultPage;