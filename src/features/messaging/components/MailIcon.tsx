import { Mail } from "lucide-react";
import { useUnreadMessages } from "../hooks/useMessaging";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const MailIcon = ({ className, variant = "ghost" }: { className?: string, variant?: "ghost" | "ghost-white" }) => {
    const { data: unreadCount = 0 } = useUnreadMessages();
    const navigate = useNavigate();

    const baseClass = cn(
        variant === 'ghost-white' ? 'text-white/80 hover:text-white hover:bg-white/10' : '',
        className
    );

    return (
        <Button
            variant={variant === 'ghost-white' ? 'ghost' : variant}
            size="icon"
            className={cn("relative", baseClass)}
            onClick={() => navigate("/admin/messaging")}
        >
            <Mail className="h-5 w-5" />
            {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-in zoom-in duration-300">
                    {unreadCount > 99 ? '99+' : unreadCount}
                </span>
            )}
        </Button>
    );
};
