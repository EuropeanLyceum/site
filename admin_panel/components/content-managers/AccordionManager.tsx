'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Edit, Trash2, Plus } from 'lucide-react';

interface AccordionItem {
  id: number;
  title: string;
  content: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface AccordionManagerProps {
  apiEndpoint: string;
  title: string;
}

export default function AccordionManager({ apiEndpoint, title }: AccordionManagerProps) {
  const [items, setItems] = useState<AccordionItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchItems();
  }, [apiEndpoint]);

  const fetchItems = async () => {
    try {
      const response = await fetch(apiEndpoint);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валідація - принаймні одне поле має бути заповнене
    if (!formData.title && !formData.content) {
      alert('Принаймні одне поле має бути заповнене');
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
          title: formData.title || null,
          content: formData.content || null
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

  const handleEdit = (item: AccordionItem) => {
    setEditingId(item.id);
    setFormData({
      title: item.title || '',
      content: item.content || ''
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
    setFormData({ title: '', content: '' });
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
                <Label htmlFor="title">Заголовок (опціонально)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Введіть заголовок"
                />
              </div>
              
              <div>
                <Label htmlFor="content">Текст (опціонально)</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Введіть текст"
                  rows={4}
                />
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
                    <div className="text-gray-600">
                      {item.content.length > 100 
                        ? item.content.substring(0, 100) + '...' 
                        : item.content
                      }
                    </div>
                  )}
                  
                  {!item.title && !item.content && (
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
                  
                  {item.content && (
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Текст:</Label>
                      <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{item.content}</p>
                    </div>
                  )}
                  
                  {!item.title && !item.content && (
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
