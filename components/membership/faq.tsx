import { faq } from "@/content/library";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// FaqList per DESIGN.md anatomy: borderless accordion (no container boxes),
// hairline separators, + / - glyph, one item open at a time. Rebuilt on the
// Base UI accordion primitive (shadcn) for full keyboard semantics: arrow
// keys walk items, Home/End jump, height eases on the garden curve.

export function FaqList() {
  return (
    <Accordion multiple={false}>
      {faq.map((item) => (
        <AccordionItem key={item.q} value={item.q}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>
            <p className="text-body max-w-[62ch] text-ink-muted">{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
