"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Heart, ArrowUpRight, Share2, MoreHorizontal, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useFavoriteStore } from '@/store/use-favorite-store';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EventCardProps {
  id: string;
  title: string;
  image: string;
  date: string;
  location: string;
  price: string | number;
  category: string;
  status?: string;
}

export function EventCard({ id, title, image, date, location, price, category, status }: EventCardProps) {
  const { isFavorite, toggleFavorite } = useFavoriteStore();
  const { toast } = useToast();
  
  const isFav = isFavorite(id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
    
    toast({
      title: isFav ? "Removed from favorites" : "Saved to favorites",
      description: isFav ? `${title} has been removed.` : `${title} is now in your collection.`,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-[2rem] overflow-hidden border border-border/40 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5"
    >
      <div className="aspect-[16/10] relative overflow-hidden bg-muted">
        <Image 
          src={image} 
          fill 
          alt={title} 
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          data-ai-hint="event visual"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-5 right-5 flex flex-col gap-2.5 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
          <button 
            onClick={handleToggleFavorite}
            className={cn(
              "w-11 h-11 rounded-[1.25rem] backdrop-blur-xl border flex items-center justify-center transition-all duration-300 shadow-xl",
              isFav 
                ? "bg-rose-500 border-rose-500 text-white" 
                : "bg-white/90 border-white/20 text-foreground hover:text-rose-500"
            )}
          >
            <Heart size={18} className={cn(isFav && "fill-current")} />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-11 h-11 rounded-[1.25rem] bg-white/90 backdrop-blur-xl border border-white/20 flex items-center justify-center text-foreground hover:bg-white transition-all duration-300 shadow-xl">
                <MoreHorizontal size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px] shadow-2xl">
              <DropdownMenuItem className="rounded-xl gap-3 cursor-pointer font-bold py-3 text-xs uppercase tracking-widest">
                <Share2 size={14} /> Share Event
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl gap-3 cursor-pointer font-bold py-3 text-xs uppercase tracking-widest">
                <Calendar size={14} /> Add to Cal
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-xl gap-3 cursor-pointer font-bold py-3 text-xs uppercase tracking-widest text-primary">
                <ExternalLink size={14} /> Live Page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {status && (
          <div className="absolute top-5 left-5">
            <Badge className="bg-black/90 backdrop-blur-xl text-white border-none font-black text-[9px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-xl">
              {status}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-8 space-y-5">
        <div className="space-y-1">
          <span className="text-[9px] font-black text-primary/40 uppercase tracking-[0.25em]">{category}</span>
          <h3 className="text-xl font-black leading-tight group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-semibold">
            <div className="w-8 h-8 rounded-xl bg-secondary/50 flex items-center justify-center text-primary/60">
              <Calendar size={14} />
            </div>
            {date}
          </div>
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-semibold">
            <div className="w-8 h-8 rounded-xl bg-secondary/50 flex items-center justify-center text-primary/60">
              <MapPin size={14} />
            </div>
            <span className="truncate">{location.split(',')[0]}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-border/40">
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">From</p>
            <p className="font-black text-lg text-[#0B1221]">
              {typeof price === 'number' ? `£${price.toLocaleString()}` : price}
            </p>
          </div>
          <Link href={`/events/${id}`}>
            <button className="h-12 px-6 rounded-2xl bg-[#0B1221] text-white text-xs font-black uppercase tracking-widest hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-2">
              Details <ArrowUpRight size={14} />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}