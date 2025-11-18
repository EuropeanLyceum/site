"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/shared/ImageUploader";

interface NewsData {
  id: number;
  heading: string;
  description: string;
  headingEn?: string; // English heading
  descriptionEn?: string; // English description
  photoUrls: string[]; // Масив URL
  imagePosition?: string; // Позиція фото
  publicationDate: string;
}

interface NewsManagerProps {
  apiEndpoint: string;
  title: string;
}

export default function NewsManager({ apiEndpoint, title }: NewsManagerProps) {
  console.log('🎯 NewsManager: компонент рендериться, apiEndpoint:', apiEndpoint, 'title:', title);
  
  const [news, setNews] = useState<NewsData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsData | null>(null);
  const [formData, setFormData] = useState({
    heading: "",
    description: "",
    headingEn: "",
    descriptionEn: "",
    photoUrls: [] as string[],
    imagePosition: "center"
  });
  
  console.log('🔄 NewsManager: formData ініціалізовано:', formData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔄 NewsManager: useEffect викликано, apiEndpoint:', apiEndpoint);
    console.log('🔄 Початковий formData:', formData);
    
    // Додаємо перевірку, що apiEndpoint не пустий
    if (apiEndpoint) {
      fetchNews();
    } else {
      console.warn('⚠️ apiEndpoint is empty, skipping fetch');
    }
  }, [apiEndpoint]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Завантаження новин з:', apiEndpoint);
      
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
        setNews([]);
        return;
      }
      
      console.log('📋 Отримані дані:', data);
      
      if (Array.isArray(data)) {
        // Переконуємося, що кожен запис має поле imagePosition
        const processedData = data.map(item => ({
          ...item,
          imagePosition: item.imagePosition || 'center'
        }));
        setNews(processedData);
      } else {
        console.error('❌ API повернув не масив:', data);
        setError('API повернув некоректні дані');
        setNews([]);
      }
    } catch (error) {
      console.error('❌ Помилка завантаження новин:', error);
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
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Відправка форми:', JSON.stringify(formData, null, 2));
      console.log('🔍 isEditing:', isEditing);
      console.log('🔍 editingNews:', editingNews);
      console.log('🔍 editingNews?.id:', editingNews?.id);
      
      // Виправлена логіка: якщо editingNews null, то створюємо нову новину (POST)
      const isCreatingNew = !editingNews || !editingNews.id;
      const url = isCreatingNew 
        ? apiEndpoint 
        : `${apiEndpoint}/${editingNews.id}`;
      
      const method = isCreatingNew ? 'POST' : 'PUT';
      
      console.log('📡 Відправка запиту на:', url, 'методом:', method);
      console.log('📡 Повний URL:', url);
      console.log('📡 Метод:', method);
      console.log('📡 Логіка: isEditing =', isEditing, ', editingNews?.id =', editingNews?.id);
      console.log('📡 isCreatingNew =', isCreatingNew);
      console.log('📡 Результат: method =', method, ', url =', url);
      console.log('📡 formData для відправки:', JSON.stringify(formData, null, 2));
      console.log('📡 imagePosition в formData:', formData.imagePosition);
      
      // Переконуємося, що imagePosition завжди присутній
      const dataToSend = {
        ...formData,
        imagePosition: formData.imagePosition || 'center'
      };
      
      console.log('📡 Дані для відправки:', JSON.stringify(dataToSend, null, 2));
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      console.log('📥 Статус відповіді:', response.status);
      console.log('📥 Headers відповіді:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('📥 Текст відповіді:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('📥 Парсовані дані:', data);
      } catch (parseError) {
        console.error('❌ Помилка парсингу JSON:', parseError);
        setError(`Помилка парсингу відповіді: ${responseText}`);
        return;
      }

      if (response.ok) {
        console.log('✅ Успішно збережено:', data);
        await fetchNews();
        resetForm();
      } else {
        console.error('❌ Помилка від сервера:', data);
        console.error('❌ Статус відповіді:', response.status);
        console.error('❌ Повна відповідь:', responseText);
        const errorMessage = data.error || data.details || 'Невідома помилка сервера';
        setError(`${errorMessage} (статус: ${response.status})`);
      }
    } catch (error) {
      console.error('❌ Помилка при збереженні новини:', error);
      setError(error instanceof Error ? error.message : 'Невідома помилка мережі');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (newsItem: NewsData) => {
    console.log('🔧 Редагування новини:', newsItem);
    console.log('🔧 imagePosition:', newsItem.imagePosition);
    console.log('🔧 Тип imagePosition:', typeof newsItem.imagePosition);
    
    const imagePosition = newsItem.imagePosition || "center";
    console.log('🔧 Встановлюємо imagePosition:', imagePosition);
    
    setEditingNews(newsItem);
    setFormData({
      heading: newsItem.heading,
      description: newsItem.description,
      headingEn: newsItem.headingEn || "",
      descriptionEn: newsItem.descriptionEn || "",
      photoUrls: Array.isArray(newsItem.photoUrls) ? newsItem.photoUrls : [],
      imagePosition: imagePosition
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цю новину?')) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiEndpoint}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchNews();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Помилка видалення');
      }
    } catch (error) {
      console.error('Помилка видалення новини:', error);
      setError(error instanceof Error ? error.message : 'Невідома помилка');
    } finally {
      setLoading(false);
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
    console.log('🔄 Скидання форми');
    const defaultFormData = {
      heading: "",
      description: "",
      headingEn: "",
      descriptionEn: "",
      photoUrls: [],
      imagePosition: "center"
    };
    console.log('🔄 Встановлюємо значення за замовчуванням:', defaultFormData);
    setFormData(defaultFormData);
    setIsEditing(false);
    setEditingNews(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button 
          onClick={() => {
            console.log('🔘 Кнопка "Додати новий запис" натиснута');
            console.log('🔘 Поточний стан isEditing:', isEditing);
            console.log('🔘 Поточний стан editingNews:', editingNews);
            
            setIsEditing(true);
            setEditingNews(null);
            setFormData({
              heading: "",
              description: "",
              headingEn: "",
              descriptionEn: "",
              photoUrls: [],
              imagePosition: "center"
            });
            
            console.log('🔘 Після зміни: isEditing = true, editingNews = null');
          }}
          className="bg-blue-500 hover:bg-blue-600"
          disabled={loading}
        >
          {title.includes('новинами') ? 'Додати нову новину' : 
           title.includes('методичними заходами') ? 'Додати новий методичний захід' :
           'Додати новий запис'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Помилка:</strong> {error}
        </div>
      )}

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingNews ? 
                (title.includes('новинами') ? 'Редагувати новину' : 
                 title.includes('методичними заходами') ? 'Редагувати методичний захід' :
                 'Редагувати запис') : 
                (title.includes('новинами') ? 'Додати нову новину' : 
                 title.includes('методичними заходами') ? 'Додати новий методичний захід' :
                 'Додати новий запис')}
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
                  placeholder="Введіть заголовок новини"
                  disabled={loading}
                />
              </div>
              
              <div>
                <Label htmlFor="description">Опис</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Введіть опис новини"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="headingEn">Заголовок англійською</Label>
                <Input
                  id="headingEn"
                  value={formData.headingEn}
                  onChange={(e) => setFormData({ ...formData, headingEn: e.target.value })}
                  placeholder="Введіть заголовок новини англійською"
                  disabled={loading}
                />
              </div>
              
              <div>
                <Label htmlFor="descriptionEn">Опис англійською</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  placeholder="Введіть опис новини англійською"
                  disabled={loading}
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

              <div>
                <Label htmlFor="imagePosition">Позиціонування першого фото:</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Виберіть, як розташувати перше фото в блоці для кращого відображення
                </p>
                <select
                  id="imagePosition"
                  value={formData.imagePosition}
                  onChange={(e) => setFormData({...formData, imagePosition: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={loading}
                >
                  <option value="center">Центр (за замовчуванням)</option>
                  <option value="top">Верх (показує верхню частину фото)</option>
                  <option value="bottom">Низ (показує нижню частину фото)</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? 'Збереження...' : 
                   (editingNews ? 
                     (title.includes('новинами') ? 'Оновити новину' : 
                      title.includes('методичними заходами') ? 'Оновити захід' :
                      'Оновити') : 
                     (title.includes('новинами') ? 'Додати новину' : 
                      title.includes('методичними заходами') ? 'Додати захід' :
                      'Додати'))}
                </Button>
                <Button 
                  type="button" 
                  onClick={resetForm}
                  variant="outline"
                  disabled={loading}
                >
                  Скасувати
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading && !isEditing && (
        <div className="text-center py-8">
          <p>Завантаження...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((newsItem) => (
          <Card key={newsItem.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{newsItem.heading}</h3>
                  {newsItem.headingEn && (
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">{newsItem.headingEn}</h3>
                  )}
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                    {newsItem.description}
                  </p>
                  {newsItem.descriptionEn && (
                    <p className="text-sm text-blue-600 mb-3 line-clamp-3">
                      {newsItem.descriptionEn}
                    </p>
                  )}
                  
                  {Array.isArray(newsItem.photoUrls) && newsItem.photoUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {newsItem.photoUrls.slice(0, 4).map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Фото ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    {new Date(newsItem.publicationDate).toLocaleDateString()}
                  </p>
                  {newsItem.imagePosition && (
                    <p className="text-xs text-gray-500">
                      Позиціонування першого фото: {newsItem.imagePosition === 'top' ? 'Верх' : 
                                    newsItem.imagePosition === 'bottom' ? 'Низ' : 'Центр'}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleEdit(newsItem)}
                    size="sm"
                    variant="outline"
                    disabled={loading}
                  >
                    Редагувати
                  </Button>
                  <Button
                    onClick={() => handleDelete(newsItem.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-500 hover:text-red-700"
                    disabled={loading}
                  >
                    Видалити
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {news.length === 0 && !isEditing && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">
              {title.includes('новинами') ? 'Поки що немає доданих новин' :
               title.includes('методичними заходами') ? 'Поки що немає доданих методичних заходів' :
               'Поки що немає доданих записів'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {title.includes('новинами') ? 'Натисніть "Додати нову новину" щоб почати' :
               title.includes('методичними заходами') ? 'Натисніть "Додати новий методичний захід" щоб почати' :
               'Натисніть "Додати новий запис" щоб почати'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
