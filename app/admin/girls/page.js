"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import {
  Button, Form, Input, InputNumber, message, Collapse,
  Popconfirm, Tag, Radio, Segmented
} from "antd";
import SortableUpload from "@/components/Admin/SortableUpload";
import CKeditor from "@/components/Editor/CKeditor";
import { uploadGalleryIfNeeded } from "@/lib/uploadGallery";
import { slugify } from "@/lib/slugify";
import VideoLinksFields from "@/components/Admin/VideoLinksFields";
import { sanitizeVideoInputs } from "@/lib/youtube";

const CATS = [
  { label: "35+", value: "PLUS35" },
  { label: "50+", value: "PLUS50" },
  { label: "60+", value: "PLUS60" },
  { label: "Онлайн", value: "ONLINE" },
];

/* ---------- Панель одной участницы ---------- */
function GirlPanel({ g, gallery, onGalleryChange, videos, onVideosChange, onSave, onDelete, onSetWinner }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      firstName: g.firstName,
      lastName: g.lastName,
      city: g.city,
      age: g.age,
      description: g.description,
      slug: g.slug,
      category: g.category || "PLUS35",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g.id]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await onSave(values);
    } catch {}
  };

  const isWinner = Boolean(g?.categoryWinner);

  return (
    <div className="rounded-2xl border border-violet-200 bg-transparent p-4">
      <Form form={form} layout="vertical" className="dark-antd-form">
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
            rules={[{ required: true, type: "number", min: 16, max: 100 }]}
          >
            <InputNumber className="w-full" />
          </Form.Item>

          <Form.Item name="slug" label="Slug (если пусто — сгенерируется автоматически)">
            <Input placeholder="anna-ivanova-minsk" />
          </Form.Item>

          <Form.Item name="category" label="Категория" rules={[{ required: true }]}>
            <Radio.Group options={CATS} optionType="button" buttonStyle="solid" />
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
          <p className="mb-1 text-sm text-white">Галерея (перетаскивание, первое — главное)</p>
          <SortableUpload value={gallery} onChange={onGalleryChange} label="Добавить изображения" />
        </div>

        {/* Видео — не обязательные, динамические поля */}
        <div className="mt-4">
          <p className="mb-1 text-sm text-gray-600">Видео YouTube (необязательно)</p>
          <VideoLinksFields value={videos} onChange={onVideosChange} />
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

          <div className="ml-auto flex items-center gap-2">
            {isWinner && <Tag color="gold">Победитель</Tag>}
            <Button onClick={onSetWinner} type="dashed">
              Сделать победителем категории
            </Button>
            <a className="link" href={`/girls/${g.slug}`} target="_blank" rel="noreferrer">
              Открыть страницу
            </a>
          </div>
        </div>
      </Form>
    </div>
  );
}

/* ----------------------------------- Страница ----------------------------------- */
export default function AdminGirlsPage() {
  const router = useRouter();
  const [msgApi, contextHolder] = message.useMessage();

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

  /* ===== Создать ===== */
  const [createForm] = Form.useForm();
  const [createGallery, setCreateGallery] = useState([]);
  const [createVideos, setCreateVideos] = useState([]); // [{id,url}]

  const handleCreate = useCallback(async () => {
    try {
      const values = await createForm.validateFields();
      const urls = await uploadGalleryIfNeeded(createGallery, "girls");
      if (urls.length === 0) return msgApi.error("Загрузите хотя бы одно изображение");

      // нормализуем видео
      const rawVideos = (createVideos || [])
        .map((v) => (typeof v === "string" ? v : v?.url))
        .map((s) => String(s || "").trim());
      const videosClean = sanitizeVideoInputs(rawVideos);

      const fd = new FormData();
      fd.append("firstName", values.firstName);
      fd.append("lastName", values.lastName);
      fd.append("city", values.city);
      fd.append("age", String(values.age));
      fd.append("description", values.description || "");
      fd.append("category", values.category || "PLUS35");
      const autoSlug = slugify(`${values.firstName}-${values.lastName}-${values.city}`);
      fd.append("slug", autoSlug);
      fd.append("imagesJson", JSON.stringify(urls));

      // отправляем и JSON, и повторяющиеся поля videos[]=...
      fd.append("videosJson", JSON.stringify(videosClean));
      videosClean.forEach((u) => fd.append("videos", u));

      const res = await fetch("/api/admin/girls", { method: "POST", body: fd });
      if (!res.ok) throw new Error();

      msgApi.success({ content: "✅ Участница добавлена", duration: 2 });
      createForm.resetFields();
      setCreateGallery([]);
      setCreateVideos([]);
      fetchList();
    } catch {
      msgApi.error("Ошибка добавления");
    }
  }, [createForm, createGallery, createVideos, fetchList, msgApi]);

  /* ===== Галереи/Видео по id ===== */
  const [galleries, setGalleries] = useState({});
  const [videosById, setVideosById] = useState({}); // { [id]: [{id,url}] }

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

  const shallowEqualVideos = (a, b) => {
    const ka = Object.keys(a || {});
    const kb = Object.keys(b || {});
    if (ka.length !== kb.length) return false;
    for (const k of ka) {
      const av = a[k] || [];
      const bv = b[k] || [];
      if (av.length !== bv.length) return false;
      for (let i = 0; i < av.length; i++) {
        const avu = typeof av[i] === "string" ? av[i] : av[i]?.url;
        const bvu = typeof bv[i] === "string" ? bv[i] : bv[i]?.url;
        if ((avu || "") !== (bvu || "")) return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const nextG = {};
    const nextV = {};
    for (const g of list) {
      nextG[g.id] = (g.images || []).map((u, idx) => ({
        uid: `${g.id}-${idx}`,
        url: u,
      }));
      const vids = Array.isArray(g.videos) ? g.videos : [];
      nextV[g.id] = vids.map((u, i) => ({ id: `${g.id}-v${i}`, url: String(u) }));
    }

    setGalleries((prev) => (shallowEqualGalleries(prev, nextG) ? prev : nextG));
    setVideosById((prev) => (shallowEqualVideos(prev, nextV) ? prev : nextV));
  }, [list]);

  const setGalleryFor = useCallback((id, val) => {
    setGalleries((p) => {
      const next = { ...p, [id]: val };
      return shallowEqualGalleries(p, next) ? p : next;
    });
  }, []);

  const setVideosFor = useCallback((id, val) => {
    setVideosById((p) => {
      const next = { ...p, [id]: val };
      return shallowEqualVideos(p, next) ? p : next;
    });
  }, []);

  /* ===== Сохранение/удаление ===== */
  const saveGirl = useCallback(
    async (id, values) => {
      try {
        const gallery = galleries[id] || [];
        const urls = await uploadGalleryIfNeeded(gallery, "girls");
        if (urls.length === 0) return msgApi.error("Галерея не может быть пустой");

        const rawVideos = (videosById[id] || [])
          .map((v) => (typeof v === "string" ? v : v?.url))
          .map((s) => String(s || "").trim());
        const videosClean = sanitizeVideoInputs(rawVideos);

        const fd = new FormData();
        if (values.firstName) fd.append("firstName", values.firstName);
        if (values.lastName) fd.append("lastName", values.lastName);
        if (values.city) fd.append("city", values.city);
        if (typeof values.age === "number") fd.append("age", String(values.age));
        if (typeof values.description === "string") fd.append("description", values.description);
        if (values.category) fd.append("category", values.category);
        const s = values.slug
          ? slugify(values.slug)
          : slugify(`${values.firstName}-${values.lastName}-${values.city}`);
        fd.append("slug", s);
        fd.append("imagesJson", JSON.stringify(urls));

        // и JSON, и повторяющиеся поля
        fd.append("videosJson", JSON.stringify(videosClean));
        videosClean.forEach((u) => fd.append("videos", u));

        const res = await fetch(`/api/admin/girls/${id}`, {
          method: "PUT",
          body: fd,
        });
        if (!res.ok) throw new Error();

        msgApi.success({ content: "✅ Изменения сохранены", duration: 2 });
        fetchList();
      } catch {
        msgApi.error("Ошибка сохранения");
      }
    },
    [galleries, videosById, fetchList, msgApi]
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

  const setWinner = useCallback(
    async (id) => {
      try {
        const token = localStorage.getItem("token_miss") || "";
        const res = await fetch("/api/admin/winner", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ girlId: id }),
        });
        if (!res.ok) throw new Error();
        msgApi.success("🏆 Победитель сохранён");
        fetchList();
      } catch {
        msgApi.error("Не удалось установить победителя");
      }
    },
    [fetchList, msgApi]
  );

  /* ===== Группировка по категориям ===== */
  const grouped = useMemo(() => {
    const map = { PLUS35: [], PLUS50: [], PLUS60: [], ONLINE: [] };
    for (const g of list) {
      (map[g.category || "PLUS35"] || map.PLUS35).push(g);
    }
    return map;
  }, [list]);

  const [activeCat, setActiveCat] = useState("PLUS35");

  const collapseItemsBy = useCallback(
    (arr) =>
      arr.map((g) => {
        const header = (
          <div className="flex items-center gap-3">
            <img src={g.mainImage} alt="" className="w-12 h-12 object-cover rounded" />
            <div className="font-medium">
              {g.firstName} {g.lastName} — {g.city}
            </div>
            <span className="text-gray-400 text-sm">({g.age} лет)</span>
            <Tag className="ml-2">#{g.id}</Tag>
            {g.categoryWinner && <Tag color="gold" className="ml-1">Победитель</Tag>}
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
              videos={videosById[g.id] || []}
              onVideosChange={(arr) => setVideosFor(g.id, arr)}
              onSave={(values) => saveGirl(g.id, values)}
              onDelete={() => deleteGirl(g.id)}
              onSetWinner={() => setWinner(g.id)}
            />
          ),
        };
      }),
    [galleries, videosById, saveGirl, deleteGirl, setGalleryFor, setVideosFor, setWinner]
  );

  return allowed ? (
    <main
      className="sd:py-40 xz:py-6"
      style={{
        background:
          "radial-gradient(1200px 600px at 0% 0%, rgba(139,92,246,0.18), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(59,130,246,0.15), transparent 55%), linear-gradient(180deg, rgba(18,22,34,1) 0%, rgba(20,24,38,1) 100%)",
      }}
    >
      <div className="container mx-auto sd:px-0 xz:px-3 text-white">
        {contextHolder}

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Админ — Участницы</h1>
          <Tag color="purple">Всего: {list.length}</Tag>
        </div>

        {/* === Создать === */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-8">
          <h2 className="font-semibold mb-3">Добавить участницу</h2>

          <Form form={createForm} layout="vertical" className="dark-antd-form">
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
                rules={[{ required: true, type: "number", min: 16, max: 100 }]}
              >
                <InputNumber className="w-full" />
              </Form.Item>

              <Form.Item name="category" label="Категория" rules={[{ required: true }]} initialValue="PLUS35">
                <Radio.Group options={CATS} optionType="button" buttonStyle="solid" />
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
              <p className="mb-1 text-sm text-white/70">Галерея (перетаскивание, первое — главное)</p>
              <SortableUpload value={createGallery} onChange={setCreateGallery} label="Загрузить изображения" />
            </div>

            <div className="mt-4">
              <p className="mb-1 text-sm text-white/70">Видео YouTube (необязательно)</p>
              <VideoLinksFields value={createVideos} onChange={setCreateVideos} />
            </div>

            <div className="pt-3">
              <Button type="primary" onClick={handleCreate}>Добавить</Button>
            </div>
          </Form>
        </div>

        {/* === Переключатель категорий === */}
        <div className="mb-4">
          <Segmented
            options={CATS.map(c => ({ label: c.label, value: c.value }))}
            value={activeCat}
            onChange={setActiveCat}
          />
        </div>

        {/* === Списки по категориям === */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-2 dark-antd-collapse">
          <Collapse accordion ghost items={collapseItemsBy(grouped[activeCat] || [])} />
          {loading && <div className="mt-6 text-sm text-white/70">Загрузка…</div>}
          {!loading && (grouped[activeCat] || []).length === 0 && (
            <div className="mt-6 text-sm text-white/70">Нет участниц в выбранной категории</div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <Link href="/admin" className="btn btn-outline border-white/40 text-white hover:bg-white/10">
            Главная страница администратора
          </Link>
          <Link href="/admin/votes" className="btn btn-outline border-white/40 text-white hover:bg-white/10">
            Голосование
          </Link>
        </div>
      </div>

      <style jsx global>{`
        .dark-antd-form .ant-form-item-label > label { color: #ffffff !important; }
        .dark-antd-form .ant-form-item-required::before { color: #ffffff !important; opacity: 0.9; }

        .dark-antd-collapse .ant-collapse,
        .dark-antd-collapse .ant-collapse-item,
        .dark-antd-collapse .ant-collapse-header,
        .dark-antd-collapse .ant-collapse-content,
        .dark-antd-collapse .ant-collapse-content-box { color: #ffffff !important; }
        .dark-antd-collapse .ant-collapse > .ant-collapse-item > .ant-collapse-header { color: #ffffff !important; }
        .dark-antd-collapse .ant-collapse-content { background: transparent !important; border-top-color: rgba(255,255,255,0.12) !important; }
        .dark-antd-collapse .ant-collapse-item { border-bottom-color: rgba(255,255,255,0.12) !important; }
      `}</style>
    </main>
  ) : (
    <div className="container mx-auto sd:py-10 xz:py-6 sd:px-0 xz:px-3">{contextHolder}</div>
  );
}
