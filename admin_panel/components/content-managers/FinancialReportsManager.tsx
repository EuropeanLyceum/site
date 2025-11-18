"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/shared/ImageUploader";

interface FinancialReport {
  id: number;
  title?: string;
  content?: string;
  titleEn?: string; // English title
  contentEn?: string; // English content
  url?: string;
  linkText?: string;
  linkTextEn?: string; // English link text
  photoUrls: string; // JSON string
  createdAt: string;
  updatedAt: string;
}

export default function FinancialReportsManager() {
  const apiEndpoint = "/api/financial-reports";

  const [items, setItems] = useState<FinancialReport[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<FinancialReport | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    titleEn: "",
    contentEn: "",
    linkText: "",
    linkTextEn: "",
    url: "",
    photoUrls: [] as string[],
  });

  const fetchItems = async () => {
    try {
      const res = await fetch(apiEndpoint);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Error fetching financial reports:", e);
      setItems([]);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isCreating = !editingItem?.id;
      const urlEndpoint = isCreating ? apiEndpoint : `${apiEndpoint}/${editingItem?.id}`;
      const method = isCreating ? "POST" : "PUT";

      const payload = {
        title: formData.title || null,
        content: formData.content || null,
        titleEn: formData.titleEn || null,
        contentEn: formData.contentEn || null,
        linkText: formData.linkText || null,
        linkTextEn: formData.linkTextEn || null,
        url: formData.url || null,
        photoUrls: formData.photoUrls,
      };

      if (!payload.title && !payload.content && !payload.titleEn && !payload.contentEn && !payload.url && !payload.linkText && !payload.linkTextEn && (!payload.photoUrls || payload.photoUrls.length === 0)) {
        alert("Потрібно заповнити принаймні одне поле");
        return;
      }

      const resp = await fetch(urlEndpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (resp.ok) {
        await fetchItems();
        resetForm();
      } else {
        const err = await resp.json().catch(() => ({}));
        alert(`Помилка збереження: ${err.error || "Невідома помилка"}`);
      }
    } catch (e) {
      console.error("Save error:", e);
      alert("Помилка збереження запису");
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingItem(null);
    setFormData({ title: "", content: "", titleEn: "", contentEn: "", linkText: "", linkTextEn: "", url: "", photoUrls: [] });
  };

  const handleEdit = (item: FinancialReport) => {
    setIsEditing(true);
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      content: item.content || "",
      titleEn: item.titleEn || "",
      contentEn: item.contentEn || "",
      linkText: item.linkText || "",
      linkTextEn: item.linkTextEn || "",
      url: item.url || "",
      photoUrls: item.photoUrls ? JSON.parse(item.photoUrls) : [],
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити запис?")) return;
    const resp = await fetch(`${apiEndpoint}/${id}`, { method: "DELETE" });
    if (resp.ok) fetchItems();
  };

  const onUploadComplete = (url: string) => {
    if (!url) return;
    setFormData((prev) => ({ ...prev, photoUrls: [...prev.photoUrls, url] }));
  };

  const removeImage = (i: number) => {
    setFormData((prev) => ({ ...prev, photoUrls: prev.photoUrls.filter((_, idx) => idx !== i) }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Фінансова звітність</h1>
          <p className="text-sm text-gray-600 mt-1">Всього записів: {items.length}</p>
        </div>
        <Button
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => {
            setIsEditing(true);
            setEditingItem(null);
            setFormData({ title: "", content: "", titleEn: "", contentEn: "", linkText: "", linkTextEn: "", url: "", photoUrls: [] });
          }}
        >
          Додати новий запис
        </Button>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>{editingItem ? "Редагувати" : "Додати новий"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Введіть заголовок"
                />
              </div>

              <div>
                <Label htmlFor="titleEn">Заголовок англійською</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData((p) => ({ ...p, titleEn: e.target.value }))}
                  placeholder="Введіть заголовок англійською"
                />
              </div>

              <div>
                <Label htmlFor="content">Текст</Label>
                <Textarea
                  id="content"
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Введіть текст"
                />
                <p className="text-xs text-gray-500 mt-1">Використовуйте Enter для нових рядків</p>
              </div>

              <div>
                <Label htmlFor="contentEn">Текст англійською</Label>
                <Textarea
                  id="contentEn"
                  rows={4}
                  value={formData.contentEn}
                  onChange={(e) => setFormData((p) => ({ ...p, contentEn: e.target.value }))}
                  placeholder="Введіть текст англійською"
                />
                <p className="text-xs text-gray-500 mt-1">Використовуйте Enter для нових рядків</p>
              </div>

              <div>
                <Label htmlFor="linkText">Текст посилання</Label>
                <Input
                  id="linkText"
                  value={formData.linkText}
                  onChange={(e) => setFormData((p) => ({ ...p, linkText: e.target.value }))}
                  placeholder="Напр.: Річний звіт (клікабельний текст)"
                />
                <p className="text-xs text-gray-500 mt-1">Цей текст відображається на сайті і відкриває URL нижче.</p>
              </div>

              <div>
                <Label htmlFor="linkTextEn">Текст посилання англійською</Label>
                <Input
                  id="linkTextEn"
                  value={formData.linkTextEn}
                  onChange={(e) => setFormData((p) => ({ ...p, linkTextEn: e.target.value }))}
                  placeholder="Наприклад: Annual Report (clickable text)"
                />
                <p className="text-xs text-gray-500 mt-1">Англійський варіант тексту посилання.</p>
              </div>

              <div>
                <Label htmlFor="url">Посилання (URL)</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData((p) => ({ ...p, url: e.target.value }))}
                  placeholder="https://example.com/звіт"
                />
                <p className="text-xs text-gray-500 mt-1">Повний URL. Натиснувши на текст вище, відкриється це посилання у новій вкладці.</p>
              </div>

              <div>
                <Label>Фото (опціонально)</Label>
                <ImageUploader onUploadComplete={onUploadComplete} />
                {formData.photoUrls.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Завантажені фото:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.photoUrls.map((u, i) => (
                        <div key={i} className="relative">
                          <img src={u} alt={`Photo ${i + 1}`} className="w-20 h-20 object-cover rounded border" />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => removeImage(i)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-green-500 hover:bg-green-600">{editingItem ? "Оновити" : "Додати"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Скасувати</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  {item.photoUrls && JSON.parse(item.photoUrls).length > 0 && (
                    <img src={JSON.parse(item.photoUrls)[0]} alt="Report" className="w-full h-32 object-cover rounded mb-4" />
                  )}
                  <h3 className="text-lg font-semibold mb-2">{item.title || "Без заголовка"}</h3>
                  {item.titleEn && (
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">{item.titleEn}</h3>
                  )}
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">{item.content || "Без тексту"}</p>
                  {item.contentEn && (
                    <p className="text-sm text-blue-600 mb-2 line-clamp-3">
                      {item.contentEn}
                    </p>
                  )}
                  {item.url && (
                    <div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm break-all">
                        {item.linkText || item.url}
                      </a>
                      {item.linkTextEn && (
                        <div className="text-blue-400 hover:text-blue-600 text-sm break-all mt-1">
                          {item.linkTextEn}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-auto pt-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>Редагувати</Button>
                  <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item.id)}>Видалити</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


