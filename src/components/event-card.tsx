"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Star, Heart, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EventCardProps {
  id: string | number;
  title: string;
  image: string;
  date: string;
  location: string;
  price: string;
  category: string;
}

export function EventCard({ id, title, image, date, location, price, category }: EventCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group bg-card rounded-2xl overflow-hidden border border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/5"
    >
      <div className="aspect-[16/10] relative overflow-hidden bg-muted">
        <Image 
          src={image} 
          fill 
          alt={title} 
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-border/20 flex items-center justify-center text-foreground hover:text-rose-500 transition-colors">
            <Heart size={16} />
          </button>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{category}</span>
        </div>
        <h3 className="text-lg font-bold mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-1">{title}</h3>
        
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar size={14} className="text-muted-foreground/60" /> 
            {date}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin size={14} className="text-muted-foreground/60" /> 
            {location}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <p className="font-bold text-foreground">{price}</p>
          <Link href={`/events/${id}`}>
            <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-all flex items-center gap-1">
              View Details <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}