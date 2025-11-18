'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import ImageUploader from '../shared/ImageUploader';

interface QualificationImprovementItem {
  id: number;
  title: string | null;
  content: string | null;
  photoUrls: string[];
  text: string | null;
  link: string | null;
  linkText: string | null;
  titleEn: string | null;
  contentEn: string | null;
  textEn: string | null;
  linkTextEn: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface QualificationImprovementManagerProps {
  apiEndpoint: string;
  title: string;
}

export default function QualificationImprovementManager({ apiEndpoint, title }: QualificationImprovementManagerProps) {
  const [items, setItems] = useState<QualificationImprovementItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    photoUrls: [] as string[],
    text: '',
    link: '',
    linkText: '',
    titleEn: '',
    contentEn: '',
    textEn: '',
    linkTextEn: ''
  });

  useEffect(() => {
    fetchItems();
  }, [apiEndpoint]);

  const fetchItems = async () => {
    try {
      const response = await fetch(apiEndpoint);
      if (response.ok) {
        const data = await response.json();
        const sortedData = data.sort((a: QualificationImprovementItem, b: QualificationImprovementItem) => {
          if (a.order !== b.order) return a.order - b.order;
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
        setItems(sortedData);
      } else {
        console.error('Error fetching items:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валідація - хоча б одне поле має бути заповнене
    const hasTitle = formData.title && formData.title.trim() !== '';
    const hasContent = formData.content && formData.content.trim() !== '';
    const hasPhotos = formData.photoUrls && formData.photoUrls.length > 0;
    const hasText = formData.text && formData.text.trim() !== '';
    const hasLink = formData.link && formData.link.trim() !== '';
    const hasTitleEn = formData.titleEn && formData.titleEn.trim() !== '';
    const hasContentEn = formData.contentEn && formData.contentEn.trim() !== '';
    const hasTextEn = formData.textEn && formData.textEn.trim() !== '';
    const hasLinkTextEn = formData.linkTextEn && formData.linkTextEn.trim() !== '';
    
    if (!hasTitle && !hasContent && !hasPhotos && !hasText && !hasLink && !hasTitleEn && !hasContentEn && !hasTextEn && !hasLinkTextEn) {
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
          title: formData.title?.trim() || null,
          content: formData.content?.trim() || null,
          photoUrls: formData.photoUrls,
          text: formData.text?.trim() || null,
          link: formData.link?.trim() || null,
          linkText: formData.linkText?.trim() || null,
          titleEn: formData.titleEn?.trim() || null,
          contentEn: formData.contentEn?.trim() || null,
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

  const handleEdit = (item: QualificationImprovementItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      content: item.content || '',
      photoUrls: item.photoUrls || [],
      text: item.text || '',
      link: item.link || '',
      linkText: item.linkText || '',
      titleEn: item.titleEn || '',
      contentEn: item.contentEn || '',
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
    setFormData({ title: '', content: '', photoUrls: [], text: '', link: '', linkText: '', titleEn: '', contentEn: '', textEn: '', linkTextEn: '' });
    setIsAdding(false);
    setEditingId(null);
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
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Введіть заголовок"
                />
              </div>

              <div>
                <Label htmlFor="titleEn">Заголовок англійською</Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="Enter title in English"
                />
              </div>
               
              <div>
                <Label htmlFor="content">Текст</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Введіть текст"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="contentEn">Текст англійською</Label>
                <Textarea
                  id="contentEn"
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  placeholder="Enter text in English"
                  rows={4}
                />
              </div>

              <div>
                <Label>Фото</Label>
                <ImageUploader
                  onUploadComplete={(url) => {
                    setFormData(prev => ({
                      ...prev,
                      photoUrls: [...prev.photoUrls, url]
                    }));
                  }}
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
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                photoUrls: prev.photoUrls.filter((_, i) => i !== index)
                              }));
                            }}
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
                  <Label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Посилання (URL)</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
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

      {/* Список записів */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpanded(item.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  {item.title && (
                    <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                  )}
                   
                  {item.content && (
                    <div className="text-gray-600 mb-2">
                      {item.content.length > 80 
                        ? item.content.substring(0, 80) + '...' 
                        : item.content
                      }
                    </div>
                  )}

                  {item.photoUrls && item.photoUrls.length > 0 && (
                    <div className="text-green-600 text-sm mb-2">
                      📷 {item.photoUrls.length} фото
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
                   
                  {item.link && (
                    <div className="text-blue-600 text-sm mb-2">
                      Посилання: {item.linkText || item.link}
                    </div>
                  )}
                   
                  {!item.title && !item.content && !item.photoUrls?.length && !item.text && !item.link && (
                    <CardTitle className="text-lg text-gray-500">Порожній запис</CardTitle>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {expandedItems.has(item.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            {expandedItems.has(item.id) && (
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {item.title && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Заголовок:</Label>
                      <p className="text-gray-900 text-lg font-medium">{item.title}</p>
                    </div>
                  )}

                  {item.titleEn && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Заголовок (англійська):</Label>
                      <p className="text-gray-900 text-lg font-medium">{item.titleEn}</p>
                    </div>
                  )}
                   
                  {item.content && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Текст:</Label>
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{item.content}</p>
                    </div>
                  )}

                  {item.contentEn && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Текст (англійська):</Label>
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{item.contentEn}</p>
                    </div>
                  )}

                  {item.photoUrls && item.photoUrls.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Фото ({item.photoUrls.length}):</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                        {item.photoUrls.map((url, index) => (
                          <img 
                            key={index}
                            src={`http://localhost:3000${url}`} 
                            alt={`Photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                   
                  {item.text && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Додатковий текст:</Label>
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{item.text}</p>
                    </div>
                  )}

                  {item.textEn && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Додатковий текст (англійська):</Label>
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{item.textEn}</p>
                    </div>
                  )}
                   
                  {item.link && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Посилання:</Label>
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        {item.linkText || item.link}
                      </a>
                    </div>
                  )}

                  {item.linkTextEn && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Текст посилання (англійська):</Label>
                      <p className="text-gray-900">{item.linkTextEn}</p>
                    </div>
                  )}
                   
                  {!item.title && !item.content && !item.photoUrls?.length && !item.text && !item.link && (
                    <p className="text-gray-500 italic">Порожній запис</p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        
        {items.length === 0 && !isAdding && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Поки що немає доданих записів</p>
              <p className="text-sm text-gray-400 mt-2">
                Натисніть "Додати запис" щоб почати
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
