import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  User,
  Heart,
  Droplets,
  Thermometer,
  Activity,
  Scale,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const PatientInfoPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [form, setForm] = useState<Record<string, string>>({
    age: "",
    systolic_bp: "",
    diastolic_bp: "",
    blood_sugar: "",
    body_temp: "",
    heart_rate: "",
    bmi: "",
  });

  const set = (key: string, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.age) return;
    sessionStorage.setItem("patientNumeric", JSON.stringify(form));
    navigate("/screening/symptoms");
  };

  const inputClass =
    "w-full rounded-2xl border border-border/70 bg-background/80 px-4 py-3.5 text-sm text-foreground shadow-sm transition-all duration-200 placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10";

  const renderField = (
    key: string,
    label: string,
    placeholder: string,
    Icon: typeof User
  ) => (
    <motion.div
      key={key}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="group"
    >
      <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 transition-colors group-focus-within:bg-primary/15">
          <Icon className="h-4 w-4 text-primary" />
        </span>
        {label}
      </label>

      <input
        type="number"
        step="any"
        className={inputClass}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        required={key === "age"}
      />
    </motion.div>
  );

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden py-10 md:py-14">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <motion.div
        className="absolute -left-16 top-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl"
        animate={{ scale: [1, 1.06, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container relative max-w-3xl">
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
              Patient Information
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {t("patientInfo")}
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {t("patientInfoDesc")}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Age */}
            <div className="grid grid-cols-1 gap-5">
              {renderField(
                "age",
                t("age"),
                t("age_placeholder"),
                User
              )}
            </div>

            {/* Paired fields */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {renderField(
                "systolic_bp",
                t("systolic_bp"),
                t("systolic_bp_placeholder"),
                Activity
              )}
              {renderField(
                "diastolic_bp",
                t("diastolic_bp"),
                t("diastolic_bp_placeholder"),
                Activity
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {renderField(
                "blood_sugar",
                t("blood_sugar"),
                t("blood_sugar_placeholder"),
                Droplets
              )}
              {renderField(
                "body_temp",
                t("body_temp"),
                t("body_temp_placeholder"),
                Thermometer
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {renderField(
                "heart_rate",
                t("heart_rate"),
                t("heart_rate_placeholder"),
                Heart
              )}
              {renderField(
                "bmi",
                t("bmi"),
                t("bmi_placeholder"),
                Scale
              )}
            </div>

            {/* Bottom info box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border/70 bg-background/70 p-4"
            >
              <p className="text-sm leading-relaxed text-muted-foreground">
                Please enter accurate health information to get a better awareness result.
                These details will be used in the next step along with symptom inputs.
              </p>
            </motion.div>

            {/* Submit button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-display text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
            >
              {t("next")}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientInfoPage;