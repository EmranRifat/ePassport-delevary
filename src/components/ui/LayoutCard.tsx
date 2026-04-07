import React, { ReactNode } from "react";

interface LayoutCardProps {
  children: ReactNode; // ✅ এখানে type fix
  shadow?: "sm" | "md" | "lg" | "xl" | "2xl" | "none";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  border?: "0" | "1" | "2" | "4" | "8";
  padding?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10" | "12";
  className?: string;
}

const LayoutCard: React.FC<LayoutCardProps> = ({
  children,
  shadow = "md",
  rounded = "lg",
  border = "2",
  padding = "6",
  className = "",
}) => {
  const shadowClass = shadow === "none" ? "shadow-none" : `shadow-${shadow}`;
  const roundedClass = `rounded-${rounded}`;
  const borderClass = `border-${border} border-black`;
  const paddingClass = `p-${padding}`;

  return (
    <div className={`${borderClass} ${roundedClass} ${shadowClass} ${paddingClass} bg-white dark:bg-gray-800 ${className}`}>
      {children}
    </div>
  );
};

export default LayoutCard;