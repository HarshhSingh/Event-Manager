"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverAnchor = PopoverPrimitive.Anchor;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

interface CustomPopoverProps extends PopoverPrimitive.PopoverContentProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  children: React.ReactNode;
  className?: string;
}
const CustomPopover: React.FC<CustomPopoverProps> = ({
  isOpen,
  onClose,
  anchorEl,
  children,
  className,
  ...props
}) => {
  const popoverAnchorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (anchorEl && popoverAnchorRef.current) {
      const anchorRect = anchorEl.getBoundingClientRect();
      popoverAnchorRef.current.style.position = "absolute";
      popoverAnchorRef.current.style.top = `${
        anchorRect.top + window.scrollY + 30
      }px`;
      popoverAnchorRef.current.style.left = `${
        anchorRect.left + window.scrollX
      }px`;
    }
  }, [anchorEl]);

  if (!isOpen) return null;

  return (
    <Popover open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <PopoverAnchor ref={popoverAnchorRef} />
      <PopoverContent
        className={cn("p-4 bg-white border rounded shadow", className)}
        {...props}
      >
        {children}
      </PopoverContent>
    </Popover>
  );
};

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
  CustomPopover,
};
