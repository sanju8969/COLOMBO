import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface OptimisticState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

interface OptimisticActions<T> {
  create: (item: Omit<T, 'id' | 'created_at'>) => Promise<void>;
  update: (id: string, updates: Partial<T>) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export function useOptimisticUpdates<T extends { id: string; created_at?: string }>(
  initialData: T[] = [],
  actions: OptimisticActions<T>
) {
  const [state, setState] = useState<OptimisticState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const optimisticCreate = useCallback(async (newItem: Omit<T, 'id' | 'created_at'>) => {
    const optimisticItem = {
      ...newItem,
      id: `temp-${Date.now()}`,
      created_at: new Date().toISOString(),
    } as T;

    // Optimistic update
    setState(prev => ({
      ...prev,
      data: [optimisticItem, ...prev.data],
      loading: true,
    }));

    try {
      await actions.create(newItem);
      
      // Optimistically update the state with the new item
      setState(prev => ({
        ...prev,
        data: [optimisticItem, ...prev.data].sort((a, b) =>
          new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        ),
        loading: false,
        error: null,
      }));

      toast({
        title: "Success",
        description: "Item created successfully",
      });
    } catch (error) {
      // Revert optimistic update on error
      setState(prev => ({
        ...prev,
        data: prev.data.filter(item => item.id !== optimisticItem.id),
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));

      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
    }
  }, [actions]);

  const optimisticUpdate = useCallback(async (id: string, updates: Partial<T>) => {
    // Store original item for rollback
    const originalItem = state.data.find(item => item.id === id);
    if (!originalItem) return;

    // Optimistic update
    setState(prev => ({
      ...prev,
      data: prev.data.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ),
      loading: true,
    }));

    try {
      await actions.update(id, updates);
      
      // Optimistically update the state with the updated item
      setState(prev => ({
        ...prev,
        data: prev.data.map(item =>
          item.id === id ? { ...item, ...updates } : item
        ).sort((a, b) =>
          new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        ),
        loading: false,
        error: null,
      }));

      toast({
        title: "Success",
        description: "Item updated successfully",
      });
    } catch (error) {
      // Revert optimistic update on error
      setState(prev => ({
        ...prev,
        data: prev.data.map(item => 
          item.id === id ? originalItem : item
        ),
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));

      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  }, [state.data, actions]);

  const optimisticDelete = useCallback(async (id: string) => {
    // Store original item for rollback
    const originalItem = state.data.find(item => item.id === id);
    if (!originalItem) return;

    // Optimistic update
    setState(prev => ({
      ...prev,
      data: prev.data.filter(item => item.id !== id),
      loading: true,
    }));

    try {
      await actions.delete(`?id=${id}`);
      
      // Optimistically update the state by removing the item
      setState(prev => ({
        ...prev,
        data: prev.data.filter(item => item.id !== id),
        loading: false,
        error: null,
      }));

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
    } catch (error) {
      // Revert optimistic update on error
      setState(prev => ({
        ...prev,
        data: [...prev.data, originalItem].sort((a, b) => 
          new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        ),
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      }));

      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  }, [state.data, actions]);

  const setData = useCallback((data: T[]) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  return {
    ...state,
    setData,
    setLoading,
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
  };
}