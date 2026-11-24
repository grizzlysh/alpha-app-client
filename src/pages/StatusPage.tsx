import type { JSX } from "react";
import { Link } from "react-router-dom";
import { FileQuestion, ShieldOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useLandingPath } from "@/configs/navigation";

interface StatusPageProps {
  kind: "forbidden" | "not-found";
}

/** In-layout page for routes the user can't open (no permission) or that don't exist. */
export default function StatusPage({ kind }: StatusPageProps): JSX.Element {
  const { t } = useLanguage();
  const home = useLandingPath();
  const Icon = kind === "forbidden" ? ShieldOff : FileQuestion;
  const title = kind === "forbidden" ? t.forbiddenTitle : t.notFoundTitle;
  const desc = kind === "forbidden" ? t.forbiddenDesc : t.notFoundDesc;

  return (
    <div className="flex h-full min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
        <Icon className="h-7 w-7 text-muted-foreground" aria-hidden />
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{desc}</p>
      <Button asChild variant="outline" className="mt-2 rounded-xl">
        <Link to={home}>{t.backToHome}</Link>
      </Button>
    </div>
  );
}
