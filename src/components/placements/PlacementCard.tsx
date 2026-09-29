import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import Image from "next/image";

interface PlacementCardProps {
  name: string;
  course: string;
  position: string;
  company: string;
  image: string;
  packageVal?: string;
  quote?: string;
}

export function PlacementCard({ name, course, company, image, packageVal, quote }: PlacementCardProps) {

  const showPackage = packageVal && packageVal !== "";

  return (
    <Card className="group brand-card-hover overflow-hidden h-full flex flex-col">
      <div
        className="relative h-40 w-full overflow-hidden flex items-end justify-center"
        style={{ backgroundImage: "url('https://img.freepik.com/free-vector/abstract-blue-flowing-lines-banner_1048-16396.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
             <div className="relative z-10 w-24 h-24 rounded-full overflow-hidden border-4 border-background shadow-lg mb-0">
               <Image
                 src={image}
                 alt={name}
                 fill
                 className="object-cover object-top"
               />
             </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
           <div className="flex items-center gap-2 mb-1 flex-wrap">
             <h3 className="font-bold text-lg truncate text-foreground group-hover:text-primary transition-colors">{name}</h3>
             {showPackage && (
               <span className="shrink-0 bg-secondary text-secondary-foreground text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                 {packageVal}
               </span>
             )}
           </div>
           <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span className="truncate">{course}</span>
           </div>
           
           {quote && (
              <p className="mt-auto text-xs text-muted-foreground italic">&quot;{quote}&quot;</p>
           )}
      </CardContent>

      <div className="flex items-center justify-between px-4 py-3 border-t border-border/60 bg-muted/30 mt-auto gap-2">
        <Image
          src="https://i.ibb.co/tphyBYTY/sc-logo.png"
          alt="Soft Crayons"
          width={100}
          height={26}
          className="h-6 w-auto object-contain opacity-90 shrink-0"
        />
        <span className="text-primary font-black text-sm shrink-0 tracking-tighter">&rsaquo;&rsaquo;&rsaquo;</span>
        <p className="text-sm font-extrabold text-muted-foreground group-hover:text-primary transition-colors duration-300 truncate text-right tracking-tight uppercase">
          {company}
        </p>
      </div>
    </Card>
  );
}
