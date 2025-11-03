// /app/admin/girls/page.jsx — уведомления успеха (add/edit) + подсветка зоны редактирования, без изменения рабочей логики
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { Button, Form, Input, InputNumber, message, Collapse, Popconfirm, Tag } from "antd";
import SortableUpload from "@/components/Admin/SortableUpload";
import CKeditor from "@/components/Editor/CKeditor";
import { uploadGalleryIfNeeded } from "@/lib/uploadGallery";
import { slugify } from "@/lib/slugify";

/* ---------- Панель одной участницы (локальный useForm внутри компоненты) ---------- */
function GirlPanel({ g, gallery, onGalleryChange, onSave, onDelete }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      firstName: g.firstName,
      lastName: g.lastName,
      city: g.city,
      age: g.age,
      description: g.description,
      slug: g.slug,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g.id]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await onSave(values);
    } catch {
      /* antd покажет ошибки */
    }
  };

  // 🔹 ЗОНА РЕДАКТИРОВАНИЯ — мягкая фиолетовая подсветка
  return (
    <div className="rounded-2xl border border-violet-200 bg-violet-50/40 p-4">
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item name="firstName" label="Имя" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Фамилия" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label="Город" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Возраст"
            rules={[{ required: true, type: "number", min: 16, max: 60 }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>
          <Form.Item name="slug" label="Slug (если пусто — сгенерируется автоматически)">
            <Input placeholder="anna-ivanova-minsk" />
          </Form.Item>
          <Form.Item
            className="md:col-span-2"
            name="description"
            label="Описание"
            valuePropName="value"
            getValueFromEvent={(v) => v}
          >
            <CKeditor placeholder="Описание участницы…" />
          </Form.Item>
        </div>

        <div className="mt-2">
          <p className="mb-1 text-sm text-gray-600">
            Галерея (перетаскивание, первое — главное)
          </p>
          <SortableUpload
            value={gallery}
            onChange={onGalleryChange}
            label="Добавить изображения"
          />
        </div>

        <div className="pt-4 mt-7 flex items-center gap-3">
          <Button type="primary" onClick={handleSave}>
            Сохранить
          </Button>
          <Popconfirm
            title="Удалить участницу?"
            okText="Удалить"
            cancelText="Отмена"
            onConfirm={onDelete}
          >
            <Button danger>Удалить</Button>
          </Popconfirm>
          <a
            className="link ml-auto"
            href={`/girls/${g.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            Открыть страницу
          </a>
        </div>
      </Form>
    </div>
  );
}

/* ----------------------------------- Страница ----------------------------------- */
export default function AdminGirlsPage() {
  const router = useRouter();

  // ✅ локальный инстанс message, чтобы уведомления точно отображались
  const [msgApi, contextHolder] = message.useMessage();

  // Guard: только админ (без раннего return — порядок хуков стабилен)
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    try {
      const token = localStorage.getItem("token_miss");
      if (!token) return router.replace("/login?from=admin");
      const payload = jwtDecode(token);
      const notExpired =
        typeof payload?.exp !== "number" ? true : payload.exp * 1000 > Date.now();
      if (payload?.isAdmin && notExpired) setAllowed(true);
      else router.replace("/login?from=admin");
    } catch {
      router.replace("/login?from=admin");
    }
  }, [router]);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchList = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/girls", { cache: "no-store" })
      .then((r) => r.json().catch(() => ({})))
      .then((j) => setList(Array.isArray(j?.items) ? j.items : []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (allowed) fetchList();
  }, [allowed, fetchList]);

  /* ===== форма «Добавить» ===== */
  const [createForm] = Form.useForm();
  const [createGallery, setCreateGallery] = useState([]);

  const handleCreate = useCallback(async () => {
    try {
      const values = await createForm.validateFields();
      const urls = await uploadGalleryIfNeeded(createGallery, "girls");
      if (urls.length === 0) return msgApi.error("Загрузите хотя бы одно изображение");

      const fd = new FormData();
      fd.append("firstName", values.firstName);
      fd.append("lastName", values.lastName);
      fd.append("city", values.city);
      fd.append("age", String(values.age));
      fd.append("description", values.description || "");
      const autoSlug = slugify(`${values.firstName}-${values.lastName}-${values.city}`);
      fd.append("slug", autoSlug);
      fd.append("imagesJson", JSON.stringify(urls));

      const res = await fetch("/api/admin/girls", { method: "POST", body: fd });
      if (!res.ok) throw new Error();

      // 🔔 1) Успешное добавление
      msgApi.success({ content: "✅ Участница добавлена", duration: 2 });

      createForm.resetFields();
      setCreateGallery([]);
      fetchList();
    } catch {
      msgApi.error("Ошибка добавления");
    }
  }, [createForm, createGallery, fetchList, msgApi]);

  /* ===== Галереи по id — защита от лишних апдейтов ===== */
  const [galleries, setGalleries] = useState({});

  const shallowEqualGalleries = (a, b) => {
    const ka = Object.keys(a);
    const kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (const k of ka) {
      const av = a[k] || [];
      const bv = b[k] || [];
      if (av.length !== bv.length) return false;
      for (let i = 0; i < av.length; i++) {
        const avv = av[i]?.url || av[i]?.preview || av[i];
        const bvv = bv[i]?.url || bv[i]?.preview || bv[i];
        if (avv !== bvv) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const next = {};
    for (const g of list) {
      next[g.id] = (g.images || []).map((u, idx) => ({
        uid: `${g.id}-${idx}`,
        url: u,
      }));
    }
    setGalleries((prev) => (shallowEqualGalleries(prev, next) ? prev : next));
  }, [list]);

  const setGalleryFor = useCallback((id, val) => {
    setGalleries((p) => {
      const before = p[id] || [];
      const sameLen = before.length === val.length;
      const same =
        sameLen &&
        before.every(
          (x, i) => (x.url || x.preview) === (val[i]?.url || val[i]?.preview)
        );
      if (same) return p;
      return { ...p, [id]: val };
    });
  }, []);

  /* ===== Сохранение/удаление ===== */
  const saveGirl = useCallback(
    async (id, values) => {
      try {
        const gallery = galleries[id] || [];
        const urls = await uploadGalleryIfNeeded(gallery, "girls");
        if (urls.length === 0) return msgApi.error("Галерея не может быть пустой");

        const fd = new FormData();
        if (values.firstName) fd.append("firstName", values.firstName);
        if (values.lastName) fd.append("lastName", values.lastName);
        if (values.city) fd.append("city", values.city);
        if (typeof values.age === "number") fd.append("age", String(values.age));
        if (typeof values.description === "string") fd.append("description", values.description);
        const s = values.slug
          ? slugify(values.slug)
          : slugify(`${values.firstName}-${values.lastName}-${values.city}`);
        fd.append("slug", s);
        fd.append("imagesJson", JSON.stringify(urls));

        const res = await fetch(`/api/admin/girls/${id}`, {
          method: "PUT",
          body: fd,
        });
        if (!res.ok) throw new Error();

        // 🔔 2) Успешное редактирование
        msgApi.success({ content: "✅ Изменения сохранены", duration: 2 });

        fetchList();
      } catch {
        msgApi.error("Ошибка сохранения");
      }
    },
    [galleries, fetchList, msgApi]
  );

  const deleteGirl = useCallback(
    async (id) => {
      try {
        const res = await fetch(`/api/admin/girls/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error();
        msgApi.success({ content: "Удалено", duration: 2 });
        fetchList();
      } catch {
        msgApi.error("Ошибка удаления");
      }
    },
    [fetchList, msgApi]
  );

  /* ===== Аккордеон items ===== */
  const collapseItems = useMemo(
    () =>
      list.map((g) => {
        const header = (
          <div className="flex items-center gap-3">
            <img src={g.mainImage} alt="" className="w-12 h-12 object-cover rounded" />
            <div className="font-medium">
              {g.firstName} {g.lastName} — {g.city}
            </div>
            <span className="text-gray-500 text-sm">({g.age} лет)</span>
            <Tag className="ml-2">#{g.id}</Tag>
          </div>
        );
        return {
          key: String(g.id),
          label: header,
          children: (
            <GirlPanel
              g={g}
              gallery={galleries[g.id] || []}
              onGalleryChange={(arr) => setGalleryFor(g.id, arr)}
              onSave={(values) => saveGirl(g.id, values)}
              onDelete={() => deleteGirl(g.id)}
            />
          ),
        };
      }),
    [list, galleries, setGalleryFor, saveGirl, deleteGirl]
  );

  /* ===== Рендер ===== */
  return allowed ? (
    <div className="container mx-auto sd:py-10 xz:py-6 sd:px-0 xz:px-3">
      {/* message context */}
      {contextHolder}

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Админ — Участницы</h1>
        <Tag color="purple">Всего: {list.length}</Tag>
      </div>

      {/* === Создать === */}
      <div className="rounded-2xl border p-4 mb-8">
        <h2 className="font-semibold mb-3">Добавить участницу</h2>
        <Form form={createForm} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="firstName" label="Имя" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Фамилия" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="city" label="Город" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="age"
              label="Возраст"
              rules={[{ required: true, type: "number", min: 16, max: 60 }]}
            >
              <InputNumber className="w-full" />
            </Form.Item>
            <Form.Item
              className="md:col-span-2"
              label="Описание"
              name="description"
              valuePropName="value"
              getValueFromEvent={(v) => v}
            >
              <CKeditor placeholder="Опишите участницу…" />
            </Form.Item>
          </div>

          <div className="mt-2">
            <p className="mb-1 text-sm text-gray-600">
              Галерея (перетаскивание, первое — главное)
            </p>
            <SortableUpload
              value={createGallery}
              onChange={setCreateGallery}
              label="Загрузить изображения"
            />
          </div>

          <div className="pt-3">
            <Button type="primary" onClick={handleCreate}>
              Добавить
            </Button>
          </div>
        </Form>
      </div>

      {/* === Список/редактирование === */}
      <Collapse accordion ghost items={collapseItems} />

      {loading && <div className="mt-6 text-sm text-gray-500">Загрузка…</div>}
    </div>
  ) : (
    <div className="container mx-auto sd:py-10 xz:py-6 sd:px-0 xz:px-3">
      {contextHolder}
    </div>
  );
}
