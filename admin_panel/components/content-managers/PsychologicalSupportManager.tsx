"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface PsychologicalSupportData {
  id: number;
  title: string | null;
  content: string | null;
  text: string | null;
  link: string | null;
  linkText: string | null;
  titleEn: string | null;
  contentEn: string | null;
  textEn: string | null;
  linkTextEn: string | null;
}

interface PsychologicalSupportManagerProps {
  apiEndpoint: string;
  title: string;
}

export default function PsychologicalSupportManager({ apiEndpoint, title }: PsychologicalSupportManagerProps) {
  console.log('🎯 PsychologicalSupportManager: компонент рендериться, apiEndpoint:', apiEndpoint, 'title:', title);
  
  const [articles, setArticles] = useState<PsychologicalSupportData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<PsychologicalSupportData | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    text: "",
    link: "",
    linkText: "",
    titleEn: "",
    contentEn: "",
    textEn: "",
    linkTextEn: ""
  });
  
  console.log('🔄 PsychologicalSupportManager: formData ініціалізовано:', formData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔄 PsychologicalSupportManager: useEffect викликано, apiEndpoint:', apiEndpoint);
    console.log('🔄 Початковий formData:', formData);
    fetchArticles();
  }, [apiEndpoint]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Завантаження записів з:', apiEndpoint);
      
      const response = await fetch(apiEndpoint);
      console.log('📥 Статус відповіді:', response.status);
      
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
        setArticles([]);
        return;
      }
      
      console.log('📋 Отримані дані:', data);
      
      if (Array.isArray(data)) {
        setArticles(data);
      } else {
        console.error('❌ API повернув не масив:', data);
        setError('API повернув некоректні дані');
        setArticles([]);
      }
    } catch (error) {
      console.error('❌ Помилка завантаження статей:', error);
      setError(error instanceof Error ? error.message : 'Невідома помилка');
      setArticles([]);
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
      console.log('🔍 editingArticle:', editingArticle);
      console.log('🔍 editingArticle?.id:', editingArticle?.id);
      
      const isCreatingNew = !editingArticle || !editingArticle.id;
      const url = isCreatingNew 
        ? apiEndpoint 
        : `${apiEndpoint}/${editingArticle.id}`;
      
      const method = isCreatingNew ? 'POST' : 'PUT';
      
      console.log('📡 Відправка запиту на:', url, 'методом:', method);
      console.log('📡 Повний URL:', url);
      console.log('📡 Метод:', method);
      console.log('📡 Логіка: isEditing =', isEditing, ', editingArticle?.id =', editingArticle?.id);
      console.log('📡 isCreatingNew =', isCreatingNew);
      console.log('📡 Результат: method =', method, ', url =', url);
      console.log('📡 formData для відправки:', JSON.stringify(formData, null, 2));
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
        await fetchArticles();
        resetForm();
      } else {
        console.error('❌ Помилка від сервера:', data);
        console.error('❌ Статус відповіді:', response.status);
        console.error('❌ Повна відповідь:', responseText);
        const errorMessage = data.error || data.details || 'Невідома помилка сервера';
        setError(`${errorMessage} (статус: ${response.status})`);
      }
    } catch (error) {
      console.error('❌ Помилка при збереженні запису:', error);
      setError(error instanceof Error ? error.message : 'Невідома помилка мережі');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: PsychologicalSupportData) => {
    console.log('🔧 Редагування запису:', article);
    
    setEditingArticle(article);
    setFormData({
      title: article.title || "",
      content: article.content || "",
      text: article.text || "",
      link: article.link || "",
      linkText: article.linkText || "",
      titleEn: article.titleEn || "",
      contentEn: article.contentEn || "",
      textEn: article.textEn || "",
      linkTextEn: article.linkTextEn || ""
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цей запис?')) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiEndpoint}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchArticles();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Помилка при видаленні');
      }
    } catch (error) {
      console.error('❌ Помилка при видаленні запису:', error);
      setError(error instanceof Error ? error.message : 'Невідома помилка мережі');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    console.log('🔄 Скидання форми');
    const defaultFormData = {
      title: "",
      content: "",
      text: "",
      link: "",
      linkText: "",
      titleEn: "",
      contentEn: "",
      textEn: "",
      linkTextEn: ""
    };
    console.log('🔄 Встановлюємо значення за замовчуванням:', defaultFormData);
    setFormData(defaultFormData);
    setIsEditing(false);
    setEditingArticle(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button 
          onClick={() => {
            console.log('🔘 Кнопка "Додати новий запис" натиснута');
            setIsEditing(true);
            setEditingArticle(null);
            setFormData({
              title: "",
              content: "",
              text: "",
              link: "",
              linkText: "",
              titleEn: "",
              contentEn: "",
              textEn: "",
              linkTextEn: ""
            });
          }}
          className="bg-blue-500 hover:bg-blue-600"
          disabled={loading}
        >
          Додати новий запис
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
              {editingArticle ? 'Редагувати запис' : 'Додати новий запис'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Заголовок (для статті)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Введіть заголовок"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="titleEn">Заголовок англійською (для статті)</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Enter article title in English"
                  disabled={loading}
                />
              </div>
              
              <div>
                <Label htmlFor="content">Контент статті</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Введіть текст..."
                  disabled={loading}
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Використовуйте • для створення маркованих списків
                </p>
              </div>

              <div>
                <Label htmlFor="contentEn">Контент статті англійською</Label>
                <Textarea
                  id="contentEn"
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  placeholder="Enter accordion content in English..."
                  disabled={loading}
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-700 mb-3">📌 Контент для синього фону</h4>
                
                <div className="mb-4">
                  <Label htmlFor="text">Додатковий текст</Label>
                  <Textarea
                    id="text"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    placeholder="Введіть додатковий текст для відображення на синьому фоні..."
                    disabled={loading}
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="textEn">Додатковий текст англійською</Label>
                  <Textarea
                    id="textEn"
                    value={formData.textEn}
                    onChange={(e) => setFormData({ ...formData, textEn: e.target.value })}
                    placeholder="Enter additional text in English for blue background..."
                    disabled={loading}
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="mb-4">
                  <Label htmlFor="link">Посилання</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://example.com"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="linkText">Текст посилання</Label>
                  <Input
                    id="linkText"
                    value={formData.linkText}
                    onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                    placeholder="Текст, який буде відображатися як посилання"
                    disabled={loading}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Якщо не вказано, буде використовуватися URL посилання
                  </p>
                </div>

                <div>
                  <Label htmlFor="linkTextEn">Текст посилання англійською</Label>
                  <Input
                    id="linkTextEn"
                    value={formData.linkTextEn}
                    onChange={(e) => setFormData({ ...formData, linkTextEn: e.target.value })}
                    placeholder="Link text that will be displayed in English"
                    disabled={loading}
                  />
                </div>
              </div>


              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? 'Збереження...' : (editingArticle ? 'Оновити' : 'Додати')}
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
        {articles.map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  {article.title && (
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                  )}
                  
                  {article.content && (
                    <div className="text-sm text-gray-600 mb-3 line-clamp-4">
                      {article.content.substring(0, 200)}...
                    </div>
                  )}

                  {(article.text || article.link) && (
                    <div className="text-sm text-blue-600 mb-2 p-2 bg-blue-50 rounded">
                      <strong>📌 Буде відображатися на синьому фоні:</strong>
                      {article.text && (
                        <div className="mt-1">
                          <strong>Текст:</strong> {article.text.substring(0, 100)}...
                        </div>
                      )}
                      {article.link && (
                        <div className="mt-1">
                          <strong>Посилання:</strong> {article.linkText || article.link}
                        </div>
                      )}
                    </div>
                  )}
                  
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleEdit(article)}
                    size="sm"
                    variant="outline"
                    disabled={loading}
                  >
                    Редагувати
                  </Button>
                  <Button
                    onClick={() => handleDelete(article.id)}
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

      {articles.length === 0 && !isEditing && !loading && (
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
