/**
 * @file components/shared/confirm-dialog.tsx
 * @description Generic confirmation dialog for destructive or irreversible actions.
 *
 * Wraps the Radix UI Dialog primitive via the local Modal component. Accepts an
 * arbitrary trigger element (asChild), a title, description, and optional custom
 * confirm button label. Shows a loading spinner on the confirm button while the
 * parent mutation is pending.
 *
 * Used throughout the app for delete and revoke confirmation flows.
 */
"use client";

import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";

type ConfirmDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
};
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = "تأیید",
  loading,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal>
      <ModalTrigger asChild>{trigger}</ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          <ModalDescription>{description}</ModalDescription>
        </ModalHeader>
        <ModalFooter>
          <ModalClose asChild>
            <Button variant="outline">انصراف</Button>
          </ModalClose>
          <Button variant="destructive" loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
