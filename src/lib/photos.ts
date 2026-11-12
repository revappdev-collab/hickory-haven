const modules = import.meta.glob("../img/*.{jpg,jpeg,png,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function photo(name: string): string | undefined {
  const hit = Object.entries(modules).find(([path]) => path.includes(`/${name}.`));
  return hit?.[1];
}
