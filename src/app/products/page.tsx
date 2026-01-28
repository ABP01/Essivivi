"use client";

import RequireAuth from '@/components/auth/RequireAuth';
import { ProductForm } from '@/components/essivi/products/ProductForm';
import { DataTable } from '@/components/essivi/ui/DataTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import salesService from '@/services/sales.service';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  unit: string;
  quantity_per_unit: number;
  price: number;
  description?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await salesService.getProducts();
      setProducts(data);
    } catch (e) {
      console.error('Error loading products:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      await salesService.deleteProduct(productId);
      loadProducts(); // Reload the list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-gray-900 dark:text-white">{row.original.id}</span>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nom',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.image_url && (
            <Image
              src={row.original.image_url}
              alt={row.original.name}
              width={32}
              height={32}
              className="rounded object-cover"
            />
          )}
          <span className="font-medium text-gray-900 dark:text-white">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Catégorie',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: 'unit',
      header: 'Unité',
      cell: ({ row }) => (
        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
          {row.original.unit}
        </span>
      ),
    },
    {
      accessorKey: 'quantity_per_unit',
      header: 'Qté/Unité',
      cell: ({ row }) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {row.original.quantity_per_unit}
        </span>
      ),
    },
    {
      accessorKey: 'price',
      header: 'Prix (FCFA)',
      cell: ({ row }) => (
        <span className="font-semibold text-gray-900 dark:text-white">
          {row.original.price.toLocaleString()}
        </span>
      ),
    },
    {
      accessorKey: 'is_active',
      header: 'Statut',
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
          {row.original.is_active ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ProductForm
            product={row.original}
            onSave={loadProducts}
            trigger={
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            }
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer le produit &quot;{row.original.name}&quot; ?
                  Cette action ne peut pas être annulée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteProduct(row.original.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  return (
    <RequireAuth>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Produits</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez votre catalogue de produits
            </p>
          </div>
          <ProductForm onSave={loadProducts} />
        </div>

        <Card className="p-6">
          <DataTable
            columns={columns}
            data={products}
            loading={loading}
          />
        </Card>
      </div>
    </RequireAuth>
  );
}

export default ProductsPage;