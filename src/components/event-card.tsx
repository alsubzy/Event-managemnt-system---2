
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Star, Heart, ArrowUpRight, Share2, MoreHorizontal } from 'lucide-react';
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
      action: isFav ? (
        <button 
          onClick={() => toggleFavorite(id)} 
          className="text-xs font-bold uppercase tracking-widest text-primary underline"
        >
          Undo
        </button>
      ) : undefined,
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group bg-card rounded-[1.5rem] overflow-hidden border border-border/40 transition-all duration-300 hover:shadow-xl hover:shadow-black/5"
    >
      <div className="aspect-[16/10] relative overflow-hidden bg-muted">
        <Image 
          src={image} 
          fill 
          alt={title} 
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          data-ai-hint="event visual"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={handleToggleFavorite}
            className={cn(
              "w-10 h-10 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all",
              isFav 
                ? "bg-rose-500 border-rose-500 text-white" 
                : "bg-white/80 border-white/20 text-foreground hover:text-rose-500"
            )}
          >
            <Heart size={18} className={cn(isFav && "fill-current")} />
          </button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-foreground hover:bg-white transition-all">
                <MoreHorizontal size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl p-2 min-w-[140px]">
              <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-medium">
                <Share2 size={14} /> Share
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg gap-2 cursor-pointer font-medium">
                <Calendar size={14} /> Add to Calendar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {status && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-black/80 backdrop-blur-md text-white border-none font-black text-[8px] uppercase tracking-widest px-3 py-1 rounded-full">
              {status}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-primary/60 uppercase tracking-[0.15em]">{category}</span>
          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Calendar size={14} className="text-muted-foreground/50" /> 
            {date}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <MapPin size={14} className="text-muted-foreground/50" /> 
            {location}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <p className="font-black text-foreground">
            {typeof price === 'number' ? `£${price.toLocaleString()}` : price}
          </p>
          <Link href={`/events/${id}`}>
            <span className="text-xs font-black text-muted-foreground group-hover:text-primary transition-all flex items-center gap-1 uppercase tracking-widest">
              Details <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
