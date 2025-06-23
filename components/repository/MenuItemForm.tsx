
import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem } from '../../types';
import { DEFAULT_CATEGORIES } from '../../constants';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Select } from '../common/Select';
import { suggestDishName, generateDishDescription } from '../../services/geminiService';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface MenuItemFormProps {
  initialData?: MenuItem | null;
  onSubmit: (data: Omit<MenuItem, 'id' | 'imageUrl'>) => void;
  onCancel: () => void;
}

export const MenuItemForm: React.FC<MenuItemFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  
  const [aiNamePrompt, setAiNamePrompt] = useState('');
  const [aiKeyIngredients, setAiKeyIngredients] = useState('');
  const [aiDishType, setAiDishType] = useState(DEFAULT_CATEGORIES[0]);

  const [isSuggestingName, setIsSuggestingName] = useState(false);
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPrice(initialData.price);
      setCategory(initialData.category);
      setDescription(initialData.description);
      setIsAvailable(initialData.isAvailable);
      // Pre-fill AI fields if sensible, e.g. from description or name
      setAiKeyIngredients(initialData.description.substring(0,50)); // Or parse from name/desc
      setAiDishType(initialData.category);
    } else {
      // Reset form for new item
      setName('');
      setPrice('');
      setCategory(DEFAULT_CATEGORIES[0]);
      setDescription('');
      setIsAvailable(true);
      setAiNamePrompt('');
      setAiKeyIngredients('');
      setAiDishType(DEFAULT_CATEGORIES[0]);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (price === '') return; // Basic validation
    onSubmit({ name, price, category, description, isAvailable });
  };

  const handleSuggestName = useCallback(async () => {
    if (!aiNamePrompt) {
      alert("Please provide some characteristics or ingredients for AI name suggestion.");
      return;
    }
    setIsSuggestingName(true);
    try {
      const suggested = await suggestDishName(aiNamePrompt, aiDishType);
      setName(suggested); // Update the main name field
    } catch (error) {
      console.error("Failed to suggest name:", error);
      alert("Could not suggest a name. Please try again.");
    } finally {
      setIsSuggestingName(false);
    }
  }, [aiNamePrompt, aiDishType]);

  const handleGenerateDescription = useCallback(async () => {
    if (!name) {
        alert("Please enter a dish name first or use AI to suggest one.");
        return;
    }
    if (!aiKeyIngredients) {
      alert("Please provide key ingredients for AI description generation.");
      return;
    }
    setIsGeneratingDesc(true);
    try {
      const generatedDesc = await generateDishDescription(name, aiDishType, aiKeyIngredients);
      setDescription(generatedDesc);
    } catch (error) {
      console.error("Failed to generate description:", error);
      alert("Could not generate a description. Please try again.");
    } finally {
      setIsGeneratingDesc(false);
    }
  }, [name, aiDishType, aiKeyIngredients]);

  const categoryOptions = DEFAULT_CATEGORIES.map(cat => ({ value: cat, label: cat }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Dish Name" id="name" value={name} onChange={e => setName(e.target.value)} required />
      <Input label="Price (₹)" id="price" type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value) || '')} min="0" step="0.01" required />
      <Select label="Category" id="category" value={category} onChange={e => {setCategory(e.target.value); setAiDishType(e.target.value);}} options={categoryOptions} required />
      <Textarea label="Description" id="description" value={description} onChange={e => setDescription(e.target.value)} />
      
      <div className="flex items-center">
        <input type="checkbox" id="isAvailable" checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} className="h-5 w-5 text-pink-600 border-slate-500 rounded focus:ring-pink-500 cursor-pointer" />
        <label htmlFor="isAvailable" className="ml-2 text-sm text-slate-300 cursor-pointer">Item is Available</label>
      </div>

      <div className="p-4 border border-slate-700 rounded-lg space-y-4 bg-slate-800/50">
        <h4 className="text-lg font-semibold text-pink-400">AI Assistance ✨</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Keywords for Name (e.g., spicy, chicken, creamy)" id="aiNamePrompt" value={aiNamePrompt} onChange={e => setAiNamePrompt(e.target.value)} />
            <Button type="button" onClick={handleSuggestName} isLoading={isSuggestingName} variant="secondary" className="self-end h-[46px]">
              Suggest Name
            </Button>
        </div>
         <Select label="Dish Type (for AI context)" id="aiDishType" value={aiDishType} onChange={e => setAiDishType(e.target.value)} options={categoryOptions} />
        <Input label="Key Ingredients for Description (e.g., basmati rice, cashews, saffron)" id="aiKeyIngredients" value={aiKeyIngredients} onChange={e => setAiKeyIngredients(e.target.value)} />
        <Button type="button" onClick={handleGenerateDescription} isLoading={isGeneratingDesc} variant="secondary" className="w-full md:w-auto">
          Generate Description
        </Button>
        {(isSuggestingName || isGeneratingDesc) && <LoadingSpinner size="sm" text="AI is thinking..." className="mt-2" />}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" onClick={onCancel} variant="secondary">Cancel</Button>
        <Button type="submit" variant="primary">{initialData ? 'Save Changes' : 'Add Item'}</Button>
      </div>
    </form>
  );
};
    