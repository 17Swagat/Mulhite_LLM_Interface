import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

export function ExplainSideChat() {

  return (
    <SheetContent className="bg-gray-300">
      <SheetHeader className="py-1 px-2">
        <SheetTitle>Explaining</SheetTitle>
        <SheetDescription>This will be the question</SheetDescription>
      </SheetHeader>
      <div className="w-full h-full bg-amber-700">Selected Contents Are:</div>
      <SheetFooter>
        <Button type="submit">Save changes</Button>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
