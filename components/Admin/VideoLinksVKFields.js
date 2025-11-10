"use client";

import { useMemo } from "react";
import { Button, Input, Tooltip } from "antd";
import { PlusOutlined, DeleteOutlined, InfoCircleOutlined } from "@ant-design/icons";

/** value: [{id, url}], onChange(next) */
export default function VideoLinksVKFields({ value = [], onChange }) {
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
      <div className="flex items-center gap-2 text-white/80">
        <span>Ссылки VK видео</span>
        <Tooltip title="Поддерживаются публичные ссылки вида https://vk.com/video-12345_67890 или https://vkvideo.ru/video-12345_67890. Если встраивание запрещено, потребуется 'Код для вставки'.">
          <InfoCircleOutlined />
        </Tooltip>
      </div>

      {list.map((row, i) => (
        <div key={row.id} className="flex gap-2 items-center">
          <Input
            value={row.url}
            placeholder="https://vk.com/video-12345_67890"
            onChange={(e) => setAt(i, e.target.value)}
          />
          <Button danger icon={<DeleteOutlined />} onClick={() => del(i)} />
        </div>
      ))}
      <div>
        <Button type="dashed" icon={<PlusOutlined />} onClick={add}>
          Добавить VK-видео
        </Button>
      </div>
    </div>
  );
}
