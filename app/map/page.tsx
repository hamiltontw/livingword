import { getArgumentMap } from "@/lib/content";
import { ArgumentMapView } from "@/components/map/ArgumentMap";

export default function MapPage() {
  const map = getArgumentMap();

  return (
    <div className="fade-in mx-auto max-w-5xl px-6 pt-16 pb-20">
      <p className="ui mb-4 text-xs uppercase tracking-wide2 text-ink-faint">
        Argument map
      </p>
      <h1 className="font-serif text-3xl text-ink">
        The shape of the argument
      </h1>
      <p className="ui mt-3 max-w-prose text-sm leading-relaxed text-ink-muted">
        The Íqán is not a devotional essay — it is a sustained argument. This
        map shows how the claims, objections, evidence, and interpretive moves
        fit together. Click any node to jump to the paragraphs that carry it.
      </p>
      <div className="mt-12">
        <ArgumentMapView map={map} />
      </div>
    </div>
  );
}
