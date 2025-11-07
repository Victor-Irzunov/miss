// /components/Admin/VideoLinksFields.jsx
"use client";

import { useMemo } from "react";
import { Button, Input } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

/** value: [{id, url}], onChange(next) */
export default function VideoLinksFields({ value = [], onChange }) {
  const list = useMemo(
    () =>
      (Array.isArray(value) ? value : []).map((it, i) => ({
        id: it?.id ?? String(i + 1),
        url: it?.url ?? String(it ?? ""),
      })),
    [value]
  );

  const setAt = (idx, url) => {
    const next = list.slice();
    next[idx] = { ...next[idx], url };
    onChange?.(next);
  };

  const add = () => onChange?.([...list, { id: crypto.randomUUID(), url: "" }]);
  const del = (idx) => onChange?.(list.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-col gap-2">
      {list.map((row, i) => (
        <div key={row.id} className="flex gap-2 items-center">
          <Input
            value={row.url}
            placeholder="https://www.youtube.com/watch?v=XXXX  или  https://youtu.be/XXXX"
            onChange={(e) => setAt(i, e.target.value)}
          />
          <Button danger icon={<DeleteOutlined />} onClick={() => del(i)} />
        </div>
      ))}
      <div>
        <Button type="dashed" icon={<PlusOutlined />} onClick={add}>
          Добавить видео
        </Button>
      </div>
    </div>
  );
}
