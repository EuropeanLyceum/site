"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploader from "@/components/shared/ImageUploader";

interface StaffData {
  id: number;
  fullName: string;
  description: string;
  fullNameEn?: string; // English full name
  descriptionEn?: string; // English description
  photoUrl?: string | null;
  categoryId: number;
  category: {
    id: number;
    name: string;
    nameEn?: string;
    order: number;
  };
  order: number;
}

interface StaffCategory {
  id: number;
  name: string;
  nameEn?: string;
  order: number;
}

interface StaffManagerProps {
  apiEndpoint: string;
  title: string;
}

export default function StaffManager({ apiEndpoint, title }: StaffManagerProps) {
  const [staff, setStaff] = useState<StaffData[]>([]);
  const [categories, setCategories] = useState<StaffCategory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryNameEn, setNewCategoryNameEn] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    description: "",
    fullNameEn: "",
    descriptionEn: "",
    photoUrl: "",
    category: "1", // Встановлюємо значення за замовчуванням
    order: 0
  });

  useEffect(() => {
    fetchStaff();
    fetchCategories();
  }, [apiEndpoint]);

  // Синхронізуємо formData.order з editingStaff
  useEffect(() => {
    if (editingStaff) {
      setFormData(prev => ({
        ...prev,
        order: editingStaff.order
      }));
    }
  }, [editingStaff]);

  // Автоматично оновлюємо порядок при зміні категорії
  useEffect(() => {
    if (formData.category && formData.category !== "1" && !editingStaff) {
      const maxOrderInCategory = staff
        .filter(s => s.categoryId.toString() === formData.category)
        .reduce((max, s) => Math.max(max, s.order), 0);
      
      setFormData(prev => ({
        ...prev,
        order: maxOrderInCategory + 1
      }));
    }
  }, [formData.category, staff, editingStaff]);



  const fetchStaff = async () => {
    try {
      console.log('🔍 fetchStaff - початок виконання');
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      console.log('📊 Отримано співробітників:', data.length);
      console.log('📋 Співробітники:', data);
      // Сортуємо за полем order (менші значення першими)
      const sortedData = data.sort((a: StaffData, b: StaffData) => a.order - b.order);
      setStaff(sortedData);
    } catch (error) {
      console.error('❌ Error fetching staff:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('🔍 fetchCategories - початок виконання');
      const response = await fetch('/api/staff-categories');
      const data = await response.json();
      console.log('📊 Отримано категорій:', data.length);
      console.log('📋 Категорії:', data);
      setCategories(data);
      
      // Встановлюємо першу категорію як значення за замовчуванням, якщо категорії ще не встановлена
      if (data.length > 0 && formData.category === "1") {
        console.log('🔄 Встановлюємо першу категорію:', data[0].id.toString());
        setFormData(prev => ({ ...prev, category: data[0].id.toString() }));
      }
    } catch (error) {
      console.error('❌ Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      const response = await fetch('/api/staff-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: newCategoryName.trim(),
          nameEn: newCategoryNameEn.trim() || null
        }),
      });

      if (response.ok) {
        setNewCategoryName("");
        setNewCategoryNameEn("");
        setShowCategoryForm(false);
        fetchCategories();
      } else {
        const errorData = await response.json();
        alert(`Помилка: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Помилка додавання категорії');
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Ви впевнені, що хочете видалити цю категорію?')) return;
    
    console.log('🗑️ Спроба видалення категорії з ID:', categoryId);
    
    try {
      const response = await fetch(`/api/staff-categories/${categoryId}`, {
        method: 'DELETE',
      });

      console.log('📥 Response status:', response.status);

      if (response.ok) {
        console.log('✅ Категорія успішно видалена');
        fetchCategories();
      } else {
        const errorData = await response.json();
        console.error('❌ Error response:', errorData);
        alert(`Помилка: ${errorData.error}`);
      }
    } catch (error) {
      console.error('❌ Error deleting category:', error);
      alert('Помилка видалення категорії');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 handleSubmit - початок виконання');
    console.log('📋 formData:', formData);
    console.log('📋 editingStaff:', editingStaff);
    
    try {
      const isCreatingNew = !editingStaff || !editingStaff.id;
      
      // Якщо категорія змінилася, автоматично встановлюємо наступний порядок
      let finalOrder = formData.order;
      if (editingStaff && editingStaff.categoryId.toString() !== formData.category) {
        const maxOrderInCategory = staff
          .filter(s => s.categoryId.toString() === formData.category)
          .reduce((max, s) => Math.max(max, s.order), 0);
        finalOrder = maxOrderInCategory + 1;
      }
      
      const url = isCreatingNew 
        ? apiEndpoint 
        : `${apiEndpoint}/${editingStaff.id}`;
      
      const method = isCreatingNew ? 'POST' : 'PUT';
      
      const requestData = {
        fullName: formData.fullName,
        description: formData.description,
        fullNameEn: formData.fullNameEn,
        descriptionEn: formData.descriptionEn,
        photoUrl: formData.photoUrl,
        categoryId: formData.category, // Відправляємо categoryId замість category
        order: finalOrder
      };
      
      console.log('📤 Відправляємо дані:', requestData);
      console.log('🌐 URL:', url);
      console.log('📝 Method:', method);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('📥 Response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Успішна відповідь:', responseData);
        fetchStaff();
        resetForm();
      } else {
        const errorData = await response.json();
        console.error('❌ Error response:', errorData);
        alert(`Помилка збереження: ${errorData.error || 'Невідома помилка'}`);
      }
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Помилка збереження співробітника');
    }
  };

  const handleEdit = (staffMember: StaffData) => {
    setIsEditing(true);
    setEditingStaff(staffMember);
    
    // Якщо категорія змінилася, автоматично встановлюємо наступний порядок
    let newOrder = staffMember.order;
    if (editingStaff && editingStaff.categoryId !== staffMember.categoryId) {
      const maxOrderInCategory = staff
        .filter(s => s.categoryId === staffMember.categoryId)
        .reduce((max, s) => Math.max(max, s.order), 0);
      newOrder = maxOrderInCategory + 1;
    }
    
    setFormData({
      fullName: staffMember.fullName,
      description: staffMember.description,
      fullNameEn: staffMember.fullNameEn || "",
      descriptionEn: staffMember.descriptionEn || "",
      photoUrl: staffMember.photoUrl || "",
      category: staffMember.categoryId.toString(),
      order: newOrder
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цього співробітника?')) {
      try {
        const response = await fetch(`${apiEndpoint}/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchStaff();
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingStaff(null);
    // Знаходимо максимальний order в поточній категорії і додаємо 1
    const currentCategory = categories.length > 0 ? categories[0].id.toString() : "1";
    const maxOrderInCategory = staff
      .filter(s => s.categoryId.toString() === currentCategory)
      .reduce((max, s) => Math.max(max, s.order), 0);
    setFormData({
      fullName: "",
      description: "",
      fullNameEn: "",
      descriptionEn: "",
      photoUrl: "",
      category: currentCategory,
      order: maxOrderInCategory + 1
    });
  };

  const handleImageUpload = (url: string) => {
    if (url && typeof url === 'string') {
      setFormData(prev => ({ ...prev, photoUrl: url }));
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    // При зміні категорії автоматично встановлюємо наступний порядок
    const maxOrderInCategory = staff
      .filter(s => s.categoryId.toString() === categoryId)
      .reduce((max, s) => Math.max(max, s.order), 0);
    
    setFormData(prev => ({ 
      ...prev, 
      category: categoryId,
      order: maxOrderInCategory + 1
    }));
  };

  const filteredStaff = selectedCategory === "all" 
    ? staff.sort((a, b) => a.order - b.order) // Глобальне сортування для "Всі категорії"
    : staff
        .filter(member => member.categoryId.toString() === selectedCategory)
        .sort((a, b) => a.order - b.order); // Сортування в межах категорії

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Всього співробітників: {staff.length} | 
            Сортування: за порядком в межах кожної категорії
          </p>
        </div>
        <Button 
          onClick={() => {
            setIsEditing(true);
            setEditingStaff(null);
            // Знаходимо максимальний order в поточній категорії і додаємо 1
            const currentCategory = categories.length > 0 ? categories[0].id.toString() : "1";
            const maxOrderInCategory = staff
              .filter(s => s.categoryId.toString() === currentCategory)
              .reduce((max, s) => Math.max(max, s.order), 0);
            setFormData({
              fullName: "",
              description: "",
              fullNameEn: "",
              descriptionEn: "",
              photoUrl: "",
              category: currentCategory,
              order: maxOrderInCategory + 1
            });
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Додати нового співробітника
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Виберіть категорію" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
            <SelectItem value="all">Всі категорії</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          onClick={() => setShowCategoryForm(!showCategoryForm)}
          variant="outline"
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          {showCategoryForm ? 'Скасувати' : 'Додати категорію'}
        </Button>
      </div>

      {showCategoryForm && (
        <Card className="bg-gray-50">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="newCategory">Назва нової категорії</Label>
                  <Input
                    id="newCategory"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Введіть назву категорії"
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="newCategoryEn">Назва категорії англійською</Label>
                  <Input
                    id="newCategoryEn"
                    value={newCategoryNameEn}
                    onChange={(e) => setNewCategoryNameEn(e.target.value)}
                    placeholder="Введіть назву категорії англійською"
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleAddCategory}
                  disabled={!newCategoryName.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Додати
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <div key={category.id} className="flex items-center gap-2 bg-blue-100 px-3 py-2 rounded-lg">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{category.name}</span>
              {category.nameEn && (
                <span className="text-xs text-blue-600">{category.nameEn}</span>
              )}
            </div>
            <Button
              onClick={() => handleDeleteCategory(category.id)}
              size="sm"
              variant="outline"
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              ×
            </Button>
          </div>
        ))}
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingStaff ? 'Редагувати співробітника' : 'Додати нового співробітника'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fullName">Повне ім'я</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="fullNameEn">Повне ім'я англійською</Label>
                <Input
                  id="fullNameEn"
                  value={formData.fullNameEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullNameEn: e.target.value }))}
                  placeholder="Введіть ім'я англійською"
                />
              </div>
              


              <div>
                <Label htmlFor="category">Категорія</Label>
                {categories.length > 0 ? (
                  <Select value={formData.category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-500">Спочатку додайте категорію</p>
                )}
              </div>

              <div>
                <Label htmlFor="order">Номер порядку</Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  placeholder="Введіть номер порядку"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Менші номери відображаються першими у списку в межах категорії
                </p>
              </div>
              
              <div>
                <Label htmlFor="description">Опис</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="descriptionEn">Опис англійською</Label>
                <Textarea
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                  rows={4}
                  placeholder="Введіть опис англійською"
                />
              </div>

              <div>
                <Label>Фото (опціонально)</Label>
                <ImageUploader 
                  onUploadComplete={handleImageUpload} 
                  currentImage={formData.photoUrl ? formData.photoUrl : undefined} 
                />
                {formData.photoUrl && formData.photoUrl !== "" && (
                  <div className="mt-2">
                    <img 
                      src={formData.photoUrl} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-green-500 hover:bg-green-600">
                  {editingStaff ? 'Оновити' : 'Додати'}
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
        {filteredStaff.map((staffMember) => (
          <Card key={staffMember.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  {staffMember.photoUrl && staffMember.photoUrl !== "" && (
                    <img 
                      src={staffMember.photoUrl} 
                      alt={staffMember.fullName} 
                      className="w-full h-48 object-cover rounded mb-4"
                    />
                  )}
                  <h3 className="text-lg font-semibold mb-2">{staffMember.fullName}</h3>
                  {staffMember.fullNameEn && (
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">{staffMember.fullNameEn}</h3>
                  )}
                  <div className="mb-2">
                    <p className="text-sm text-gray-500">{staffMember.category.name}</p>
                    {staffMember.category.nameEn && (
                      <p className="text-sm text-blue-600">{staffMember.category.nameEn}</p>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{staffMember.description}</p>
                  {staffMember.descriptionEn && (
                    <p className="text-sm text-blue-600 mb-4">{staffMember.descriptionEn}</p>
                  )}
                  <p className="text-xs text-blue-600 font-medium">
                    Порядок у категорії: {staffMember.order}
                  </p>
                </div>
                
                <div className="flex gap-2 mt-auto">
                  <Button
                    onClick={() => handleEdit(staffMember)}
                    size="sm"
                    variant="outline"
                  >
                    Редагувати
                  </Button>
                  <Button
                    onClick={() => handleDelete(staffMember.id)}
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

      {filteredStaff.length === 0 && !isEditing && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Поки що немає доданих співробітників</p>
            <p className="text-sm text-gray-400 mt-2">
              Натисніть "Додати нового співробітника" щоб почати
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

