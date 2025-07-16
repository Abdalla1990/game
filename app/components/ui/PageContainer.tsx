interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
}

const maxWidths = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  full: "max-w-full"
};

export default function PageContainer({
  children,
  title,
  maxWidth = "md"
}: PageContainerProps) {
  return (
    <div className={`${maxWidths[maxWidth]} mx-auto mt-12 p-6 bg-white rounded shadow`}>
      {title && <h1 className="text-2xl font-bold mb-6">{title}</h1>}
      {children}
    </div>
  );
}
