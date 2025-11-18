"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EvaluationCriteriaData {
  id: number;
  name: string;
  nameEn?: string;
  url?: string;
  color: string;
  hasSubItems: boolean;
  subItems: Array<{ name: string; link: string }>;
  order: number;
}

interface EvaluationCriteriaManagerProps {
  apiEndpoint: string;
  title: string;
}

export default function EvaluationCriteriaManager({ apiEndpoint, title }: EvaluationCriteriaManagerProps) {
  console.log('🎯 EvaluationCriteriaManager: компонент рендериться, apiEndpoint:', apiEndpoint, 'title:', title);
  
  const [criteria, setCriteria] = useState<EvaluationCriteriaData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<EvaluationCriteriaData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    url: "",
    color: "#FF6B6B",
    hasSubItems: false,
    subItems: [] as Array<{ name: string; link: string }>,
    order: 0
  });
  
  console.log('🔄 EvaluationCriteriaManager: formData ініціалізовано:', formData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('🔄 EvaluationCriteriaManager: useEffect викликано, apiEndpoint:', apiEndpoint);
    console.log('🔄 Початковий formData:', formData);
    fetchCriteria();
  }, [apiEndpoint]);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📡 Завантаження критеріїв з:', apiEndpoint);
      
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
        setCriteria([]);
        return;
      }
      
      console.log('📋 Отримані дані:', data);
      
      if (Array.isArray(data)) {
        setCriteria(data);
      } else {
        console.error('❌ API повернув не масив:', data);
        setError('API повернув некоректні дані');
        setCriteria([]);
      }
    } catch (error) {
      console.error('❌ Помилка завантаження критеріїв:', error);
      setError(error instanceof Error ? error.message : 'Невідома помилка');
      setCriteria([]);
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
      console.log('🔍 editingCriteria:', editingCriteria);
      console.log('🔍 editingCriteria?.id:', editingCriteria?.id);
      
      const isCreatingNew = !editingCriteria || !editingCriteria.id;
      const url = isCreatingNew 
        ? apiEndpoint 
        : `${apiEndpoint}/${editingCriteria.id}`;
      
      const method = isCreatingNew ? 'POST' : 'PUT';
      
      console.log('📡 Відправка запиту на:', url, 'методом:', method);
      console.log('📡 Повний URL:', url);
      console.log('📡 Метод:', method);
      console.log('📡 Логіка: isEditing =', isEditing, ', editingCriteria?.id =', editingCriteria?.id);
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
        await fetchCriteria();
        resetForm();
      } else {
        console.error('❌ Помилка від сервера:', data);
        console.error('❌ Статус відповіді:', response.status);
        console.error('❌ Повна відповідь:', responseText);
        const errorMessage = data.error || data.details || 'Невідома помилка сервера';
        setError(`${errorMessage} (статус: ${response.status})`);
      }
    } catch (error) {
      console.error('❌ Помилка при збереженні критерію:', error);
      setError(error instanceof Error ? error.message : 'Невідома помилка мережі');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (criteriaItem: EvaluationCriteriaData) => {
    console.log('🔧 Редагування критерію:', criteriaItem);
    
    setEditingCriteria(criteriaItem);
    setFormData({
      name: criteriaItem.name,
      nameEn: criteriaItem.nameEn || "",
      url: criteriaItem.url || "",
      color: criteriaItem.color,
      hasSubItems: criteriaItem.hasSubItems,
      subItems: Array.isArray(criteriaItem.subItems) ? criteriaItem.subItems : [],
      order: criteriaItem.order
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цей критерій?')) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${apiEndpoint}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCriteria();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Помилка при видаленні');
      }
    } catch (error) {
      console.error('❌ Помилка при видаленні критерію:', error);
      setError(error instanceof Error ? error.message : 'Невідома помилка мережі');
    } finally {
      setLoading(false);
    }
  };

  const addSubItem = () => {
    setFormData(prev => ({
      ...prev,
      subItems: [...prev.subItems, { name: '', link: '' }]
    }));
  };

  const removeSubItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subItems: prev.subItems.filter((_, i) => i !== index)
    }));
  };

  const updateSubItem = (index: number, field: 'name' | 'link', value: string) => {
    setFormData(prev => ({
      ...prev,
      subItems: prev.subItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const resetForm = () => {
    console.log('🔄 Скидання форми');
    const defaultFormData = {
      name: "",
      nameEn: "",
      url: "",
      color: "#FF6B6B",
      hasSubItems: false,
      subItems: [],
      order: 0
    };
    console.log('🔄 Встановлюємо значення за замовчуванням:', defaultFormData);
    setFormData(defaultFormData);
    setIsEditing(false);
    setEditingCriteria(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        <Button 
          onClick={() => {
            console.log('🔘 Кнопка "Додати новий критерій" натиснута');
            setIsEditing(true);
            setEditingCriteria(null);
            setFormData({
              name: "",
              nameEn: "",
              url: "",
              color: "#FF6B6B",
              hasSubItems: false,
              subItems: [],
              order: 0
            });
          }}
          className="bg-blue-500 hover:bg-blue-600"
          disabled={loading}
        >
          Додати новий критерій
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
              {editingCriteria ? 'Редагувати критерій' : 'Додати новий критерій'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Назва предмету *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Введіть назву предмету"
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="nameEn">Назва предмету англійською</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="Введіть назву предмету англійською"
                  disabled={loading}
                />
              </div>
              
              <div>
                <Label htmlFor="url">Посилання на критерії оцінювання</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="color">Колір</Label>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="hasSubItems"
                  type="checkbox"
                  checked={formData.hasSubItems}
                  onChange={(e) => setFormData({ ...formData, hasSubItems: e.target.checked })}
                  disabled={loading}
                />
                <Label htmlFor="hasSubItems">Має підпункти (класи)</Label>
              </div>

              {formData.hasSubItems && (
                <div className="space-y-3">
                  <Label>Підпункти (класи)</Label>
                  {formData.subItems.map((item, index) => (
                    <div key={index} className="flex space-x-2">
                      <Input
                        placeholder="Назва класу (наприклад: 7 клас)"
                        value={item.name}
                        onChange={(e) => updateSubItem(index, 'name', e.target.value)}
                        disabled={loading}
                      />
                      <Input
                        placeholder="Посилання"
                        value={item.link}
                        onChange={(e) => updateSubItem(index, 'link', e.target.value)}
                        disabled={loading}
                      />
                      <Button
                        type="button"
                        onClick={() => removeSubItem(index)}
                        variant="destructive"
                        size="sm"
                        disabled={loading}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={addSubItem}
                    variant="outline"
                    size="sm"
                    disabled={loading}
                  >
                    + Додати клас
                  </Button>
                </div>
              )}


              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-600"
                  disabled={loading}
                >
                  {loading ? 'Збереження...' : (editingCriteria ? 'Оновити' : 'Додати')}
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
        {criteria.map((criteriaItem) => (
          <Card key={criteriaItem.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: criteriaItem.color }}
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{criteriaItem.name}</h3>
                      {criteriaItem.nameEn && (
                        <p className="text-sm text-blue-600">{criteriaItem.nameEn}</p>
                      )}
                    </div>
                  </div>
                  
                  {criteriaItem.url && (
                    <p className="text-sm text-gray-600 mb-2">
                      <a href={criteriaItem.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        Посилання ↗
                      </a>
                    </p>
                  )}
                  
                  {criteriaItem.hasSubItems && criteriaItem.subItems.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-500 mb-2">Класи:</p>
                      <div className="space-y-1">
                        {criteriaItem.subItems.map((item, index) => (
                          <div key={index} className="text-xs text-gray-600">
                            {item.name}: {item.link ? '✓' : '✗'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleEdit(criteriaItem)}
                    size="sm"
                    variant="outline"
                    disabled={loading}
                  >
                    Редагувати
                  </Button>
                  <Button
                    onClick={() => handleDelete(criteriaItem.id)}
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

      {criteria.length === 0 && !isEditing && !loading && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Поки що немає доданих критеріїв</p>
            <p className="text-sm text-gray-400 mt-2">
              Натисніть "Додати новий критерій" щоб почати
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
