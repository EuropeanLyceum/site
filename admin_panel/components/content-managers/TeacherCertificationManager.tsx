'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import ImageUploader from '@/components/shared/ImageUploader';

interface TeacherCertificationItem {
  id: number;
  heading: string;
  description: string;
  text?: string;
  url?: string;
  linkText?: string;
  photoUrls: string[]; // Змінюємо на масив
  imagePosition?: string; // Додаємо поле позиціонування
  headingEn?: string;
  descriptionEn?: string;
  textEn?: string;
  linkTextEn?: string;
  publicationDate?: string;
  createdAt?: string;
}

interface TeacherCertificationManagerProps {
  apiEndpoint: string;
  title: string;
}

export default function TeacherCertificationManager({ apiEndpoint, title }: TeacherCertificationManagerProps) {
  const [items, setItems] = useState<TeacherCertificationItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    heading: '',
    description: '',
    text: '',
    url: '',
    linkText: '',
    photoUrls: [] as string[],
    imagePosition: 'center', // Додаємо поле позиціонування з значенням за замовчуванням
    headingEn: '',
    descriptionEn: '',
    textEn: '',
    linkTextEn: ''
  });

  useEffect(() => {
    fetchItems();
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
        // Обробляємо кожен запис, щоб переконатися, що photoUrls є масивом
        const processedData = data.map(item => ({
          ...item,
          photoUrls: Array.isArray(item.photoUrls) ? item.photoUrls : [],
          imagePosition: item.imagePosition || 'center'
        }));
        setItems(processedData);
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
    
    // Валідація - хоча б одне поле має бути заповнене
    const hasHeading = formData.heading && formData.heading.trim() !== '';
    const hasDescription = formData.description && formData.description.trim() !== '';
    const hasText = formData.text && formData.text.trim() !== '';
    const hasUrl = formData.url && formData.url.trim() !== '';
    const hasLinkText = formData.linkText && formData.linkText.trim() !== '';
    const hasHeadingEn = formData.headingEn && formData.headingEn.trim() !== '';
    const hasDescriptionEn = formData.descriptionEn && formData.descriptionEn.trim() !== '';
    const hasTextEn = formData.textEn && formData.textEn.trim() !== '';
    const hasLinkTextEn = formData.linkTextEn && formData.linkTextEn.trim() !== '';

    if (!hasHeading && !hasDescription && !hasText && !hasUrl && !hasLinkText && !hasHeadingEn && !hasDescriptionEn && !hasTextEn && !hasLinkTextEn) {
      return;
    }

    try {
      const url = editingId 
        ? `${apiEndpoint}/${editingId}`
        : apiEndpoint;
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heading: formData.heading?.trim() || '',
          description: formData.description?.trim() || '',
          text: formData.text?.trim() || null,
          url: formData.url?.trim() || null,
          linkText: formData.linkText?.trim() || null,
          photoUrls: formData.photoUrls || [],
          imagePosition: formData.imagePosition || 'center', // Додаємо позиціонування
          headingEn: formData.headingEn?.trim() || null,
          descriptionEn: formData.descriptionEn?.trim() || null,
          textEn: formData.textEn?.trim() || null,
          linkTextEn: formData.linkTextEn?.trim() || null
        }),
      });

      if (response.ok) {
        resetForm();
        fetchItems();
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleEdit = (item: TeacherCertificationItem) => {
    setEditingId(item.id);
    setFormData({
      heading: item.heading || '',
      description: item.description || '',
      text: item.text || '',
      url: item.url || '',
      linkText: item.linkText || '',
      photoUrls: Array.isArray(item.photoUrls) ? item.photoUrls : [],
      imagePosition: item.imagePosition || 'center',
      headingEn: item.headingEn || '',
      descriptionEn: item.descriptionEn || '',
      textEn: item.textEn || '',
      linkTextEn: item.linkTextEn || ''
    });
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цей запис?')) return;
    
    try {
      const response = await fetch(`${apiEndpoint}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const resetForm = () => {
    setFormData({ heading: '', description: '', text: '', url: '', linkText: '', photoUrls: [], imagePosition: 'center', headingEn: '', descriptionEn: '', textEn: '', linkTextEn: '' });
    setIsAdding(false);
    setEditingId(null);
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

  const clearAllImages = () => {
    setFormData(prev => ({
      ...prev,
      photoUrls: []
    }));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Button 
          onClick={() => setIsAdding(true)} 
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Додати запис
        </Button>
      </div>

      {/* Форма додавання/редагування */}
      {isAdding && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {editingId ? 'Редагувати запис' : 'Додати новий запис'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="heading">Заголовок</Label>
                <Input
                  id="heading"
                  value={formData.heading}
                  onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                  placeholder="Введіть заголовок"
                />
              </div>

              <div>
                <Label htmlFor="headingEn">Заголовок англійською</Label>
                <Input
                  id="headingEn"
                  value={formData.headingEn}
                  onChange={(e) => setFormData({ ...formData, headingEn: e.target.value })}
                  placeholder="Enter heading in English"
                />
              </div>
               
              <div>
                <Label htmlFor="description">Опис</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Введіть опис"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="descriptionEn">Опис англійською</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Enter description in English"
                  rows={4}
                />
              </div>

              <div>
                <Label>Фотографії</Label>
                <ImageUploader onUploadComplete={handleImageUpload} />

                {formData.photoUrls.length > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Завантажені фотографії:</span>
                      <Button
                        type="button"
                        onClick={clearAllImages}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-800"
                      >
                        Очистити всі
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Додаємо поле позиціонування фото */}
              <div>
                <Label htmlFor="imagePosition">Позиціонування фото</Label>
                <select
                  id="imagePosition"
                  value={formData.imagePosition}
                  onChange={(e) => setFormData({ ...formData, imagePosition: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="center">Центр</option>
                  <option value="top">Верх</option>
                  <option value="bottom">Низ</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Виберіть, як має розташовуватися фото в блоці
                </p>
              </div>

              <div className="border-l-4 border-pink-500 pl-4 bg-pink-50 p-4 rounded">
                <h4 className="font-semibold text-pink-700 mb-3">📌 Контент для рожевого фону</h4>
                
                <div className="mb-4">
                  <Label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Додатковий текст</Label>
                  <Textarea
                    id="text"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    placeholder="Введіть додатковий текст"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="textEn" className="block text-sm font-medium text-gray-700 mb-1">Додатковий текст англійською</Label>
                  <Textarea
                    id="textEn"
                    value={formData.textEn}
                    onChange={(e) => setFormData({ ...formData, textEn: e.target.value })}
                    placeholder="Enter additional text in English"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">Посилання (URL)</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>

                <div>
                  <Label htmlFor="linkText" className="block text-sm font-medium text-gray-700 mb-1">Текст посилання</Label>
                  <Input
                    id="linkText"
                    value={formData.linkText}
                    onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                    placeholder="Текст, який буде відображатися як посилання"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Якщо не вказано, буде використовуватися URL посилання
                  </p>
                </div>

                <div>
                  <Label htmlFor="linkTextEn" className="block text-sm font-medium text-gray-700 mb-1">Текст посилання англійською</Label>
                  <Input
                    id="linkTextEn"
                    value={formData.linkTextEn}
                    onChange={(e) => setFormData({ ...formData, linkTextEn: e.target.value })}
                    placeholder="Enter link text in English"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                  {editingId ? 'Оновити' : 'Додати'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Скасувати
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Відображення помилок */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Відображення завантаження */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-lg">Завантаження...</div>
        </div>
      )}

      {/* Список записів */}
      <div className="space-y-4">
        {!loading && items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpanded(item.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  {item.heading && (
                    <CardTitle className="text-lg mb-2">{item.heading}</CardTitle>
                  )}

                  {item.description && (
                    <div className="text-gray-600 mb-2">
                      {item.description.length > 80
                        ? item.description.substring(0, 80) + '...'
                        : item.description
                      }
                    </div>
                  )}

                  {item.text && (
                    <div className="text-gray-600 mb-2">
                      {item.text.length > 80
                        ? item.text.substring(0, 80) + '...'
                        : item.text
                      }
                    </div>
                  )}

                  {item.url && (
                    <div className="text-blue-600 text-sm mb-2">
                      Посилання: {item.linkText || item.url}
                    </div>
                  )}

                  {item.photoUrls && item.photoUrls.length > 0 && (
                    <div className="text-sm text-gray-500">
                      Фото: {item.photoUrls.length} шт.
                    </div>
                  )}

                  {/* Додаємо відображення позиціонування тільки якщо є фото */}
                  {item.imagePosition && item.photoUrls && item.photoUrls.length > 0 && (
                    <div className="text-sm text-gray-500">
                      Позиція фото: {item.imagePosition}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {expandedItems.has(item.id) ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            {expandedItems.has(item.id) && (
              <CardContent className="border-t bg-gray-50">
                <div className="space-y-3">
                  {item.heading && (
                    <div>
                      <strong>Заголовок:</strong>
                      <p className="mt-1">{item.heading}</p>
                    </div>
                  )}

                  {item.headingEn && (
                    <div>
                      <strong>Заголовок (англійська):</strong>
                      <p className="mt-1">{item.headingEn}</p>
                    </div>
                  )}

                  {item.description && (
                    <div>
                      <strong>Опис:</strong>
                      <p className="mt-1">{item.description}</p>
                    </div>
                  )}

                  {item.descriptionEn && (
                    <div>
                      <strong>Опис (англійська):</strong>
                      <p className="mt-1">{item.descriptionEn}</p>
                    </div>
                  )}

                  {item.text && (
                    <div>
                      <strong>Додатковий текст:</strong>
                      <p className="mt-1">{item.text}</p>
                    </div>
                  )}

                  {item.textEn && (
                    <div>
                      <strong>Додатковий текст (англійська):</strong>
                      <p className="mt-1">{item.textEn}</p>
                    </div>
                  )}

                  {item.url && (
                    <div>
                      <strong>Посилання:</strong>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline mt-1 block"
                      >
                        {item.linkText || item.url}
                      </a>
                    </div>
                  )}

                  {item.linkTextEn && (
                    <div>
                      <strong>Текст посилання (англійська):</strong>
                      <p className="mt-1">{item.linkTextEn}</p>
                    </div>
                  )}

                  {/* Додаємо відображення позиціонування в розгорнутому вигляді тільки якщо є фото */}
                  {item.imagePosition && item.photoUrls && item.photoUrls.length > 0 && (
                    <div>
                      <strong>Позиціонування фото:</strong>
                      <p className="mt-1">{item.imagePosition}</p>
                    </div>
                  )}

                  {item.photoUrls && item.photoUrls.length > 0 && (
                    <div>
                      <strong>Фотографії:</strong>
                      <div className="mt-2 space-y-2">
                        {item.photoUrls.map((url: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <img 
                              src={url} 
                              alt={`Фото ${index + 1}`} 
                              className="w-16 h-16 object-cover rounded border"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                              }}
                            />
                            <span className="text-sm text-gray-600">{url}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-500">
                    <strong>Дата створення:</strong> {new Date(item.createdAt || '').toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
