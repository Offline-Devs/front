"use client";

import { Info, Settings2, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable, TableBody, TableCaption, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/data-table";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal, ModalClose, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { RadioGroup, RadioItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EmptyState } from "@/components/shared/empty-state";

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) { return <section className="grid gap-4 border-b pb-10"><div><h2 className="text-xl font-extrabold">{title}</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p></div>{children}</section>; }

export function DesignSystemShowcase() {
  return <div className="grid gap-10">
    <Section title="رنگ و تایپوگرافی" description="رنگ‌های semantic به‌جای مقدار مستقیم در componentها استفاده می‌شوند."><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[["اصلی", "bg-primary text-primary-foreground"], ["ثانویه", "bg-secondary text-secondary-foreground"], ["موفق", "bg-success text-white"], ["خطا", "bg-destructive text-destructive-foreground"]].map(([label, classes]) => <div key={label} className={`grid h-20 place-items-center rounded-md text-sm font-bold ${classes}`}>{label}</div>)}</div><div className="grid gap-2"><p className="text-3xl font-black">عنوان اصلی فارسی</p><p className="text-lg font-bold">عنوان بخش و محتوای مهم</p><p className="leading-7 text-muted-foreground">متن بدنه با فاصله خطوط مناسب برای خوانایی در نمایشگرهای مختلف.</p></div></Section>

    <Section title="دکمه‌ها و وضعیت‌ها" description="همه variantها شامل focus، disabled و loading هستند."><div className="flex flex-wrap gap-3"><Button>عملیات اصلی</Button><Button variant="secondary">ثانویه</Button><Button variant="outline">حاشیه‌دار</Button><Button variant="ghost">بدون زمینه</Button><Button variant="destructive"><Trash2 className="size-4" />حذف</Button><Button loading>در حال ذخیره</Button><Button disabled>غیرفعال</Button><Tooltip><TooltipTrigger asChild><Button size="icon" variant="outline" aria-label="تنظیمات"><Settings2 className="size-4" /></Button></TooltipTrigger><TooltipContent>تنظیمات حساب</TooltipContent></Tooltip></div></Section>

    <Section title="فرم‌ها" description="label، hint و error به کنترل مرتبط‌اند و با keyboard قابل استفاده هستند."><div className="grid gap-5 md:grid-cols-2"><FormField label="نام و نام خانوادگی" hint="مطابق شناسنامه وارد کنید." required><Input placeholder="مثلاً سارا احمدی" /></FormField><FormField label="شماره موبایل" error="شماره موبایل معتبر نیست."><Input className="dir-ltr text-end" defaultValue="+989121234567" /></FormField><div className="grid gap-2"><Label htmlFor="major-select">رشته تحصیلی</Label><Select dir="rtl" defaultValue="math"><SelectTrigger id="major-select"><SelectValue placeholder="انتخاب رشته" /></SelectTrigger><SelectContent><SelectItem value="math">ریاضی</SelectItem><SelectItem value="science">تجربی</SelectItem><SelectItem value="humanities">انسانی</SelectItem></SelectContent></Select></div><FormField label="توضیحات"><Textarea placeholder="توضیحات تکمیلی..." /></FormField><Checkbox label="قوانین را می‌پذیرم" description="مطالعه قوانین پیش از ثبت الزامی است." defaultChecked /><RadioGroup defaultValue="student" aria-label="نوع حساب"><RadioItem id="role-student" value="student" label="دانش‌آموز" /><RadioItem id="role-admin" value="admin" label="مدیر" /></RadioGroup></div></Section>

    <Section title="بازخورد و وضعیت" description="پیام‌های status، badge، skeleton و empty state."><div className="grid gap-3 sm:grid-cols-2"><Alert><AlertTitle>اطلاع‌رسانی</AlertTitle><AlertDescription>اطلاعات پروفایل پس از بررسی تایید می‌شود.</AlertDescription></Alert><Alert variant="success"><AlertTitle>عملیات موفق</AlertTitle><AlertDescription>آزمون با موفقیت ثبت شد.</AlertDescription></Alert><Alert variant="warning"><AlertTitle>نیاز به توجه</AlertTitle><AlertDescription>پروفایل هنوز تایید نشده است.</AlertDescription></Alert><Alert variant="destructive"><AlertTitle>خطا</AlertTitle><AlertDescription>ذخیره اطلاعات انجام نشد.</AlertDescription></Alert></div><div className="flex flex-wrap gap-2"><Badge>جدید</Badge><Badge variant="success">تاییدشده</Badge><Badge variant="warning">در انتظار</Badge><Badge variant="destructive">ردشده</Badge><Badge variant="outline">پیش‌نویس</Badge></div><div className="grid max-w-sm gap-2"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-20 w-full" /></div><EmptyState title="هنوز آزمونی ثبت نشده" description="پس از ثبت اولین آزمون، اطلاعات آن در این بخش نمایش داده می‌شود." action={<Button size="sm">ثبت آزمون</Button>} /></Section>

    <Section title="لایه‌های تعاملی" description="Modal، Drawer، Tabs، Tooltip و Toast با focus management استاندارد."><div className="flex flex-wrap gap-3"><Modal><ModalTrigger asChild><Button variant="outline">نمایش پنجره</Button></ModalTrigger><ModalContent><ModalHeader><ModalTitle>ویرایش اطلاعات</ModalTitle><ModalDescription>پس از بررسی، تغییرات را ذخیره کنید.</ModalDescription></ModalHeader><ModalFooter><ModalClose asChild><Button variant="outline">انصراف</Button></ModalClose><Button>ذخیره</Button></ModalFooter></ModalContent></Modal><Drawer><DrawerTrigger asChild><Button variant="outline">نمایش کشو</Button></DrawerTrigger><DrawerContent><DrawerHeader><DrawerTitle>فیلترها</DrawerTitle><DrawerDescription>نتایج را بر اساس وضعیت محدود کنید.</DrawerDescription></DrawerHeader></DrawerContent></Drawer><Button variant="outline" onClick={() => toast.success("تغییرات با موفقیت ذخیره شد.")}>نمایش اعلان</Button></div><Tabs defaultValue="summary" dir="rtl"><TabsList><TabsTrigger value="summary">خلاصه</TabsTrigger><TabsTrigger value="details">جزئیات</TabsTrigger></TabsList><TabsContent value="summary">محتوای خلاصه پرونده دانش‌آموز.</TabsContent><TabsContent value="details">اطلاعات تکمیلی و سوابق.</TabsContent></Tabs></Section>

    <Section title="جدول و صفحه‌بندی" description="جدول semantic در موبایل scroll افقی دارد و جهت متن هر سلول قابل کنترل است."><TableContainer><DataTable><TableCaption>نمونه اطلاعات دانش‌آموزان</TableCaption><TableHeader><TableRow><TableHead>نام</TableHead><TableHead>موبایل</TableHead><TableHead>وضعیت</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell>سارا احمدی</TableCell><TableCell><bdi dir="ltr">+98 912 123 4567</bdi></TableCell><TableCell><Badge variant="success">تاییدشده</Badge></TableCell></TableRow></TableBody></DataTable></TableContainer><Pagination page={1} totalPages={4} onPageChange={() => undefined} /></Section>

    <Section title="محتوای ترکیبی RTL/LTR" description="مقادیر فنی با bdi یا dir-ltr از متن فارسی جدا می‌شوند."><Card><CardHeader><CardTitle>نمونه نمایش داده</CardTitle><CardDescription>ترکیب فارسی با اعداد، URL و تاریخ بدون جابه‌جایی بصری.</CardDescription></CardHeader><CardContent className="grid gap-2 text-sm"><p>شماره تماس: <bdi dir="ltr">+98 912 123 4567</bdi></p><p>آدرس: <bdi dir="ltr">https://example.com/student/42</bdi></p><p>تاریخ جلالی: <bdi dir="ltr">1405/03/31</bdi></p><p>شناسه: <code dir="ltr">a1b2-c3d4</code></p></CardContent><CardFooter><Info className="size-4" aria-hidden="true" /><span className="text-xs text-muted-foreground">جهت هر مقدار مستقل نگه داشته شده است.</span></CardFooter></Card></Section>
  </div>;
}
