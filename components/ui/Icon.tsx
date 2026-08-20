import {
  Heart,
  Cake,
  Briefcase,
  School,
  GraduationCap,
  Landmark,
  Mic,
  Music,
  Trophy,
  Users,
  Camera,
  Globe,
  CheckCircle2,
  QrCode,
  Image as ImageIcon,
  Upload,
  Calendar,
  Bell,
  BarChart3,
  Palette,
  Sparkles,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  ring: Heart,
  cake: Cake,
  briefcase: Briefcase,
  school: School,
  graduation: GraduationCap,
  landmark: Landmark,
  mic: Mic,
  music: Music,
  trophy: Trophy,
  users: Users,
  camera: Camera,
  planner: ClipboardList,
  heart: Heart,
  globe: Globe,
  check: CheckCircle2,
  qr: QrCode,
  image: ImageIcon,
  upload: Upload,
  calendar: Calendar,
  bell: Bell,
  chart: BarChart3,
  palette: Palette,
  sparkles: Sparkles,
};

interface IconProps {
  name: string;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, className = "h-6 w-6", strokeWidth = 1.75 }: IconProps) {
  const Component = iconMap[name] ?? Sparkles;
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden />;
}
