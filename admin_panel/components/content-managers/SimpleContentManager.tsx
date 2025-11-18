"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/shared/ImageUploader";

interface SimpleContentData {
  id: number;
  heading?: string | null;
  content?: string | null;
  url?: string | null;
  photoUrls: string[];
  headingEn?: string | null;
  contentEn?: string | null;
  publicationDate: string;
  createdAt: string;
  updatedAt: string;
}

interface SimpleContentManagerProps {
  apiEndpoint: string;
  title: string;
}

export default function SimpleContentManager({ apiEndpoint, title }: SimpleContentManagerProps) {
  const [items, setItems] = useState<SimpleContentData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<SimpleContentData | null>(null);
  const [formData, setFormData] = useState({
    heading: "",
    content: "",
    url: "",
    photoUrls: [] as string[],
    headingEn: "",
    contentEn: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔄 SimpleContentManager: useEffect викликано, apiEndpoint:', apiEndpoint);
    
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
      
      // Завжди додаємо всі поля (це дозволяє зберігати всі дані)
      payload.heading = formData.heading || null;
      payload.content = formData.content || null;
      payload.url = formData.url || null;
      payload.photoUrls = formData.photoUrls;
      payload.headingEn = formData.headingEn || null;
      payload.contentEn = formData.contentEn || null;
      
      // Перевіряємо що принаймні одне поле заповнене
      if (!payload.heading && !payload.content && !payload.url && (!payload.photoUrls || payload.photoUrls.length === 0) && !payload.headingEn && !payload.contentEn) {
        setError('Потрібно заповнити принаймні одне поле: заголовок, текст, посилання, фотографії, заголовок англійською або текст англійською');
        return;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        fetchItems();
        resetForm();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Помилка збереження');
      }
    } catch (error) {
      console.error('Помилка збереження:', error);
      setError('Помилка збереження');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: SimpleContentData) => {
    setIsEditing(true);
    setEditingItem(item);
    setFormData({
      heading: item.heading || "",
      content: item.content || "",
      url: item.url || "",
      photoUrls: Array.isArray(item.photoUrls) ? item.photoUrls : [],
      headingEn: item.headingEn || "",
      contentEn: item.contentEn || ""
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

  const resetForm = () => {
    setIsEditing(false);
    setEditingItem(null);
    setFormData({
      heading: "",
      content: "",
      url: "",
      photoUrls: [],
      headingEn: "",
      contentEn: ""
    });
    setError(null);
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
              heading: "",
              content: "",
              url: "",
              photoUrls: [],
              headingEn: "",
              contentEn: ""
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
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="heading">Заголовок</Label>
                <Input
                  id="heading"
                  value={formData.heading}
                  onChange={(e) => setFormData(prev => ({ ...prev, heading: e.target.value }))}
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
                <Label htmlFor="headingEn">Заголовок англійською</Label>
                <Input
                  id="headingEn"
                  value={formData.headingEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, headingEn: e.target.value }))}
                  placeholder="Enter heading in English"
                />
              </div>

              <div>
                <Label htmlFor="contentEn">Текст англійською</Label>
                <Textarea
                  id="contentEn"
                  value={formData.contentEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, contentEn: e.target.value }))}
                  rows={4}
                  placeholder="Enter text in English"
                />
              </div>



              <div>
                <Label htmlFor="url">Посилання</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label>Фотографії</Label>
                <ImageUploader onUploadComplete={handleImageUpload} />
                
                {formData.photoUrls.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.photoUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Фото ${index + 1}`}
                          className="w-full h-32 object-cover rounded"
                        />
                        <Button
                          type="button"
                          onClick={() => removeImage(index)}
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1"
                          disabled={loading}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
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
                  <div className="space-y-3">
                    {/* Заголовок */}
                    {item.heading && (
                      <div>
                        <h3 className="text-lg font-semibold">{item.heading}</h3>
                      </div>
                    )}

                    {/* Заголовок англійською */}
                    {item.headingEn && (
                      <div>
                        <strong>Заголовок (англійська):</strong>
                        <p className="text-sm text-gray-600">{item.headingEn}</p>
                      </div>
                    )}
                    
                    {/* Текст */}
                    {item.content && (
                      <div>
                        <p className="text-sm text-gray-600 line-clamp-3">{item.content}</p>
                      </div>
                    )}

                    {/* Текст англійською */}
                    {item.contentEn && (
                      <div>
                        <strong>Текст (англійська):</strong>
                        <p className="text-sm text-gray-600 line-clamp-3">{item.contentEn}</p>
                      </div>
                    )}

                    
                    {/* Посилання */}
                    {item.url && (
                      <div>
                        <a 
                          href={item.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 break-all block"
                        >
                          {item.url}
                        </a>
                      </div>
                    )}
                    
                    {/* Фотографії */}
                    {Array.isArray(item.photoUrls) && item.photoUrls.length > 0 && (
                      <div>
                        <div className="grid grid-cols-2 gap-2">
                          {item.photoUrls.slice(0, 4).map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Фото ${index + 1}`}
                              className="w-full h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-4 space-y-1">
                    {item.publicationDate && (
                      <p>Опубліковано: {new Date(item.publicationDate).toLocaleDateString('uk-UA')}</p>
                    )}
                    <p>Оновлено: {new Date(item.updatedAt).toLocaleDateString('uk-UA')}</p>
                  </div>
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
