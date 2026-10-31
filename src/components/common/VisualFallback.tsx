import React, { useState } from 'react';
import { Laptop, Headphones, CreditCard, Wallet, Calculator, Shirt, Package, Sparkles, Trophy, Calendar, BookOpen } from 'lucide-react';

interface VisualFallbackProps {
  type: 'event' | 'item';
  category?: string;
  theme?: string;
  title: string;
  imageUrl?: string | null;
  className?: string;
  aspect?: '16:9' | '4:3' | '1:1';
}

export const VisualFallback: React.FC<VisualFallbackProps> = ({
  type,
  category = '',
  theme = '',
  title,
  imageUrl,
  className = '',
  aspect = '4:3',
}) => {
  const [imgError, setImgError] = useState(false);
  const aspectClass =
    aspect === '16:9' ? 'aspect-[16/9]' : aspect === '1:1' ? 'aspect-square' : 'aspect-[4/3]';

  // If a real photograph was uploaded and hasn't errored, display the actual image!
  if (imageUrl && !imgError) {
    return (
      <div className={`relative overflow-hidden bg-[#17211D] ${aspectClass} ${className}`}>
        <img
          src={imageUrl}
          alt={title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  // Render thematic clean Apple-inspired minimal architectural canvas
  const getItemIcon = () => {
    const cat = (category || theme || '').toLowerCase();
    if (cat.includes('laptop') || cat.includes('elect')) return <Laptop className="w-10 h-10 text-[#167C61]" strokeWidth={1.5} />;
    if (cat.includes('ear') || cat.includes('head') || cat.includes('pod')) return <Headphones className="w-10 h-10 text-[#167C61]" strokeWidth={1.5} />;
    if (cat.includes('id') || cat.includes('card')) return <CreditCard className="w-10 h-10 text-[#167C61]" strokeWidth={1.5} />;
    if (cat.includes('wallet')) return <Wallet className="w-10 h-10 text-[#167C61]" strokeWidth={1.5} />;
    if (cat.includes('calc')) return <Calculator className="w-10 h-10 text-[#167C61]" strokeWidth={1.5} />;
    if (cat.includes('cloth') || cat.includes('jacket')) return <Shirt className="w-10 h-10 text-[#167C61]" strokeWidth={1.5} />;
    if (cat.includes('book')) return <BookOpen className="w-10 h-10 text-[#167C61]" strokeWidth={1.5} />;
    return <Package className="w-10 h-10 text-[#167C61]" strokeWidth={1.5} />;
  };

  const getEventIcon = () => {
    const cat = category.toLowerCase();
    if (cat.includes('tech')) return <Sparkles className="w-10 h-10 text-[#167C61]" strokeWidth={1.5} />;
    if (cat.includes('sport')) return <Trophy className="w-10 h-10 text-[#167C61]" strokeWidth={1.5} />;
    return <Calendar className="w-10 h-10 text-[#167C61]" strokeWidth={1.5} />;
  };

  if (type === 'event') {
    return (
      <div className={`relative overflow-hidden bg-gradient-to-br from-[#17211D] via-[#1E2E28] to-[#167C61]/80 flex items-center justify-center ${aspectClass} ${className}`}>
        {/* Subtle geometric architectural grid pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#DDEDE6_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Apple style ambient glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#167C61]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#DDEDE6]/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center p-6 text-white max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center mb-3 shadow-sm">
            {getEventIcon()}
          </div>
          <span className="text-[11px] font-medium tracking-wider uppercase text-[#DDEDE6] mb-1">
            {category || 'CampusHub Event'}
          </span>
          <p className="text-sm font-semibold text-white/95 line-clamp-1">{title}</p>
        </div>
      </div>
    );
  }

  // Found item visual preview
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#F7F8F6] via-[#EEF2F0] to-[#E3EBE7] flex items-center justify-center border border-[#E8ECE9] ${aspectClass} ${className}`}>
      {/* Precision ambient background rings */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#78827D_0.75px,transparent_0.75px)] [background-size:12px_12px]" />
      
      <div className="relative z-10 flex flex-col items-center text-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#E8ECE9] shadow-sm flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105">
          {getItemIcon()}
        </div>
        <span className="text-[11px] font-semibold tracking-wide uppercase text-[#167C61] bg-[#DDEDE6]/70 px-2.5 py-0.5 rounded-md">
          {category || 'Item'}
        </span>
      </div>
    </div>
  );
};
