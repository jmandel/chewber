import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { FoodSummary, CategoryTreeNode } from "../api";
import type { CategorySort } from "../stores";
import { usePrefetch } from "../hooks/usePrefetch";
import { useCategories, useCategoryFoods, useCategoryAllFoods, useCategoryTree } from "../hooks/useStoreData";
import { ScorePill, FoodListItem, BackLink } from "../components/shared";

// ── Tree-based Categories Page ──────────────────────────────

function TreeNode({ node, depth, onNav }: { node: CategoryTreeNode; depth: number; onNav: (slug: string) => void }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.filter(c => c.kind === "category" && c.total_count > 0).length > 0;
  const isLeaf = !hasChildren;

  return (
    <div>
      <div
        onClick={() => isLeaf ? onNav(node.slug) : setExpanded(!expanded)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: depth === 0 ? "10px 12px" : "7px 12px",
          paddingLeft: 12 + depth * 20,
          cursor: "pointer",
          borderBottom: "1px solid var(--slate)",
          background: depth === 0 ? "var(--parchment)" : undefined,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, flex: 1 }}>
          {hasChildren && (
            <span style={{
              fontSize: 10, color: "var(--fog)", transition: "transform 0.15s",
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              flexShrink: 0, width: 14, textAlign: "center",
            }}>▶</span>
          )}
          {isLeaf && <span style={{ width: 14, flexShrink: 0 }} />}
          <span style={{
            fontWeight: depth === 0 ? 700 : 500,
            fontSize: depth === 0 ? 14 : 13,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{node.display_name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span className="muted" style={{ fontSize: 12 }}>
            {node.food_count}{node.total_count > node.food_count ? ` / ${node.total_count}` : ""}
          </span>
          {!isLeaf && (
            <span
              onClick={(e) => { e.stopPropagation(); onNav(node.slug); }}
              style={{ fontSize: 11, color: "var(--kale)", cursor: "pointer", padding: "2px 6px", borderRadius: 4, background: "color-mix(in srgb, var(--kale) 10%, transparent)" }}
            >View</span>
          )}
        </div>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children
            .filter(c => c.kind === "category" && c.total_count > 0)
            .map(c => <TreeNode key={c.slug} node={c} depth={depth + 1} onNav={onNav} />)}
        </div>
      )}
    </div>
  );
}

export function CategoriesPage() {
  const nav = useNavigate();
  const { tree, loaded } = useCategoryTree();
  const { categories } = useCategories();
  const [filter, setFilter] = useState("");
  const [showTraits, setShowTraits] = useState(false);

  // Category roots (food types with foods)
  const catRoots = (tree ?? []).filter(n => n.kind === "category" && n.total_count > 0);
  // Trait tags with foods
  const traits = categories.filter(c => c.kind === "trait" && c.food_count > 0)
    .sort((a, b) => b.food_count - a.food_count);

  const filteredCats = filter
    ? flatFilterTree(catRoots, filter)
    : catRoots;

  const filteredTraits = filter
    ? traits.filter(t => t.display_name.toLowerCase().includes(filter.toLowerCase()))
    : traits;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <BackLink />
      <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>Categories</h2>
      <input
        placeholder="Filter…"
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{ width: "100%", marginBottom: 12, fontSize: 14, padding: "10px 14px", boxSizing: "border-box" }}
      />

      {!loaded && <div className="muted" style={{ textAlign: "center", padding: 20 }}><div className="spinner" /></div>}

      {loaded && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {filteredCats.length === 0 && (
            <div className="muted" style={{ textAlign: "center", padding: 20 }}>No matching categories.</div>
          )}
          {filteredCats.map(node => (
            <TreeNode key={node.slug} node={node} depth={0} onNav={slug => nav(`/category/${encodeURIComponent(slug)}`)} />
          ))}
        </div>
      )}

      {/* Trait tags section */}
      {loaded && filteredTraits.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div
            onClick={() => setShowTraits(!showTraits)}
            style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 8 }}
          >
            <span style={{ fontSize: 10, color: "var(--fog)", transition: "transform 0.15s", transform: showTraits ? "rotate(90deg)" : "rotate(0deg)" }}>▶</span>
            <span style={{ fontWeight: 600, fontSize: 14, color: "var(--fog)" }}>Attributes &amp; Traits</span>
            <span className="muted" style={{ fontSize: 12 }}>({filteredTraits.length})</span>
          </div>
          {showTraits && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {filteredTraits.map(t => (
                <span
                  key={t.slug}
                  onClick={() => nav(`/category/${encodeURIComponent(t.slug)}`)}
                  className="badge"
                  style={{ cursor: "pointer", fontSize: 12, padding: "4px 10px" }}
                >{t.display_name} <span className="muted" style={{ fontSize: 10 }}>({t.food_count})</span></span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Recursively filter tree nodes by display_name match, keeping ancestor chain. */
function flatFilterTree(nodes: CategoryTreeNode[], filter: string): CategoryTreeNode[] {
  const lc = filter.toLowerCase();
  function matches(node: CategoryTreeNode): CategoryTreeNode | null {
    const selfMatch = node.display_name.toLowerCase().includes(lc) || node.slug.includes(lc);
    const childMatches = node.children.map(matches).filter(Boolean) as CategoryTreeNode[];
    if (selfMatch || childMatches.length > 0) {
      return { ...node, children: selfMatch ? node.children : childMatches };
    }
    return null;
  }
  return nodes.map(matches).filter(Boolean) as CategoryTreeNode[];
}

// ── Score distribution bar ──────────────────────────────────

function CategoryScoreBar({ foods }: { foods: FoodSummary[] }) {
  const scored = foods.filter(f => f.score != null);
  if (scored.length < 2) return null;
  const buckets = { excellent: 0, good: 0, mediocre: 0, poor: 0 };
  for (const f of scored) {
    const s = f.score!;
    if (s >= 85) buckets.excellent++;
    else if (s >= 65) buckets.good++;
    else if (s >= 40) buckets.mediocre++;
    else buckets.poor++;
  }
  const max = Math.max(buckets.excellent, buckets.good, buckets.mediocre, buckets.poor);
  const rows: { label: string; range: string; count: number; color: string }[] = [
    { label: "Excellent", range: "85\u2013100", count: buckets.excellent, color: "var(--kale)" },
    { label: "Good",      range: "65\u201384",  count: buckets.good,      color: "var(--amber)" },
    { label: "Mediocre",  range: "40\u201364",  count: buckets.mediocre,  color: "var(--tangerine)" },
    { label: "Poor",      range: "0\u201339",   count: buckets.poor,      color: "var(--coral)" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {rows.map(r => (
        <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, width: 62, flexShrink: 0, color: r.count ? r.color : "var(--fog)" }}>{r.label}</span>
          <span style={{ fontSize: 10, color: "var(--fog)", width: 36, flexShrink: 0, textAlign: "right" }}>{r.range}</span>
          <div style={{ flex: 1, height: 18, background: "var(--slate)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ width: max ? `${(r.count / max) * 100}%` : "0%", height: "100%", background: r.color, borderRadius: 4, minWidth: r.count ? 2 : 0, transition: "width 0.3s ease" }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 800, width: 22, textAlign: "right", flexShrink: 0, color: r.count ? "var(--cream)" : "var(--fog)" }}>{r.count}</span>
        </div>
      ))}
    </div>
  );
}

function CategoryTopFoods({ foods, onClickFood }: { foods: FoodSummary[]; onClickFood: (f: FoodSummary) => void }) {
  const top3 = foods.filter(f => f.score != null).sort((a, b) => (b.score ?? 0) - (a.score ?? 0)).slice(0, 3);
  if (top3.length === 0) return null;
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <div className="card cat-top-card" style={{ marginBottom: 8, border: "1px solid color-mix(in srgb, var(--kale) 40%, var(--slate))" }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: "var(--kale)" }}>🏆 Best in Category</div>
      {top3.map((f, i) => (
        <div key={f.id} onClick={() => onClickFood(f)} style={{
          display: "flex", alignItems: "center", gap: 10, padding: "7px 0",
          borderBottom: i < top3.length - 1 ? "1px solid var(--slate)" : "none",
          cursor: "pointer"
        }}>
          <span style={{ fontSize: 18, flexShrink: 0, width: 28, textAlign: "center" }}>{medals[i]}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.canonical_name}</div>
            {f.brand && <div className="muted" style={{ fontSize: 11 }}>{f.brand}</div>}
          </div>
          <ScorePill score={f.score ?? null} size={18} />
        </div>
      ))}
    </div>
  );
}

// ── Individual category page ────────────────────────────────

function Breadcrumbs({ slug, categories }: { slug: string; categories: { slug: string; display_name: string; parent_slug: string | null }[] }) {
  const nav = useNavigate();
  const bySlug = new Map(categories.map(c => [c.slug, c]));
  const crumbs: { slug: string; name: string }[] = [];
  let cur: string | null = slug;
  while (cur) {
    const cat = bySlug.get(cur);
    if (!cat) break;
    crumbs.unshift({ slug: cat.slug, name: cat.display_name });
    cur = cat.parent_slug;
  }
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center", fontSize: 12, marginBottom: 8, color: "var(--fog)" }}>
      <span onClick={() => nav('/categories')} style={{ cursor: "pointer", color: "var(--kale)" }}>Categories</span>
      {crumbs.map((c) => (
        <React.Fragment key={c.slug}>
          <span style={{ opacity: 0.5 }}>›</span>
          {c.slug !== slug ? (
            <span onClick={() => nav(`/category/${encodeURIComponent(c.slug)}`)} style={{ cursor: "pointer", color: "var(--kale)" }}>{c.name}</span>
          ) : (
            <span style={{ fontWeight: 600 }}>{c.name}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function SubcategoryChips({ slug, tree }: { slug: string; tree: CategoryTreeNode[] | null }) {
  const nav = useNavigate();
  if (!tree) return null;
  // Find node in tree
  function find(nodes: CategoryTreeNode[]): CategoryTreeNode | null {
    for (const n of nodes) {
      if (n.slug === slug) return n;
      const found = find(n.children);
      if (found) return found;
    }
    return null;
  }
  const node = find(tree);
  const children = node?.children.filter(c => c.kind === "category" && c.total_count > 0) ?? [];
  if (children.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
      {children.sort((a, b) => b.total_count - a.total_count).map(c => (
        <span
          key={c.slug}
          onClick={() => nav(`/category/${encodeURIComponent(c.slug)}`)}
          className="badge"
          style={{ cursor: "pointer", fontSize: 12, padding: "4px 10px" }}
        >{c.display_name} <span className="muted" style={{ fontSize: 10 }}>({c.total_count})</span></span>
      ))}
    </div>
  );
}

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const nav = useNavigate();
  const prefetch = usePrefetch();
  const { categories } = useCategories();
  const { tree } = useCategoryTree();
  const [sort, setSort] = useState<CategorySort>("recent");
  const [loadingMore, setLoadingMore] = useState(false);

  const cat = categories.find(c => c.slug === slug);
  const catName = cat?.display_name ?? (slug ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "");
  const catDesc = cat?.description ?? null;
  const page = useCategoryFoods(slug, sort);
  const allFoods = useCategoryAllFoods(slug);
  const loading = page === null;
  const foods = page?.foods ?? [];
  const total = page?.total ?? 0;
  const hasMore = page?.hasMore ?? false;

  const sortOptions: { value: CategorySort; label: string }[] = [
    { value: "recent", label: "Recent" }, { value: "score_desc", label: "Best Score" }, { value: "score_asc", label: "Worst Score" },
  ];
  const goFood = (f: FoodSummary) => nav(`/food/${encodeURIComponent(f.slug ?? f.id)}`);

  const loadMore = async () => {
    if (!slug || loadingMore) return;
    setLoadingMore(true);
    try {
      const { useCategoryStore } = await import("../stores/categoryStore");
      await useCategoryStore.getState().fetchMoreCategoryFoods(slug, sort);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <BackLink />
      <div className="card">
        <Breadcrumbs slug={slug!} categories={categories} />
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{catName}</div>
        {catDesc && <div className="muted" style={{ fontSize: 13, marginBottom: 4 }}>{catDesc}</div>}
        <div className="muted" style={{ fontSize: 13 }}>{total} food{total !== 1 ? "s" : ""}</div>
        <SubcategoryChips slug={slug!} tree={tree} />
      </div>
      {!loading && allFoods && allFoods.length > 1 && <div className="card" style={{ marginTop: 8 }}><div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Score Distribution</div><CategoryScoreBar foods={allFoods} /></div>}
      {!loading && allFoods && allFoods.length > 0 && <div style={{ marginTop: 8 }}><CategoryTopFoods foods={allFoods} onClickFood={goFood} /></div>}
      <div className="card" style={{ marginTop: 8 }}>
        <div className="cat-sort-bar">{sortOptions.map(opt => (<button key={opt.value} className={`cat-sort-btn${sort === opt.value ? " active" : ""}`} onClick={() => setSort(opt.value)}>{opt.label}</button>))}</div>
        {loading && <div className="muted" style={{ textAlign: "center", padding: 20 }}>Loading…</div>}
        {!loading && foods.length === 0 && <div className="muted" style={{ textAlign: "center", padding: 20 }}>No foods in this category yet.</div>}
        {foods.map(f => <FoodListItem key={f.id} food={f} onClick={() => goFood(f)} onHover={() => prefetch(`/food/${encodeURIComponent(f.slug ?? f.id)}`)} />)}
        {hasMore && (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <button
              onClick={loadMore}
              disabled={loadingMore}
              style={{
                padding: "8px 24px", fontSize: 13, fontWeight: 600,
                borderRadius: 6, border: "1px solid var(--slate)",
                background: "var(--parchment)", cursor: "pointer",
                color: "var(--kale)"
              }}
            >{loadingMore ? "Loading…" : `Show more (${foods.length} of ${total})`}</button>
          </div>
        )}
      </div>
    </div>
  );
}
