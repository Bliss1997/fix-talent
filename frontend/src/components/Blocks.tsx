import type { Block, Inline } from '@/lib/strapi';

// Minimal renderer for Strapi "blocks" rich text. Unknown block types are skipped.
function renderInline(nodes: Inline[] = []) {
  return nodes.map((n, i) => {
    if (n.type === 'link') {
      const safe = /^https?:\/\//i.test(n.url) ? n.url : undefined;
      return (
        <a key={i} href={safe} target="_blank" rel="noopener noreferrer">
          {renderInline(n.children)}
        </a>
      );
    }
    let el: React.ReactNode = n.text;
    if (n.bold) el = <strong>{el}</strong>;
    if (n.italic) el = <em>{el}</em>;
    return <span key={i}>{el}</span>;
  });
}

export function Blocks({ content }: { content?: Block[] | null }) {
  if (!content?.length) return null;
  return (
    <>
      {content.map((b, i) => {
        if (b.type === 'paragraph') return <p key={i}>{renderInline((b as { children: Inline[] }).children)}</p>;
        if (b.type === 'heading') return <h3 key={i}>{renderInline((b as { children: Inline[] }).children)}</h3>;
        if (b.type === 'list') {
          const l = b as Extract<Block, { type: 'list' }>;
          const items = l.children.map((li, j) => <li key={j}>{renderInline(li.children)}</li>);
          return l.format === 'ordered' ? <ol key={i}>{items}</ol> : <ul key={i}>{items}</ul>;
        }
        return null;
      })}
    </>
  );
}
