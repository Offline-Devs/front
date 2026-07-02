"use client";

import { Camera, ShieldCheck, UserRound } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { cn } from "@/lib/cn";
import { resolveUploadUrl } from "@/lib/upload-url";

type ProfilePhotoPreviewProps = {
  src?: string;
  label: string;
  fallback?: "student" | "admin" | "camera";
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: "size-11",
  md: "size-20",
  lg: "size-28",
};

const iconClasses = {
  sm: "size-5",
  md: "size-8",
  lg: "size-10",
};

export function ProfilePhotoPreview({
  src,
  label,
  fallback = "student",
  size = "sm",
  className,
}: ProfilePhotoPreviewProps) {
  const [open, setOpen] = useState(false);
  const resolvedSrc = src ? resolveUploadUrl(src) : "";
  const fallbackIcon =
    fallback === "admin" ? (
      <ShieldCheck className={iconClasses[size]} aria-hidden="true" />
    ) : fallback === "camera" ? (
      <Camera className={iconClasses[size]} aria-hidden="true" />
    ) : (
      <UserRound className={iconClasses[size]} aria-hidden="true" />
    );
  const frameClass = cn(
    "relative grid shrink-0 place-items-center overflow-hidden rounded-full border-2 border-card bg-secondary text-primary shadow-[0_0_0_2px_var(--primary)]",
    sizeClasses[size],
    src && "cursor-zoom-in transition-transform duration-200 hover:scale-105",
    className,
  );

  return (
    <>
      <button
        type="button"
        className={frameClass}
        aria-label={src ? `مشاهده تصویر پروفایل ${label}` : label}
        title={src ? `مشاهده تصویر پروفایل ${label}` : label}
        disabled={!src}
        onClick={() => src && setOpen(true)}
      >
        {src ? (
          <Image
            src={resolvedSrc}
            alt={`تصویر پروفایل ${label}`}
            fill
            sizes={size === "sm" ? "44px" : size === "md" ? "80px" : "112px"}
            className="object-cover"
            unoptimized
          />
        ) : (
          fallbackIcon
        )}
      </button>

      {src && (
        <Modal open={open} onOpenChange={setOpen}>
          <ModalContent className="max-w-3xl gap-5 p-4 sm:p-5">
            <ModalHeader>
              <ModalTitle>تصویر پروفایل</ModalTitle>
              <ModalDescription>{label}</ModalDescription>
            </ModalHeader>
            <div className="relative min-h-[18rem] overflow-hidden rounded-lg bg-muted sm:min-h-[32rem]">
              <Image
                src={resolvedSrc}
                alt={`تصویر پروفایل ${label}`}
                fill
                sizes="min(100vw, 48rem)"
                className="object-contain"
                unoptimized
                priority
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-fit justify-self-end"
              onClick={() => setOpen(false)}
            >
              بستن
            </Button>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
