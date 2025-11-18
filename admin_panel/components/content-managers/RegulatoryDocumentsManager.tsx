"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ImageUploader from "@/components/shared/ImageUploader";

interface RegulatoryDocument {
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

interface RegulatoryDocumentsManagerProps {
  apiEndpoint: string;
  title: string;
}

export default function RegulatoryDocumentsManager({ apiEndpoint, title }: RegulatoryDocumentsManagerProps) {
  const [documents, setDocuments] = useState<RegulatoryDocument[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDocument, setEditingDocument] = useState<RegulatoryDocument | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    titleEn: "",
    contentEn: "",
    url: "",
    linkText: "",
    linkTextEn: "",
    photoUrls: [] as string[]
  });

  useEffect(() => {
    fetchDocuments();
  }, [apiEndpoint]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      console.log('Fetched data:', data);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      
      // Перевіряємо, чи data є масивом
      if (Array.isArray(data)) {
        setDocuments(data);
      } else {
        console.error('Expected array but got:', data);
        setDocuments([]);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Form submission started');
      const isCreatingNew = !editingDocument || !editingDocument.id;
      
      const url = isCreatingNew 
        ? apiEndpoint 
        : `${apiEndpoint}/${editingDocument.id}`;
      
      const method = isCreatingNew ? 'POST' : 'PUT';
      
      const payload = {
        title: formData.title || null,
        content: formData.content || null,
        titleEn: formData.titleEn || null,
        contentEn: formData.contentEn || null,
        url: formData.url || null,
        linkText: formData.linkText || null,
        linkTextEn: formData.linkTextEn || null,
        photoUrls: formData.photoUrls
      };

      console.log('Form data:', formData);
      console.log('Payload:', payload);
      console.log('Request URL:', url);
      console.log('Request method:', method);

      // Перевіряємо що принаймні одне поле заповнене
      if (!payload.title && !payload.content && !payload.titleEn && !payload.contentEn && !payload.url && !payload.linkText && !payload.linkTextEn && (!payload.photoUrls || payload.photoUrls.length === 0)) {
        alert('Потрібно заповнити принаймні одне поле');
        return;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const responseData = await response.json();
        console.log('Response data:', responseData);
        fetchDocuments();
        resetForm();
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Помилка збереження: ${errorData.error || 'Невідома помилка'}`);
      }
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Помилка збереження документа');
    }
  };

  const handleEdit = (document: RegulatoryDocument) => {
    setIsEditing(true);
    setEditingDocument(document);
    setFormData({
      title: document.title || "",
      content: document.content || "",
      titleEn: document.titleEn || "",
      contentEn: document.contentEn || "",
      url: document.url || "",
      linkText: document.linkText || "",
      linkTextEn: document.linkTextEn || "",
      photoUrls: document.photoUrls ? JSON.parse(document.photoUrls) : []
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цей документ?')) {
      try {
        const response = await fetch(`${apiEndpoint}/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchDocuments();
        }
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingDocument(null);
    setFormData({
      title: "",
      content: "",
      titleEn: "",
      contentEn: "",
      url: "",
      linkText: "",
      linkTextEn: "",
      photoUrls: []
    });
  };

  const handleImageUpload = (url: string) => {
    if (url && typeof url === 'string') {
      setFormData(prev => ({ 
        ...prev, 
        photoUrls: [...prev.photoUrls, url] 
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photoUrls: prev.photoUrls.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Всього документів: {documents.length}
          </p>
        </div>
        <Button 
          onClick={() => {
            setIsEditing(true);
            setEditingDocument(null);
            setFormData({
              title: "",
              content: "",
              titleEn: "",
              contentEn: "",
              url: "",
              linkText: "",
              linkTextEn: "",
              photoUrls: []
            });
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Додати новий документ
        </Button>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingDocument ? 'Редагувати документ' : 'Додати новий документ'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Введіть заголовок документа"
                />
              </div>

              <div>
                <Label htmlFor="titleEn">Заголовок англійською</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                  placeholder="Введіть заголовок документа англійською"
                />
              </div>

              <div>
                <Label htmlFor="content">Текст</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  placeholder="Введіть текст документа"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Використовуйте Enter для створення нових рядків
                </p>
              </div>

              <div>
                <Label htmlFor="contentEn">Текст англійською</Label>
                <Textarea
                  id="contentEn"
                  value={formData.contentEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, contentEn: e.target.value }))}
                  rows={4}
                  placeholder="Введіть текст документа англійською"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Використовуйте Enter для створення нових рядків
                </p>
              </div>

              <div>
                <Label htmlFor="linkText">Текст посилання</Label>
                <Input
                  id="linkText"
                  value={formData.linkText}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkText: e.target.value }))}
                  placeholder="Наприклад: Виписка з ЄДР (клікабельний текст)"
                />
                <p className="text-xs text-gray-500 mt-1">Цей текст відображається на сайті та відкриває посилання нижче.</p>
              </div>

              <div>
                <Label htmlFor="linkTextEn">Текст посилання англійською</Label>
                <Input
                  id="linkTextEn"
                  value={formData.linkTextEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkTextEn: e.target.value }))}
                  placeholder="Наприклад: EDR Extract (clickable text)"
                />
                <p className="text-xs text-gray-500 mt-1">Англійський варіант тексту посилання.</p>
              </div>

              <div>
                <Label htmlFor="url">Посилання (URL)</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com/your-document"
                />
                <p className="text-xs text-gray-500 mt-1">Додайте повний URL. Натиснувши на текст вище, відкриється це посилання у новій вкладці.</p>
              </div>

              <div>
                <Label>Фото (опціонально)</Label>
                <ImageUploader 
                  onUploadComplete={handleImageUpload} 
                />
                {formData.photoUrls.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Завантажені фото:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.photoUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={url} 
                            alt={`Photo ${index + 1}`} 
                            className="w-20 h-20 object-cover rounded border"
                          />
                          <Button
                            type="button"
                            onClick={() => removeImage(index)}
                            size="sm"
                            variant="outline"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 text-red-500 hover:text-red-700"
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
                <Button type="submit" className="bg-green-500 hover:bg-green-600">
                  {editingDocument ? 'Оновити' : 'Додати'}
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
        {Array.isArray(documents) && documents.map((document) => (
          <Card key={document.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  {document.photoUrls && (() => {
                    try {
                      const photos = JSON.parse(document.photoUrls);
                      return Array.isArray(photos) && photos.length > 0;
                    } catch (e) {
                      return false;
                    }
                  })() && (
                    <img 
                      src={JSON.parse(document.photoUrls)[0]} 
                      alt="Document" 
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-2">{document.title || 'Без заголовка'}</h3>
                  {document.titleEn && (
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">{document.titleEn}</h3>
                  )}
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                    {document.content || 'Без тексту'}
                  </p>
                  {document.contentEn && (
                    <p className="text-sm text-blue-600 mb-2 line-clamp-3">
                      {document.contentEn}
                    </p>
                  )}
                  {document.url && (
                    <div>
                      <a 
                        href={document.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm break-all"
                      >
                        {document.linkText || document.url}
                      </a>
                      {document.linkTextEn && (
                        <div className="text-blue-400 hover:text-blue-600 text-sm break-all mt-1">
                          {document.linkTextEn}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-auto pt-4">
                  <Button
                    onClick={() => handleEdit(document)}
                    size="sm"
                    variant="outline"
                  >
                    Редагувати
                  </Button>
                  <Button
                    onClick={() => handleDelete(document.id)}
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

      {(!Array.isArray(documents) || documents.length === 0) && !isEditing && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Поки що немає доданих документів</p>
            <p className="text-sm text-gray-400 mt-2">
              Натисніть "Додати новий документ" щоб почати
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
