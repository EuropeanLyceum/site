"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/shared/ImageUploader";

interface ContentWithPhotosData {
  id: number;
  title?: string | null;
  content?: string | null;
  titleEn?: string | null;
  contentEn?: string | null;
  photoUrls: string[];
  createdAt: string;
  updatedAt: string;
}

interface ContentWithPhotosManagerProps {
  apiEndpoint: string;
  title: string;
}

export default function ContentWithPhotosManager({ apiEndpoint, title }: ContentWithPhotosManagerProps) {
  const [items, setItems] = useState<ContentWithPhotosData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentWithPhotosData | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    titleEn: "",
    contentEn: "",
    photoUrls: [] as string[]
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔄 ContentWithPhotosManager: useEffect викликано, apiEndpoint:', apiEndpoint);
    
    // Додаємо перевірку, що apiEndpoint не пустий
    if (apiEndpoint) {
      fetchItems();
    } else {
      console.warn('⚠️ apiEndpoint is empty, skipping fetch');
    }
  }, [apiEndpoint]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Завантаження даних з:', apiEndpoint);
      
      // Додаємо перевірку URL
      if (!apiEndpoint || apiEndpoint.trim() === '') {
        throw new Error('API endpoint is empty or invalid');
      }
      
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Додаємо credentials для CORS
        credentials: 'same-origin'
      });
      
      console.log('📥 Статус відповіді:', response.status);
      console.log('📥 Response URL:', response.url);
      console.log('📥 Response type:', response.type);
      
      const responseText = await response.text();
      console.log('📥 Текст відповіді:', responseText);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Помилка парсингу JSON:', parseError);
        setError(`Помилка парсингу відповіді: ${responseText}`);
        setItems([]);
        return;
      }
      
      console.log('📋 Отримані дані:', data);
      
      if (Array.isArray(data)) {
        setItems(data);
      } else {
        console.error('❌ API повернув не масив:', data);
        setError('API повернув некоректні дані');
        setItems([]);
      }
    } catch (error) {
      console.error('❌ Помилка завантаження даних:', error);
      console.error('❌ Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      // Більш детальна обробка помилок
      let errorMessage = 'Невідома помилка';
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Не вдалося підключитися до сервера. Перевірте підключення до інтернету або спробуйте пізніше.';
        } else if (error.message.includes('NetworkError')) {
          errorMessage = 'Помилка мережі. Перевірте підключення до інтернету.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setError(errorMessage);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const isCreatingNew = !editingItem || !editingItem.id;
      const url = isCreatingNew ? apiEndpoint : `${apiEndpoint}/${editingItem.id}`;
      const method = isCreatingNew ? 'POST' : 'PUT';
      
      // Підготовка даних для відправки
      const payload: any = {};
      
      // Завжди відправляємо всі поля
      payload.title = formData.title || null;
      payload.content = formData.content || null;
      payload.titleEn = formData.titleEn || null;
      payload.contentEn = formData.contentEn || null;
      payload.photoUrls = formData.photoUrls;
      
      // Перевіряємо що принаймні одне поле заповнене
      const hasTitle = payload.title && payload.title.trim() !== '';
      const hasContent = payload.content && payload.content.trim() !== '';
      const hasTitleEn = payload.titleEn && payload.titleEn.trim() !== '';
      const hasContentEn = payload.contentEn && payload.contentEn.trim() !== '';
      const hasPhotos = payload.photoUrls && payload.photoUrls.length > 0;
      
      if (!hasTitle && !hasContent && !hasTitleEn && !hasContentEn && !hasPhotos) {
        setError('Потрібно заповнити принаймні одне поле: заголовок, текст, заголовок англійською, текст англійською або фото');
        return;
      }
      
      console.log('📤 Відправляємо дані:', { url, method, payload });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📥 Отримали відповідь:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        contentType: response.headers.get('content-type')
      });

      if (response.ok) {
        fetchItems();
        resetForm();
      } else {
        // Перевіряємо, чи це JSON відповідь
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          setError(errorData.error || 'Помилка збереження');
        } else {
          // Якщо не JSON, показуємо HTTP статус помилки
          const responseText = await response.text();
          console.error('❌ Не JSON відповідь:', responseText);
          setError(`Помилка збереження: HTTP ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Помилка збереження:', error);
      setError('Помилка збереження');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: ContentWithPhotosData) => {
    setIsEditing(true);
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      content: item.content || "",
      titleEn: item.titleEn || "",
      contentEn: item.contentEn || "",
      photoUrls: item.photoUrls || []
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цей запис?')) {
      try {
        const response = await fetch(`${apiEndpoint}/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchItems();
        }
      } catch (error) {
        console.error('Помилка видалення:', error);
        setError('Помилка видалення');
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingItem(null);
    setFormData({
      title: "",
      content: "",
      titleEn: "",
      contentEn: "",
      photoUrls: []
    });
    setError(null);
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      photoUrls: [...prev.photoUrls, url]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photoUrls: prev.photoUrls.filter((_, i) => i !== index)
    }));
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Завантаження...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Button 
          onClick={() => {
            setIsEditing(true);
            setEditingItem(null);
            setFormData({
              title: "",
              content: "",
              titleEn: "",
              contentEn: "",
              photoUrls: []
            });
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Додати новий запис
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Редагувати запис' : 'Додати новий запис'}
            </CardTitle>
            <p className="text-sm text-gray-600">
              Заповніть принаймні одне поле. Всі поля необов'язкові.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Введіть заголовок"
                />
              </div>
              
              <div>
                <Label htmlFor="content">Текст</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  placeholder="Введіть текст"
                />
              </div>

              <div>
                <Label htmlFor="titleEn">Заголовок англійською</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                  placeholder="Введіть заголовок англійською"
                />
              </div>
              
              <div>
                <Label htmlFor="contentEn">Текст англійською</Label>
                <Textarea
                  id="contentEn"
                  value={formData.contentEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, contentEn: e.target.value }))}
                  rows={4}
                  placeholder="Введіть текст англійською"
                />
              </div>

              <div>
                <Label>Фото</Label>
                <ImageUploader 
                  onUploadComplete={handleImageUpload} 
                  multiple={true}
                />
                {formData.photoUrls.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Завантажені фото:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.photoUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={url} 
                            alt={`Photo ${index + 1}`} 
                            className="w-20 h-20 object-cover rounded"
                          />
                          <Button
                            type="button"
                            onClick={() => removeImage(index)}
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 text-xs"
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
                <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled={loading}>
                  {loading ? 'Збереження...' : (editingItem ? 'Оновити' : 'Додати')}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Скасувати
                </Button>
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
                  {item.title && (
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  )}
                  {item.titleEn && (
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">{item.titleEn}</h3>
                  )}
                  {item.content && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-3">{item.content}</p>
                  )}
                  {item.contentEn && (
                    <p className="text-sm text-blue-600 mb-4 line-clamp-3">{item.contentEn}</p>
                  )}
                  {item.photoUrls && item.photoUrls.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-2">
                        {item.photoUrls.map((url, index) => (
                          <img 
                            key={index}
                            src={url} 
                            alt={`Photo ${index + 1}`} 
                            className="w-full h-24 object-cover rounded"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {!item.title && !item.content && !item.titleEn && !item.contentEn && (!item.photoUrls || item.photoUrls.length === 0) && (
                    <p className="text-sm text-gray-400 italic">Порожній запис</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Оновлено: {new Date(item.updatedAt).toLocaleDateString('uk-UA')}
                  </p>
                </div>
                
                <div className="flex gap-2 mt-auto pt-4">
                  <Button
                    onClick={() => handleEdit(item)}
                    size="sm"
                    variant="outline"
                  >
                    Редагувати
                  </Button>
                  <Button
                    onClick={() => handleDelete(item.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-700"
                  >
                    Видалити
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && !isEditing && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Поки що немає доданих записів</p>
            <p className="text-sm text-gray-400 mt-2">
              Натисніть "Додати новий запис" щоб почати
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
