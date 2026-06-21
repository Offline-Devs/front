"use client";

import { Button } from "@/components/ui/button";
import { Modal, ModalClose, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from "@/components/ui/modal";

type ConfirmDialogProps = { trigger: React.ReactNode; title: string; description: string; confirmLabel?: string; loading?: boolean; onConfirm: () => void };
export function ConfirmDialog({ trigger, title, description, confirmLabel = "تأیید", loading, onConfirm }: ConfirmDialogProps) {
  return <Modal><ModalTrigger asChild>{trigger}</ModalTrigger><ModalContent><ModalHeader><ModalTitle>{title}</ModalTitle><ModalDescription>{description}</ModalDescription></ModalHeader><ModalFooter><ModalClose asChild><Button variant="outline">انصراف</Button></ModalClose><Button variant="destructive" loading={loading} onClick={onConfirm}>{confirmLabel}</Button></ModalFooter></ModalContent></Modal>;
}
