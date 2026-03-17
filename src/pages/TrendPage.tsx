import { useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingDown, TrendingUp, Minus, Activity } from "lucide-react";

type SymptomData = Record<string, boolean | number | string | undefined>;

function clamp(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getSymptomSeverity(symptoms: SymptomData | null, baseScore: number) {
  if (!symptoms) {
    if (baseScore >= 70) return "severe";
    if (baseScore >= 40) return "moderate";
    return "mild";
  }

  const weights: Record<string, number> = {
    vaginal_bleeding: 4,
    abdominal_pain: 3,
    fever_symptom: 3,
    prev_complications: 3,
    preexisting_diabetes: 2,
    gestational_diabetes: 2,
    dizziness: 1,
    mental_health: 1,
  };

  let score = 0;

  for (const [key, weight] of Object.entries(weights)) {
    if (symptoms[key]) score += weight;
  }

  if (score >= 7 || baseScore >= 75) return "severe";
  if (score >= 3 || baseScore >= 40) return "moderate";
  return "mild";
}

function generateTrendData(
  startPercent: number,
  severity: "mild" | "moderate" | "severe"
) {
  let current = Math.max(0, Math.min(100, startPercent));
  const data = [];

  for (let i = 0; i < 7; i++) {
    if (i === 0) {
      data.push({ day: 1, risk: Math.round(current) });
      continue;
    }

    let change = 0;

    if (severity === "mild") {
      // always improves
      change = -2 + Math.sin(i) * 0.3;
    }

    if (severity === "moderate") {
      // slight fluctuation, small upward bias
      change = Math.sin(i * 1.2) * 2 + 0.3;
    }

    if (severity === "severe") {
      // 🔥 upward overall trend
      if (i <= 3) {
        change = 1.8 + Math.sin(i) * 1;
      } else {
        change = 0.8 + Math.sin(i) * 0.8;
      }
    }

    current = Math.max(0, Math.min(100, current + change));

    data.push({
      day: i + 1,
      risk: Math.round(current),
    });
  }

  return data;
}
const TrendPage = () => {
  const { t } = useLanguage();

  const { data, baseScore, severity } = useMemo(() => {
    const result = safeParse<{ risk_score?: number; percentage?: number }>(
      sessionStorage.getItem("predictionResult")
    );

    const symptoms =
      safeParse<SymptomData>(sessionStorage.getItem("symptomsData")) ||
      safeParse<SymptomData>(sessionStorage.getItem("predictionInput"));

    const score = clamp(
      Number(result?.percentage ?? result?.risk_score ?? 30)
    );

    const severityLevel = getSymptomSeverity(symptoms, score);

    return {
      data: generateTrendData(score, severityLevel),
      baseScore: score,
      severity: severityLevel,
    };
  }, []);

  const trendDirection = data[6].risk - data[0].risk;

  const getStrokeColor = (score: number) => {
    if (score >= 70) return "#dc2626";
    if (score >= 40) return "#f59e0b";
    return "#16a34a";
  };

  const getSeverityLabel = () => {
    if (severity === "severe") return "Severe symptom pattern";
    if (severity === "moderate") return "Moderate symptom pattern";
    return "Mild symptom pattern";
  };

  const stroke = getStrokeColor(baseScore);
  const TrendIcon =
    trendDirection > 0 ? TrendingUp : trendDirection < 0 ? TrendingDown : Minus;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      <div className="container relative max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Activity className="h-4 w-4 text-primary" />
              {t("trendTitle")}
            </div>

            <p className="text-sm text-muted-foreground">{t("trendDesc")}</p>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-md md:grid-cols-[1fr_auto]"
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-md"
                style={{ backgroundColor: stroke }}
              >
                <TrendIcon className="h-6 w-6" />
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  {data[0].risk}% → {data[6].risk}%
                </p>
                <p className="text-xs text-muted-foreground">
                  {trendDirection > 0
                    ? t("trendIncreasing")
                    : trendDirection < 0
                    ? t("trendDecreasing")
                    : t("trendStable")}
                </p>
              </div>
            </div>

            <div className="text-left md:text-right">
              <p className="text-xs text-muted-foreground">Base</p>
              <p className="text-lg font-bold text-foreground">{baseScore}%</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {getSeverityLabel()}
              </p>
            </div>
          </motion.div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-3xl border border-border bg-card p-6 shadow-xl"
          >
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />

                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                  tickFormatter={(v) => `${t("day")} ${v}`}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
                    backgroundColor: "hsl(var(--card))",
                  }}
                  formatter={(value: number) => [`${value}%`, t("riskLevel")]}
                />

                <ReferenceLine y={70} stroke="#dc2626" strokeDasharray="4 4" strokeOpacity={0.3} />
                <ReferenceLine y={40} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.3} />

                <Line
                  type="monotone"
                  dataKey="risk"
                  stroke={stroke}
                  strokeWidth={3}
                  dot={{
                    fill: stroke,
                    r: 5,
                    strokeWidth: 2,
                    stroke: "white",
                  }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 rounded-2xl border border-border bg-card p-4 text-center text-xs text-muted-foreground"
          >
            {t("trendAwarenessDisclaimer")}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrendPage;