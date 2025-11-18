"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/shared/ImageUploader";

interface AntiBullyingData {
  id: number;
  title: string | null;
  content: string | null;
  text: string | null;
  link: string | null;
  linkText: string | null;
  titleEn: string | null;
  contentEn: string | null;
  linkTextEn: string | null;
  photoUrls: string | null;
}

interface AntiBullyingManagerProps {
  apiEndpoint: string;
  title: string;
}

export default function AntiBullyingManager({ apiEndpoint, title }: AntiBullyingManagerProps) {
  const [articles, setArticles] = useState<AntiBullyingData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticle, setEditingArticle] = useState<AntiBullyingData | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    text: "",
    link: "",
    linkText: "",
    titleEn: "",
    contentEn: "",
    linkTextEn: "",
    photoUrls: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, [apiEndpoint]);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(apiEndpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: AntiBullyingData[] = await response.json();
      setArticles(data);
    } catch (err) {
      console.error('Error loading articles:', err);
      setError(`Error loading articles: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    const currentUrls = getPhotoUrls();
    const newUrls = [...currentUrls, url];
    setFormData(prev => ({ ...prev, photoUrls: newUrls.join(',') }));
  };

  const removeImage = (index: number) => {
    const currentUrls = getPhotoUrls();
    const newUrls = currentUrls.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, photoUrls: newUrls.join(',') }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Перевірка, чи хоча б одне поле заповнене
    const hasTitle = formData.title && formData.title.trim() !== '';
    const hasContent = formData.content && formData.content.trim() !== '';
    const hasText = formData.text && formData.text.trim() !== '';
    const hasLink = formData.link && formData.link.trim() !== '';
    const hasTitleEn = formData.titleEn && formData.titleEn.trim() !== '';
    const hasContentEn = formData.contentEn && formData.contentEn.trim() !== '';
    const hasLinkTextEn = formData.linkTextEn && formData.linkTextEn.trim() !== '';
    
    if (!hasTitle && !hasContent && !hasText && !hasLink && !hasTitleEn && !hasContentEn && !hasLinkTextEn) {
      setError('Принаймні одне поле має бути заповнене');
      setLoading(false);
      return;
    }

    try {
      // Визначаємо чи це редагування існуючої статті
      const isEditingExisting = isEditing && editingArticle && editingArticle.id;
      const method = isEditingExisting ? 'PUT' : 'POST';
      const url = isEditingExisting ? `${apiEndpoint}/${editingArticle.id}` : apiEndpoint;
      
      console.log('Request details:', {
        isEditing,
        editingArticle,
        isEditingExisting,
        method,
        url
      });
      
      // Перевіряємо чи є ID при редагуванні (тільки якщо це редагування існуючої статті)
      if (isEditing && editingArticle && !editingArticle?.id) {
        setError('Помилка: ID статті не знайдено');
        setLoading(false);
        return;
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      resetForm();
      fetchArticles();
    } catch (err) {
      console.error('Error saving article:', err);
      setError(`Error saving article: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: AntiBullyingData) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || "",
      content: article.content || "",
      text: article.text || "",
      link: article.link || "",
      linkText: article.linkText || "",
      titleEn: article.titleEn || "",
      contentEn: article.contentEn || "",
      linkTextEn: article.linkTextEn || "",
      photoUrls: article.photoUrls || ""
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цю статтю?')) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiEndpoint}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      fetchArticles();
    } catch (err) {
      console.error('Error deleting article:', err);
      setError(`Error deleting article: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      text: "",
      link: "",
      linkText: "",
      titleEn: "",
      contentEn: "",
      linkTextEn: "",
      photoUrls: ""
    });
    setIsEditing(false);
    setEditingArticle(null);
    setError(null);
  };

  const getPhotoUrls = () => {
    if (!formData.photoUrls) return [];
    if (Array.isArray(formData.photoUrls)) return formData.photoUrls;
    return formData.photoUrls.split(',').filter(url => url.trim());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button 
          onClick={() => {
            console.log('Adding new article - isEditing will be true, editingArticle will be null');
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
              linkTextEn: "",
              photoUrls: ""
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
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Введіть заголовок"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="titleEn">Заголовок англійською</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Enter title in English"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="content">Зміст</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Введіть зміст"
                  rows={5}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="contentEn">Зміст англійською</Label>
                <Textarea
                  id="contentEn"
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  placeholder="Enter content in English"
                  rows={5}
                  disabled={loading}
                />
              </div>

                <div>
                  <Label>Фотографії</Label>
                  <ImageUploader onUploadComplete={handleImageUpload} multiple={true} />
                
                {getPhotoUrls().length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {getPhotoUrls().map((url, index) => (
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

              <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded">
                <h4 className="font-semibold text-blue-700 mb-3">📌 Контент для секції "Корисні документи та матеріали"</h4>
                
                <div className="mb-4">
                  <Label htmlFor="link">Посилання (URL)</Label>
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
                    placeholder="Назва посилання"
                    disabled={loading}
                  />
                </div>

                <div>
                  <Label htmlFor="linkTextEn">Текст посилання англійською</Label>
                  <Input
                    id="linkTextEn"
                    value={formData.linkTextEn}
                    onChange={(e) => setFormData({ ...formData, linkTextEn: e.target.value })}
                    placeholder="Link text in English"
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
                      <strong>📌 Буде відображатися в секції документів:</strong>
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

                  {article.photoUrls && (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Фотографії:</p>
                      <div className="flex flex-wrap gap-2">
                        {article.photoUrls.split(',').filter(url => url.trim()).map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Фото ${index + 1}`}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ))}
                      </div>
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
    </div>
  );
}
