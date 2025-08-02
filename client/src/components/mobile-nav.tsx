
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'AI Content', href: '/ai-content' },
  { name: 'Calendar', href: '/calendar' },
  { name: 'Analytics', href: '/ai-insights' },
  { name: 'Performance', href: '/performance' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="touch-target"
            size="sm"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] sm:w-[350px]">
          <div className="flex flex-col space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">SocialAI Pro</h2>
            </div>
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                >
                  <Button
                    variant={location === item.href ? "default" : "ghost"}
                    className="w-full justify-start touch-target"
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
