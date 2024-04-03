export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-1">{children}</div>;
}
