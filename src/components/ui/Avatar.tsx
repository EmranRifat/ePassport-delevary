"use client";

interface AvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-8 h-8 text-sm",
  md: "w-9 h-9 text-sm",
  lg: "w-11 h-11 text-base",
};

const Avatar = ({ name = "User", size = "md" }: AvatarProps) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={`${sizeMap[size]} 
        rounded-full 
        bg-gradient-to-br from-purple-500 to-indigo-600
        flex items-center justify-center
        font-semibold text-white
        select-none`}
    >
      {initial}
      
    </div>
  );
};

export default Avatar;
