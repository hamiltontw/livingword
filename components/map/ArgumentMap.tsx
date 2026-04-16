import Link from "next/link";
import type { ArgumentMap, ArgumentNode } from "@/lib/types";
import { MoveBadge } from "@/components/reader/MoveBadge";

function childrenOf(map: ArgumentMap, parentId: string): ArgumentNode[] {
  return map.nodes.filter((n) => n.parents.includes(parentId));
}

export function ArgumentMapView({ map }: { map: ArgumentMap }) {
  return (
    <ol className="space-y-8">
      {map.rootIds.map((id) => {
        const node = map.nodes.find((n) => n.id === id);
        if (!node) return null;
        return (
          <li key={id}>
            <Node map={map} node={node} depth={0} />
          </li>
        );
      })}
    </ol>
  );
}

function Node({
  map,
  node,
  depth,
}: {
  map: ArgumentMap;
  node: ArgumentNode;
  depth: number;
}) {
  const children = childrenOf(map, node.id);
  return (
    <div
      className="relative"
      style={{ paddingLeft: depth > 0 ? "1.5rem" : undefined }}
    >
      {depth > 0 && (
        <span
          aria-hidden
          className="absolute left-0 top-4 h-px w-4 bg-rule"
        />
      )}
      <article className="rounded-sm border border-rule bg-paper-deep/40 p-5">
        <div className="flex flex-wrap items-center gap-3">
          <MoveBadge move={node.kind} />
          <h3 className="font-serif text-lg text-ink">{node.label}</h3>
        </div>
        <p className="ui mt-3 text-sm leading-relaxed text-ink-soft">
          {node.summary}
        </p>
        {node.paragraphIds.length > 0 && (
          <ul className="ui mt-4 flex flex-wrap gap-2">
            {node.paragraphIds.map((pid) => (
              <li key={pid}>
                <Link
                  href={`/read/${pid}`}
                  className="inline-flex rounded-sm border border-rule bg-paper px-2 py-0.5 text-xs text-ink-soft hover:border-accent-deep/60 hover:text-accent-deep"
                >
                  ¶{pid.replace(/^p/, "")}
                </Link>
              </li>
            ))}
          </ul>
        )}
        {node.paragraphIds.length === 0 && (
          <p className="ui mt-4 text-xs italic text-ink-faint">
            Paragraphs for this node not yet ingested.
          </p>
        )}
      </article>
      {children.length > 0 && (
        <ol className="mt-4 space-y-4 border-l border-rule pl-0">
          {children.map((child) => (
            <li key={child.id}>
              <Node map={map} node={child} depth={depth + 1} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
