export default function Vraag({
  vraag,
  children,
}: {
  vraag: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-12">
      <h2 className="font-[family-name:var(--font-fredoka)] text-2xl sm:text-3xl font-bold text-dark mb-4">
        {vraag}
      </h2>
      <div className="text-dark/80 leading-relaxed space-y-4 [&_table]:mt-2">
        {children}
      </div>
    </div>
  );
}
