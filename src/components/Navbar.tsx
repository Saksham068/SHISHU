import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: "/", label: t("home") },
    { to: "/screening", label: t("startScreening") },
    { to: "/trend", label: t("sevenDayTrend") },
    { to: "/about", label: t("about") },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container">
        <div className="flex h-[84px] items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-4 transition-transform duration-200 hover:scale-[1.01]"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ duration: 0.2 }}
              className="flex h-16 w-16 items-center justify-center rounded-3xl border border-border/50 bg-white shadow-md overflow-hidden shrink-0"
            >
              <img
                src={`${import.meta.env.BASE_URL}logo.svg`}
                alt="Project Shishu Logo"
                className="h-14 w-14 object-contain"
              />
            </motion.div>

            <div className="flex flex-col leading-tight">
              <span className="font-display text-[1.85rem] font-bold text-foreground sm:text-[2rem]">
                Project Shishu
              </span>
              <span className="text-sm text-muted-foreground sm:text-base">
                Maternal health awareness
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-1 rounded-2xl border border-border/60 bg-card/70 p-1 shadow-sm backdrop-blur">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setLang(lang === "en" ? "hi" : "en")}
              className="ml-1 flex items-center gap-2 rounded-2xl border border-border/60 bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground"
            >
              <Globe className="h-4 w-4" />
              {lang === "en" ? "हिंदी" : "English"}
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="rounded-xl border border-border/60 bg-card/80 p-2 text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="border-t border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="container py-4">
              <div className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card/80 p-3 shadow-sm">
                {links.map((link, index) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                        isActive(link.to)
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: links.length * 0.05 }}
                  onClick={() => {
                    setLang(lang === "en" ? "hi" : "en");
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Globe className="h-4 w-4" />
                  {lang === "en" ? "हिंदी" : "English"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;