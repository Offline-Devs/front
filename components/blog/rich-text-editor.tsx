"use client";

import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo2,
  SeparatorHorizontal,
  Undo2,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type HTMLAttributes,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { sanitizeArticleHtml } from "@/lib/content/sanitize";

type RichTextEditorProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
};

const blockFormats = {
  paragraph: "p",
  h2: "h2",
  h3: "h3",
  quote: "blockquote",
} as const;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textToHtml(value: string) {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function RichTextEditor({
  value,
  onChange,
  className,
  "aria-invalid": ariaInvalid,
  ...props
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(!value.trim());

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor) return;
    editor.innerHTML = sanitizeArticleHtml(value);
    setIsEmpty(!editor.textContent?.trim());
  }, [value]);

  function emitChange() {
    const editor = editorRef.current;
    if (!editor) return;
    const html = sanitizeArticleHtml(editor.innerHTML);
    setIsEmpty(!editor.textContent?.trim());
    onChange(html);
  }

  function runCommand(command: string, argument?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, argument);
    emitChange();
  }

  function setBlock(format: keyof typeof blockFormats) {
    runCommand("formatBlock", blockFormats[format]);
  }

  function addLink() {
    const href = window.prompt("نشانی لینک را وارد کنید:");
    if (!href?.trim()) return;
    runCommand("createLink", href.trim());
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    const html = textToHtml(event.clipboardData.getData("text/plain"));
    if (!html) return;
    document.execCommand("insertHTML", false, html);
    emitChange();
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-input bg-card shadow-sm",
        ariaInvalid && "border-destructive",
        className,
      )}
    >
      <div className="flex flex-wrap gap-1 border-b border-border bg-muted/40 p-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="پاراگراف"
          aria-label="پاراگراف"
          onClick={() => setBlock("paragraph")}
        >
          <Pilcrow className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="تیتر اصلی"
          aria-label="تیتر اصلی"
          onClick={() => setBlock("h2")}
        >
          <Heading2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="زیرتیتر"
          aria-label="زیرتیتر"
          onClick={() => setBlock("h3")}
        >
          <Heading3 className="size-4" />
        </Button>
        <span className="mx-1 w-px self-stretch bg-border" aria-hidden="true" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="پررنگ"
          aria-label="پررنگ"
          onClick={() => runCommand("bold")}
        >
          <Bold className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="کج"
          aria-label="کج"
          onClick={() => runCommand("italic")}
        >
          <Italic className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="لینک"
          aria-label="لینک"
          onClick={addLink}
        >
          <LinkIcon className="size-4" />
        </Button>
        <span className="mx-1 w-px self-stretch bg-border" aria-hidden="true" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="فهرست"
          aria-label="فهرست"
          onClick={() => runCommand("insertUnorderedList")}
        >
          <List className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="فهرست شماره‌دار"
          aria-label="فهرست شماره‌دار"
          onClick={() => runCommand("insertOrderedList")}
        >
          <ListOrdered className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="نقل‌قول"
          aria-label="نقل‌قول"
          onClick={() => setBlock("quote")}
        >
          <Quote className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="خط جداکننده"
          aria-label="خط جداکننده"
          onClick={() => runCommand("insertHorizontalRule")}
        >
          <SeparatorHorizontal className="size-4" />
        </Button>
        <span className="mx-1 w-px self-stretch bg-border" aria-hidden="true" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="برگشت"
          aria-label="برگشت"
          onClick={() => runCommand("undo")}
        >
          <Undo2 className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="تکرار"
          aria-label="تکرار"
          onClick={() => runCommand("redo")}
        >
          <Redo2 className="size-4" />
        </Button>
      </div>
      <div className="relative">
        {isEmpty && (
          <p className="pointer-events-none absolute inset-x-5 top-5 text-sm text-muted-foreground">
            متن مقاله را اینجا بنویسید...
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          role="textbox"
          aria-multiline="true"
          aria-invalid={ariaInvalid}
          className="article-content min-h-80 px-5 py-5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
          onInput={emitChange}
          onBlur={emitChange}
          onPaste={handlePaste}
          suppressContentEditableWarning
          {...props}
        />
      </div>
    </div>
  );
}
