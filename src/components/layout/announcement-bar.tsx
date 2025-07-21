
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, ArrowRight, X } from 'lucide-react';
import { getActiveAnnouncement } from '@/services/announcements';
import type { Announcement } from '@/lib/types';
import { cn } from '@/lib/utils';

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function fetchAnnouncement() {
      const activeAnnouncement = await getActiveAnnouncement();
      setAnnouncement(activeAnnouncement);
      
      if (activeAnnouncement) {
        // Check local storage to see if this announcement was dismissed
        const dismissed = localStorage.getItem(`announcement_${activeAnnouncement.id}_dismissed`);
        if (!dismissed) {
          setIsVisible(true);
        }
      }
    }

    fetchAnnouncement();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (announcement) {
      // Store the dismissed state in local storage
      localStorage.setItem(`announcement_${announcement.id}_dismissed`, 'true');
    }
  };
  
  if (!announcement || !isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative z-50 bg-gradient-to-r from-primary to-accent text-primary-foreground transition-transform duration-300',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="container mx-auto px-4 py-2.5 text-sm font-medium">
        <div className="flex items-center justify-center">
          <Megaphone className="h-5 w-5 flex-shrink-0 mr-3" />
          <p className="flex-1 text-center">
            {announcement.message}
            {announcement.link && (
              <Link
                href={announcement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex items-center font-bold hover:underline"
              >
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            )}
          </p>
          <button onClick={handleDismiss} className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors">
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        </div>
      </div>
    </div>
  );
}
