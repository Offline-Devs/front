import { apiRequest } from "./client";
import type { BlogInput, BlogPost } from "@/types/blog";
import type { StatusResponse } from "@/types/api";
// Combines public article reads with administrator CRUD operations. The client accepts the backend's current HTTP 200 create response despite the older Swagger status declaration.
export const blogApi = {
  publicList: () => apiRequest<BlogPost[]>("/blog", { auth: false }),
  publicGet: (slug: string) => apiRequest<BlogPost>(`/blog/${slug}`, { auth: false }),
  adminList: () => apiRequest<BlogPost[]>("/admin/blog"),
  create: (input: BlogInput) =>
    apiRequest<BlogPost>("/admin/blog", { method: "POST", body: JSON.stringify(input) }),
  update: (id: string, input: BlogInput) =>
    apiRequest<StatusResponse>(`/admin/blog/${id}`, { method: "PUT", body: JSON.stringify(input) }),
  publish: (id: string) =>
    apiRequest<StatusResponse>(`/admin/blog/${id}/publish`, { method: "PUT" }),
  remove: (id: string) => apiRequest<StatusResponse>(`/admin/blog/${id}`, { method: "DELETE" }),
  revalidatePublicCache: () =>
    apiRequest<void>("/api/cache/public-blog", { method: "POST", auth: false }),
};
