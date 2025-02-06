import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Globe, User, MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Nav() {
  return (
    <nav className="bg-[#042759] text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl">
              Voyage Genius
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/search">
                <Button variant="link" className="text-white">Flights</Button>
              </Link>
              <Button variant="link" className="text-white">Hotels</Button>
              <Button variant="link" className="text-white">Car hire</Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-white">
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">EN</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>English</DropdownMenuItem>
                <DropdownMenuItem>Español</DropdownMenuItem>
                <DropdownMenuItem>Français</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="sm" className="text-white">
              <User className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Log in</span>
            </Button>

            <Button variant="ghost" size="sm" className="text-white md:hidden">
              <MenuIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}