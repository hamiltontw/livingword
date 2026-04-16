import Link from "next/link";

const PATHS = [
  {
    id: "bahai",
    title: "A Bahá'í reader",
    blurb:
      "You revere the Íqán, but want help following its Qur'anic logic — seeing how Bahá'u'lláh uses Islamic verses and concepts.",
    cta: "Begin the Bahá'í path",
  },
  {
    id: "muslim",
    title: "A Muslim reader",
    blurb:
      "You want to understand what Bahá'u'lláh is actually arguing — with the Qur'anic and prophetic references surfaced clearly and without apology.",
    cta: "Begin the Muslim path",
  },
] as const;

export function PathSelector() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {PATHS.map((path) => (
        <article
          key={path.id}
          className="rounded-sm border border-rule bg-paper-deep/60 p-6 transition hover:border-accent-deep/60"
        >
          <h3 className="font-serif text-xl text-ink">{path.title}</h3>
          <p className="ui mt-3 text-sm leading-relaxed text-ink-soft">
            {path.blurb}
          </p>
          <Link
            href={`/onboarding/${path.id}`}
            className="ui mt-5 inline-flex items-center text-sm text-accent-deep hover:text-ink"
          >
            {path.cta}
            <span aria-hidden className="ml-2">
              →
            </span>
          </Link>
        </article>
      ))}
    </div>
  );
}
