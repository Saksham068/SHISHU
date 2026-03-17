import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Brain,
  Droplets,
  Eye,
  Battery,
  Thermometer,
  Zap,
  Waves,
  HeartPulse,
  Pill,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  Activity,
} from "lucide-react";
import { predictRisk, type MLPayload } from "@/services/predictionService";

const toggleFields = [
  { key: "prev_complications", icon: AlertCircle },
  { key: "preexisting_diabetes", icon: Pill },
  { key: "gestational_diabetes", icon: Pill },
  { key: "mental_health", icon: Brain },
  { key: "vaginal_bleeding", icon: Droplets },
  { key: "abdominal_pain", icon: Zap },
  { key: "fever_symptom", icon: Thermometer },
  { key: "dizziness", icon: Eye },
  { key: "back_pain", icon: Waves },
  { key: "pelvic_cramps", icon: HeartPulse },
  { key: "weakness", icon: Battery },
];

const SymptomsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const toggle = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(false);

    try {
      const rawNum = sessionStorage.getItem("patientNumeric");
      const num = rawNum ? JSON.parse(rawNum) : {};

      const payload: MLPayload = {
        age: parseFloat(num.age) || 25,
        systolic_bp: parseFloat(num.systolic_bp) || 120,
        diastolic_bp: parseFloat(num.diastolic_bp) || 80,
        blood_sugar: parseFloat(num.blood_sugar) || 90,
        body_temp: parseFloat(num.body_temp) || 98.6,
        heart_rate: parseFloat(num.heart_rate) || 72,
        bmi: parseFloat(num.bmi) || 24,
        prev_complications: selected.has("prev_complications") ? 1 : 0,
        preexisting_diabetes: selected.has("preexisting_diabetes") ? 1 : 0,
        gestational_diabetes: selected.has("gestational_diabetes") ? 1 : 0,
        mental_health: selected.has("mental_health") ? 1 : 0,
        vaginal_bleeding: selected.has("vaginal_bleeding") ? 1 : 0,
        abdominal_pain: selected.has("abdominal_pain") ? 1 : 0,
        fever_symptom: selected.has("fever_symptom") ? 1 : 0,
        dizziness: selected.has("dizziness") ? 1 : 0,
        back_pain: selected.has("back_pain") ? 1 : 0,
        pelvic_cramps: selected.has("pelvic_cramps") ? 1 : 0,
        weakness: selected.has("weakness") ? 1 : 0,
      };

      const result = await predictRisk(payload);

      sessionStorage.setItem("predictionResult", JSON.stringify(result));
      sessionStorage.setItem("symptoms", JSON.stringify([...selected]));
      navigate("/screening/results");
    } catch (err) {
      console.error("Prediction failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden py-10 md:py-14">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <motion.div
        className="absolute -left-20 top-12 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
        animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-xl backdrop-blur md:p-8"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              <ShieldCheck className="h-4 w-4" />
              Symptom Screening
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("symptomsTitle")}
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("symptomsToggleDesc")}
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4"
            >
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
              <div>
                <p className="text-sm font-semibold text-destructive">
                  Prediction Error
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("predictionError")}
                </p>
              </div>
            </motion.div>
          )}

          {/* Info box */}
          <div className="mb-6 rounded-2xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Select all symptoms that apply
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Choose the symptoms carefully. The prediction result will use
                  this information along with the health data entered earlier.
                </p>
              </div>
            </div>
          </div>

          {/* Toggle grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            {toggleFields.map(({ key, icon: Icon }, index) => {
              const active = selected.has(key);

              return (
                <motion.button
                  key={key}
                  type="button"
                  onClick={() => toggle(key)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`group flex items-center gap-3 rounded-2xl border p-4 text-left shadow-sm transition-all duration-200 ${
                    active
                      ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                      : "border-border/70 bg-card hover:border-primary/30 hover:shadow-md"
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {t(key)}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {active ? t("yes") : t("no")}
                  </span>
                </motion.button>
              );
            })}
          </div>

          {/* Bottom actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => navigate("/screening")}
              className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("back")}
            </motion.button>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.985 }}
              onClick={handleSubmit}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-display text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("analyzing")}</span>
                </>
              ) : (
                <>
                  {t("viewResults")}
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SymptomsPage;