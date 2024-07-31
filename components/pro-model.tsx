"use client";

import axios from "axios";
import { useState } from "react";
import {
  MessageSquare,
  Code,
  ImageIcon,
  MusicIcon,
  VideoIcon,
  Check,
  Zap,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { useProModel } from "@/hooks/use-pro-model";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

const tools = [
  {
    label: "Conversation",
    href: "/conversation",
    icon: MessageSquare,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: "Image Generation",
    href: "/image",
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
  },
  {
    label: "Video Generation",
    href: "/video",
    icon: VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-500/10",
  },
  {
    label: "Music Generation",
    href: "/music",
    icon: MusicIcon,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: "Code Generation",
    href: "/code",
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
  },
];

export const ProModal = () => {
  const proModel = useProModel();
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    try {
      setLoading(true);
      const reponse = await axios.get('/api/stripe');
      window.location.href = reponse.data.url;
    } catch (error) {
      toast.error("Something went wrong");
    } finally{
      setLoading(false);
    }
  }
  return (
    <Dialog open={proModel.isOpen} onOpenChange={proModel.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              Upgrade Mixme.
              <Badge className="uppercase text-sm py-1" variant="premium">
                Pro
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {
                tools.map((tool) => (
                    <Card
                        key={tool.label}
                        className="p-3 border-black/5 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-x-4">
                            <div className={cn("w-6 h-6", tool.bgColor)}>
                                <tool.icon className={cn("w-6 h-6", tool.color)} />
                            </div>
                            <div className="font-semibold">
                                {tool.label}
                            </div>
                        </div>
                        <Check className="text-primary w-5 h-5" />
                    </Card>
                ))
            }
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button disabled={loading} onClick={onSubscribe} size='lg' variant={"premium"} className="w-full">
                Upgrade
                <Zap className="w-5 h-5 ml-2 fill-white" />
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
