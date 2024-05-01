import { DaddusBreadcrumb } from "@/components/daddusBreadcrumb/index";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex h-full w-full flex-col">
        <DaddusBreadcrumb />
        {children}
      </div>
    </div>
  );
}
