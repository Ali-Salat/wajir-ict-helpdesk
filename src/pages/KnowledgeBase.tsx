
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Eye, Edit } from 'lucide-react';
import { RootState } from '../store/store';
import { setArticles, setSearchQuery, setSelectedCategory } from '../store/slices/knowledgeSlice';
import { useAuth } from '../hooks/useAuth';
import { KnowledgeArticle } from '../types';
import CreateArticleForm from '../components/knowledge/CreateArticleForm';

const KnowledgeBase = () => {
  const dispatch = useDispatch();
  const { hasRole } = useAuth();
  const { articles, searchQuery, selectedCategory } = useSelector((state: RootState) => state.knowledge);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    // Mock knowledge articles - replace with actual API call
    const mockArticles: KnowledgeArticle[] = [
      {
        id: '1',
        title: 'How to Reset Your Email Password',
        content: 'Step-by-step guide to reset your email password...',
        category: 'Email',
        tags: ['email', 'password', 'reset'],
        authorId: '2',
        authorName: 'John Technician',
        isPublished: true,
        viewCount: 45,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        title: 'Troubleshooting Printer Issues',
        content: 'Common printer problems and their solutions...',
        category: 'Hardware',
        tags: ['printer', 'hardware', 'troubleshooting'],
        authorId: '2',
        authorName: 'John Technician',
        isPublished: true,
        viewCount: 32,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '3',
        title: 'Network Connection Setup Guide',
        content: 'How to connect to the office network...',
        category: 'Network',
        tags: ['network', 'connection', 'wifi'],
        authorId: '2',
        authorName: 'John Technician',
        isPublished: true,
        viewCount: 28,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    dispatch(setArticles(mockArticles));
  }, [dispatch]);

  const filteredArticles = articles.filter(article => {
    if (!article.isPublished && !hasRole(['admin', 'technician'])) {
      return false;
    }

    if (searchQuery && !article.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !article.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false;
    }

    if (selectedCategory && article.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  const categories = [...new Set(articles.map(article => article.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600">Find solutions and helpful articles</p>
        </div>
        
        {hasRole(['admin', 'technician']) && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Article</DialogTitle>
              </DialogHeader>
              <CreateArticleForm onClose={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                onClick={() => dispatch(setSelectedCategory(''))}
              >
                All Categories
              </Button>
              {categories.map((category: string) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => dispatch(setSelectedCategory(category))}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{article.category}</p>
                </div>
                {hasRole(['admin', 'technician']) && (
                  <div className="flex space-x-1 ml-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {article.content.substring(0, 150)}...
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {article.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>By {article.authorName}</span>
                  <span>{article.viewCount} views</span>
                </div>
                
                <div className="text-xs text-gray-500">
                  Updated: {new Date(article.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredArticles.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No articles found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KnowledgeBase;
