import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  profile: {
    name: string;
    role: string;
    image?: string;
    description: string;
    since?: string;
  } | null;
}

export function ProfileDialog({ isOpen, onOpenChange, profile }: ProfileDialogProps) {
  if (!profile) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-white dark:bg-slate-900 border-none shadow-2xl">
        <div className="absolute right-4 top-4 z-50">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white md:text-slate-500"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-full max-h-[90vh]">
          <div className="relative h-24 md:h-36 bg-gradient-to-r from-primary to-blue-600">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          </div>

          <div className="px-6 md:px-12 pb-12 -mt-20 relative">
            <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
              <Avatar className="w-40 h-40 md:w-48 md:h-48 border-8 border-white dark:border-slate-900 shadow-2xl">
                <AvatarImage src={profile.image} alt={profile.name} className="object-cover" />
                <AvatarFallback className="text-4xl bg-slate-100 dark:bg-slate-800 text-primary font-bold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 pb-4 text-center md:text-left">
                <div className="space-y-1">
                  <DialogTitle className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {profile.name}
                  </DialogTitle>
                  <p className="text-xl font-semibold text-primary/90">
                    {profile.role} {profile.since && (<Badge variant="secondary" className="mt-3 px-4 py-1 text-sm font-medium bg-primary/10 text-primary border-none">{profile.since}</Badge>)}
                  </p>
                </div>

              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-1 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                <span className="text-sm font-bold uppercase tracking-widest text-slate-400">Biographie</span>
                <div className="h-1 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
              </div>

              <div className="whitespace-pre-line text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
                {profile.description}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
