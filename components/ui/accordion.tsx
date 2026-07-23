import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";

import { cn } from "@/lib/utils";

// Garden-system accordion on Base UI (shadcn scaffold, deliberately restyled:
// borderless items on hairline separators, the house plus-glyph, panel height
// eased on the garden curve). Arrow keys, Home/End, and disclosure semantics
// come from the primitive.

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b border-hairline", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/trigger flex min-h-11 flex-1 items-start justify-between gap-6 py-6 text-left text-[17px] font-medium text-ink outline-none transition-colors duration-200 hover:text-gold-text aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        {/* The house + / - glyph: the vertical stroke rotates away on open */}
        <span aria-hidden className="relative mt-1 h-4 w-4 shrink-0 text-gold-text">
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-aria-expanded/trigger:rotate-90 motion-reduce:transition-none" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-[var(--accordion-panel-height)] overflow-hidden transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[ending-style]:h-0 data-[starting-style]:h-0 motion-reduce:transition-none"
      {...props}
    >
      <div className={cn("pb-6", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
