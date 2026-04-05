"use client";

interface AvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-8 h-8 text-sm",
  md: "w-9 h-9 text-sm",
  lg: "w-8 h-8 md:w-10 md:h-10   text-sm md:text-base",
};

const Avatar = ({ name = "User", size = "md" }: AvatarProps) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={`${sizeMap[size]} 
        rounded-full 
        bg-green-200 dark:bg-gray-400
        flex items-center justify-center
        font-semibold text-gray-800
        select-none`}
    >
      {initial}
      
    </div>
  );
};

export default Avatar;
