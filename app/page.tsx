import Link from "next/link";
import { PathSelector } from "@/components/onboarding/PathSelector";

export default function Home() {
  return (
    <div className="fade-in">
      <section className="mx-auto max-w-reader px-6 pt-20 pb-12">
        <p className="ui mb-6 text-xs uppercase tracking-wide2 text-ink-faint">
          A reader's companion
        </p>
        <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
          The Kitáb-i-Íqán, followed step by step.
        </h1>
        <p className="mt-6 max-w-prose text-lg leading-relaxed text-ink-soft">
          Bahá'u'lláh's <em>Kitáb-i-Íqán</em> is an argument. It makes claims,
          answers objections, and weaves Qur'anic evidence into a single case
          about how the Messengers of God are to be recognized. This companion
          does not summarize the book away. It helps you follow the book's own
          reasoning — paragraph by paragraph, reference by reference, move by
          move.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/read/p1"
            className="ui inline-flex items-center rounded-sm border border-accent-deep/70 bg-accent-deep px-5 py-2.5 text-sm text-paper hover:bg-accent-deep/90"
          >
            Begin reading
          </Link>
          <Link
            href="/map"
            className="ui inline-flex items-center rounded-sm border border-ink/20 px-5 py-2.5 text-sm text-ink hover:border-accent-deep/60 hover:text-accent-deep"
          >
            See the argument map
          </Link>
        </div>
      </section>

      <hr className="rule-soft mx-auto max-w-5xl" />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-serif text-2xl text-ink">Choose a reading path</h2>
        <p className="ui mt-3 max-w-prose text-sm leading-relaxed text-ink-muted">
          Two onboarding paths. The text does not change. What changes is the
          register of the section summaries and the framing of the questions.
        </p>
        <div className="mt-10">
          <PathSelector />
        </div>
      </section>

      <hr className="rule-soft mx-auto max-w-5xl" />

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-serif text-2xl text-ink">What this companion does</h2>
        <div className="ui mt-8 grid gap-8 text-sm leading-relaxed text-ink-soft sm:grid-cols-2">
          <Feature
            title="Surfaces the argument"
            body="Each paragraph is tagged with its rhetorical move — claim, objection, response, evidence, interpretation — so you can see how the book is reasoning, not only what it is saying."
          />
          <Feature
            title="Foregrounds the Qur'an"
            body="Cited verses are pulled into a sidecar in Yusuf Ali's translation, with brief notes on why the verse matters to the argument at hand."
          />
          <Feature
            title="Shows the whole shape"
            body="An argument map lets you zoom out and see how the sections interlock — the objections Bahá'u'lláh addresses and how He answers them."
          />
          <Feature
            title="A bounded companion"
            body="An AI companion is available for questions about a passage, but it only answers with citations from the Íqán and the approved reference sources. It will not invent doctrine."
          />
        </div>
      </section>
    </div>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-serif text-lg text-ink">{title}</h3>
      <p className="mt-2 text-ink-soft">{body}</p>
    </div>
  );
}
