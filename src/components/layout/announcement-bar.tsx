
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Megaphone, ArrowRight } from 'lucide-react';
import { getActiveAnnouncement } from '@/services/announcements';
import type { Announcement } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '../ui/button';

export function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchAnnouncement() {
      const activeAnnouncement = await getActiveAnnouncement();
      if (activeAnnouncement) {
        setAnnouncement(activeAnnouncement);
        // Check session storage to see if this announcement was seen this session
        const seenInSession = sessionStorage.getItem(`announcement_${activeAnnouncement.id}_seen`);
        if (!seenInSession) {
          setIsOpen(true);
        }
      }
    }

    fetchAnnouncement();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (announcement) {
      // Store the seen state in session storage
      sessionStorage.setItem(`announcement_${announcement.id}_seen`, 'true');
    }
  };
  
  if (!announcement) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[480px] bg-slate-900 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
              Announcement
            </DialogTitle>
            <DialogDescription className="pt-4 text-slate-300 text-base">
              {announcement.message}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={handleClose}>Close</Button>
            {announcement.link && (
              <Button asChild>
                  <Link href={announcement.link} target="_blank" rel="noopener noreferrer" onClick={handleClose}>
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </DialogContent>
    </Dialog>
  );
}
