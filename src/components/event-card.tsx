
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Star, Heart, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EventCardProps {
  id: string | number;
  title: string;
  image: string;
  date: string;
  location: string;
  price: string;
  rating?: number;
  category: string;
  isBestseller?: boolean;
}

export function EventCard({ id, title, image, date, location, price, rating = 4.9, category, isBestseller }: EventCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image 
          src={image} 
          fill 
          alt={title} 
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 z-10">
          <Button size="icon" variant="secondary" className="rounded-full bg-white/80 backdrop-blur-md border-0 hover:bg-white transition-colors">
            <Heart className="w-5 h-5 text-foreground hover:fill-primary hover:text-primary" />
          </Button>
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {isBestseller && (
            <Badge className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border-0">
              Bestseller
            </Badge>
          )}
          <Badge className="bg-white/80 backdrop-blur-md text-foreground text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border-0">
            {category}
          </Badge>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{category}</span>
          <div className="flex items-center gap-1 text-sm font-bold">
            <Star className="w-4 h-4 text-yellow-500 fill-current" /> {rating}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-3 line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Calendar className="w-3.5 h-3.5 text-primary" /> {date}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <MapPin className="w-3.5 h-3.5 text-primary" /> {location}
          </div>
        </div>
        <div className="flex items-center justify-between pt-5 border-t border-dashed">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1 tracking-wider">Tickets from</p>
            <p className="text-xl font-bold text-foreground">{price}</p>
          </div>
          <Link href={`/events/${id}`}>
            <Button size="sm" className="rounded-xl px-5 h-10 gap-2 font-bold group">
              Details <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
