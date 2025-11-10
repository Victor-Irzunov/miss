// /components/Admin/SortableUpload.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Resizer from "react-image-file-resizer";

/* ================= helpers ================= */

const shallowEqualImages = (a = [], b = []) => {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const A = a[i] || {};
    const B = b[i] || {};
    // сравниваем стабильные признаки
    const aKey = `${A.uid ?? ""}|${A.url ?? ""}|${A.preview ?? ""}`;
    const bKey = `${B.uid ?? ""}|${B.url ?? ""}|${B.preview ?? ""}`;
    if (aKey !== bKey) return false;
  }
  return true;
};

/**
 * Сжать изображение в WEBP, стараясь уложиться в maxKB (по умолчанию 50 КБ).
 * Возвращает File с новым именем *.webp
 */
const createWebpUnderKB = (file, maxKB = 50, startQ = 80) =>
  new Promise(async (resolve, reject) => {
    try {
      let q = startQ;
      let lastBlob = null;

      while (q >= 40) {
        // eslint-disable-next-line no-await-in-loop
        const blob = await new Promise((res) => {
          Resizer.imageFileResizer(
            file,
            1600,
            1200,
            "WEBP",
            q,
            0,
            async (uri) => {
              const r = await fetch(uri);
              const b = await r.blob();
              res(b);
            },
            "base64"
          );
        });

        lastBlob = blob;
        if (Math.ceil(blob.size / 1024) <= maxKB) break;
        q -= 10;
      }

      const base = (file?.name || `img_${Date.now()}`).replace(/\.\w+$/, "");
      resolve(new File([lastBlob], `${base}.webp`, { type: "image/webp" }));
    } catch (e) {
      reject(e);
    }
  });

/* ================ one sortable item ================ */

function SortableImage({ id, image, index, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const url = useMemo(() => {
    if (image.preview) return image.preview;
    if (image.file instanceof File) return URL.createObjectURL(image.file);
    return image.url || "";
  }, [image]);

  const onPointerDownCapture = (e) => {
    if (e.target.closest("[data-no-drag]")) e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative mt-4 mr-3 cursor-grab active:cursor-grabbing select-none"
      onPointerDownCapture={onPointerDownCapture}
    >
      {index === 0 && (
        <div className="absolute left-1 top-1 z-10 rounded bg-green-600/85 px-1 py-0.5 text-[10px] text-white">
          Главное
        </div>
      )}

      {url ? (
        <img
          src={url}
          alt=""
          className="h-28 w-36 rounded border object-cover pointer-events-none"
          draggable={false}
        />
      ) : (
        <span className="text-xs text-gray-400">Нет превью</span>
      )}

      <button
        type="button"
        data-no-drag
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(id);
        }}
        className="absolute -bottom-2 left-0 rounded border bg-white/90 px-2 py-0.5 text-xs text-red-600"
        title="Удалить"
      >
        Удалить
      </button>
    </div>
  );
}

/* ================ SortableUpload ================ */
/**
 * value: [{ uid, file?: File, preview?: string } | { uid, url: string }]
 * onChange(nextArray)
 */
export default function SortableUpload({ value = [], onChange, label = "Загрузить изображения" }) {
  const [imageList, setImageList] = useState(Array.isArray(value) ? value : []);
  const inputRef = useRef(null);
  const objectUrls = useRef(new Set());
  const skipEmitRef = useRef(false); // ← подавляем onChange, когда синхронизируемся с пропсами

  // Синхронизация из пропов → state (только если реально изменилось)
  useEffect(() => {
    const next = Array.isArray(value) ? value : [];
    setImageList((prev) => {
      if (shallowEqualImages(prev, next)) return prev;
      // это внешнее обновление — не эмитим onChange в ответ
      skipEmitRef.current = true;
      return next;
    });
  }, [value]);

  // Эмитим onChange только для внутренних изменений (перетаскивание/удаление/добавление)
  useEffect(() => {
    if (skipEmitRef.current) {
      skipEmitRef.current = false;
      return;
    }
    onChange?.(imageList);
  }, [imageList, onChange]);

  // очистка ObjectURL при размонтировании
  useEffect(() => {
    return () => {
      objectUrls.current.forEach((u) => URL.revokeObjectURL(u));
      objectUrls.current.clear();
    };
  }, []);

  const handleRemove = (uid) => {
    setImageList((prev) => {
      const it = prev.find((x) => x.uid === uid);
      if (it?.preview) {
        try {
          URL.revokeObjectURL(it.preview);
          objectUrls.current.delete(it.preview);
        } catch {}
      }
      return prev.filter((f) => f.uid !== uid);
    });
  };

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setImageList((prev) =>
      arrayMove(
        prev,
        prev.findIndex((f) => f.uid === active.id),
        prev.findIndex((f) => f.uid === over.id)
      )
    );
  };

  const handleFilesChosen = async (files) => {
    if (!files || files.length === 0) return;

    const arr = Array.from(files);
    const processed = await Promise.all(
      arr.map(async (file) => {
        const webp = await createWebpUnderKB(file, 50, 80);
        const preview = URL.createObjectURL(webp);
        objectUrls.current.add(preview);
        return {
          uid: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
          file: webp,
          preview,
        };
      })
    );

    setImageList((prev) => [...prev, ...processed]);
  };

  return (
    <div>
      <div className="mb-2 flex sd:flex-row xz:flex-col items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFilesChosen(e.target.files);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
        <button type="button" className="btn" onClick={() => inputRef.current?.click()}>
          {label}
        </button>
        <span className="text-xs text-gray-500">Перетащите, чтобы изменить порядок (первое — главное)</span>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={imageList.map((f) => f.uid)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-wrap">
            {imageList.map((img, idx) => (
              <SortableImage key={img.uid} id={img.uid} image={img} index={idx} onRemove={handleRemove} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
