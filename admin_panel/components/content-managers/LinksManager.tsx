"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface LinkData {
  id: number;
  title: string;
  content: string;
  url?: string;
}

interface LinksManagerProps {
  apiEndpoint: string;
  title: string;
}

export default function LinksManager({ apiEndpoint, title }: LinksManagerProps) {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkData | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    url: ""
  });

  useEffect(() => {
    fetchLinks();
  }, [apiEndpoint]);

  const fetchLinks = async () => {
    try {
      const response = await fetch(apiEndpoint);
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = isEditing 
        ? `${apiEndpoint}/${editingLink?.id}` 
        : apiEndpoint;
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchLinks();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving link:', error);
    }
  };

  const handleEdit = (link: LinkData) => {
    setIsEditing(true);
    setEditingLink(link);
    setFormData({
      title: link.title,
      content: link.content,
      url: link.url || ""
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цей запис?')) {
      try {
        const response = await fetch(`${apiEndpoint}/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchLinks();
        }
      } catch (error) {
        console.error('Error deleting link:', error);
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingLink(null);
    setFormData({
      title: "",
      content: "",
      url: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <Button 
          onClick={() => {
            setIsEditing(true);
            setEditingLink(null);
            setFormData({
              title: "",
              content: "",
              url: ""
            });
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Додати новий запис
        </Button>
      </div>

      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingLink ? 'Редагувати запис' : 'Додати новий запис'}
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
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="content">Текст</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="url">Посилання (опціонально)</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-green-500 hover:bg-green-600">
                  {editingLink ? 'Оновити' : 'Додати'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Скасувати
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {links.map((link) => (
          <Card key={link.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{link.title}</h3>
                  <div className="prose max-w-none mb-4">
                    <p className="text-gray-600 whitespace-pre-wrap">{link.content}</p>
                  </div>
                  {link.url && (
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Посилання: {link.url}
                    </a>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(link)}
                  >
                    Редагувати
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(link.id)}
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

