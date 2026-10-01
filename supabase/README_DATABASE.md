# 🗄️ دليل تشغيل وتثبيت قاعدة بيانات متجر درش (DRSH Database Guide)

تم إعداد سكريبت قاعدة بيانات شامل في ملف `schema.sql` مبني على **PostgreSQL 16** ومتوافق بنسبة 100% مع منصة **Supabase**.

---

## 📌 محتويات سكريبت قاعدة البيانات (`schema.sql`)

1. **الأنواع المخصصة (Enums):**
   - `product_gender`: (`men`, `women`, `unisex`)
   - `order_status`: (`pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`, `returned`)
   - `payment_method_enum`: (`cod` - الدفع عند الاستلام)
   - `shipping_provider_enum`: (`bosta`, `aramex`, `internal`)

2. **الجداول الأساسية (Tables):**
   - `categories`: الأقسام الرئيسية والفرعية (ساعات، حقائب، مجوهرات، نظارات، عطور...).
   - `products`: المنتجات مع الأسعار المصرية، الباركود، وحالة التوفر.
   - `product_variants`: المتغيرات (ألوان، مقاسات، خامات).
   - `product_images`: صور المنتجات بترتيب العرض.
   - `addresses`: عناوين العملاء في المحافظات المصرية.
   - `orders`: سجل الطلبات بنظام ترقيم فريد مثل `DRSH-10001` مع تتبع حالة الشحن.
   - `order_items`: تفاصيل المنتجات داخل كل طلب.
   - `shipping_shipments`: ربط الطلب مع شركة بوسطة (رقم البوليصة وتاريخ الاستلام).
   - `coupons`: كوبونات الخصم مع تواريخ الصلاحية ونسب الخصم.
   - `homepage_sections`: أقسام الصفحة الرئيسية وبانرات العرض.

3. **الحماية وسياسات الوصول (Row Level Security - RLS):**
   - القراءة العامة للمنتجات والأقسام والكوبونات السارية.
   - تمكين العملاء من إنشاء طلبات كزوار (Guest COD Checkout).
   - حماية تعديل الطلبات والإعدادات لمدراء المتجر فقط.

4. **بيانات تجريبية جاهزة (Seed Data):**
   - أقسام المتجر كاملة.
   - منتجات واقعية لكل قسم بأسعار الجنيه المصري والصور.
   - كوبون خصم ترحيبي فعال: `DRSH10` (خصم 10%).

---

## 🚀 طريقة التثبيت في Supabase (خلال دقيقة واحدة):

1. ادخل على حسابك في [Supabase](https://supabase.com) وأنشئ مشروع جديد باسم **drsh-store**.
2. من القائمة الجانبية اليسرى، اختر **SQL Editor**.
3. انسخ محتويات ملف `supabase/schema.sql` بالكامل والصقها في المحرر.
4. اضغط على زر **Run**.
5. سيتم إنشاء جميع الجداول، السياسات، والبيانات التجريبية فوراً وبنجاح.

---

## 🔗 ربط قاعدة البيانات مع Vercel / المشروع:

1. من لوحة تحكم Supabase، اذهب إلى:
   `Project Settings` ➔ `API`
2. انسخ:
   - `Project URL`
   - `Project API Keys` -> `anon / public`
3. في ملف `.env.local` على جهازك، أو في إعدادات **Vercel** (`Settings` ➔ `Environment Variables`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```
4. تم الربط بنجاح!
