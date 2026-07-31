import Link from "next/link";

export default function GerelateerdeLinks({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  return (
    <div className="border-t border-pink/10 pt-8 mt-4">
      <p className="text-sm font-semibold text-dark mb-3">Ook interessant</p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-pink-dark font-semibold hover:underline"
            >
              {link.label} →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
