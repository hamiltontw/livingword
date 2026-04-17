import Link from "next/link";
import { notFound } from "next/navigation";
import { BeginReading } from "@/components/onboarding/BeginReading";
import type { ReaderPath } from "@/lib/types";

type RouteParams = { path: string };

const PATHS: Record<ReaderPath, { title: string; body: string[] }> = {
  bahai: {
    title: "For a Bahá'í reader",
    body: [
      "You already revere this book. The aim here is not to simplify it, but to make its inner architecture easier to follow: to show you, paragraph by paragraph, which claim is being made, which objection is being answered, and which Qur'anic verse Bahá'u'lláh is drawing on.",
      "As you read, each section is introduced with a short summary written for the Bahá'í path. Cited verses from the Qur'an appear in Yusuf Ali's translation, with a brief note on why Bahá'u'lláh turns to them at that moment in the argument.",
      "Take the book slowly. The Íqán rewards a reader who is willing to sit with its Qur'anic logic rather than rush past it.",
    ],
  },
  muslim: {
    title: "For a Muslim reader",
    body: [
      "You may not share the conclusions of the Íqán, and the aim here is not to persuade you. The aim is to make Bahá'u'lláh's reasoning legible — to let you follow the argument without first being asked to accept it.",
      "The Kitáb-i-Íqán is written within a classical Islamic idiom. It quotes the Qur'an extensively. It appeals to the Prophets and to the ḥadīth. It draws on the distinction between muḥkam and mutashābih. This companion surfaces those references in Yusuf Ali's translation and notes, in plain language, how each one functions in the argument.",
      "Difficult theological differences are not smoothed over. Where Bahá'u'lláh's reading of a verse diverges from the mainstream of tafsīr, the divergence is named honestly, so you can weigh it.",
    ],
  },
};

export function generateStaticParams() {
  return (Object.keys(PATHS) as ReaderPath[]).map((path) => ({ path }));
}

export default async function OnboardingPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { path } = await params;
  if (path !== "bahai" && path !== "muslim") notFound();
  const content = PATHS[path];

  return (
    <article className="fade-in mx-auto max-w-reader px-6 pt-16 pb-20">
      <p className="ui mb-4 text-xs uppercase tracking-wide2 text-ink-faint">
        Onboarding
      </p>
      <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">
        {content.title}
      </h1>
      <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink-soft">
        {content.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <hr className="rule-soft my-12" />
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="ui text-sm text-ink-muted hover:text-accent-deep"
        >
          ← Back
        </Link>
        <BeginReading path={path} />
      </div>
    </article>
  );
}
