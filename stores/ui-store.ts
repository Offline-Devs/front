"use client";
import { create } from "zustand";

// state صرفاً محلی UI مانند sidebar؛ داده‌های API نباید اینجا کپی شوند.
export const useUiStore = create<{ sidebarOpen: boolean; setSidebarOpen: (open: boolean) => void }>((set) => ({ sidebarOpen: false, setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }) }));
