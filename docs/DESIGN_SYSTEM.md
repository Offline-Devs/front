# Design System

## Principles

- Persian-first, mobile-first, and RTL at the document root.
- Semantic tokens instead of hard-coded colors in components.
- Logical CSS properties (`start`, `end`, `ms`, `me`, `border-s`) for layout direction.
- Native semantics and Radix primitives for keyboard and focus behavior.
- Visible focus, minimum 40px interactive targets, reduced-motion support, and explicit async states.

## Tokens

Tokens live in `app/globals.css`: background, foreground, card, primary, secondary, muted, accent, destructive, success, warning, border, input, ring, three radii, two shadows, and content width. Tailwind utilities map to these CSS variables through `@theme inline`.

## Components

UI primitives live in `components/ui`: Button, Input, Textarea, Select, Checkbox, RadioGroup, FormField, Card, Badge, Alert, Modal, Drawer, Tabs, Table, Pagination, Tooltip, Skeleton, and Toast. Shared domain-neutral compositions live in `components/shared`.

## RTL and mixed content

The document is RTL. Phone numbers, URLs, IDs, dates, and code must use `<bdi dir="ltr">` or the `.dir-ltr` utility. Do not switch an entire form or table to LTR for a single technical value.

## Review route

`/design-system` renders every primitive and state in development, test, and staging. It returns 404 in production. Review it at mobile, tablet, and desktop widths before changing tokens or component APIs.

## Accessibility gate

`npm test` checks label association, accessible descriptions, axe rules, dialog dismissal, disabled/loading state, and RTL tab keyboard navigation. `npm run lint`, `npm run typecheck`, and `npm run build` remain required before commit.
