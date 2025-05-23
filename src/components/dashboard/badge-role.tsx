import { Role } from "@/types/user";
import { Shield, ShieldUser, User } from "lucide-react";
import { Badge } from "../ui/badge";

export default function BadgeRole({ role }: { role: Role | undefined }) {
  if (!role) return null;

  const roleColor = {
    superadmin: "bg-nova-secondary text-white",
    admin: "bg-yellow-500",
    user: "",
  };

  const roleIcon = {
    superadmin: <ShieldUser className="w-4 h-4" />,
    admin: <Shield className="w-4 h-4" />,
    user: <User className="w-4 h-4" />,
  };

  return (
    <Badge variant="secondary" className={roleColor[role]}>
      {roleIcon[role]}
      {role.toUpperCase()}
    </Badge>
  );
}
