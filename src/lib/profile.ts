export function getAvatarUrl(name: string) {
  const label = encodeURIComponent(name.trim() || "User");
  return `https://ui-avatars.com/api/?name=${label}&background=10b981&color=052e16&size=256&bold=true`;
}

export const PROFILE_COVER_IMAGE =
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&q=80";

export type UserProfile = {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
};
