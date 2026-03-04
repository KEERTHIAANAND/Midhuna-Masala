import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { supabase } from '../config/supabase';

/**
 * GET /api/products
 * Public — list all products with optional filters
 * Query params: ?category=POWDER&featured=true&search=turmeric
 */
export async function listProducts(req: Request, res: Response): Promise<void> {
    try {
        const { category, featured, search, in_stock } = req.query;

        let query = supabase
            .from('products')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });

        // Filters
        if (category && category !== 'all') {
            query = query.eq('category', (category as string).toUpperCase());
        }
        if (featured === 'true') {
            query = query.eq('is_featured', true);
        }
        if (in_stock === 'true') {
            query = query.eq('in_stock', true);
        }
        if (search) {
            query = query.ilike('name', `%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error('List products error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch products.' });
            return;
        }

        // Map to frontend-friendly format
        const products = (data || []).map(p => ({
            id: p.slug,
            dbId: p.id,
            name: p.name,
            slug: p.slug,
            category: p.category,
            image: p.image_url,
            price: parseFloat(p.price),
            weight: p.weight,
            type: p.type,
            description: p.description,
            rating: p.rating ? parseFloat(p.rating) : null,
            inStock: p.in_stock,
            isFeatured: p.is_featured,
        }));

        res.json({ success: true, products, count: products.length });
    } catch (error) {
        console.error('List products error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * GET /api/products/:slug
 * Public — get a single product by slug
 */
export async function getProduct(req: Request, res: Response): Promise<void> {
    try {
        const { slug } = req.params;

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) {
            res.status(404).json({ success: false, error: 'Product not found.' });
            return;
        }

        res.json({
            success: true,
            product: {
                id: data.slug,
                dbId: data.id,
                name: data.name,
                slug: data.slug,
                category: data.category,
                image: data.image_url,
                price: parseFloat(data.price),
                weight: data.weight,
                type: data.type,
                description: data.description,
                rating: data.rating ? parseFloat(data.rating) : null,
                inStock: data.in_stock,
                isFeatured: data.is_featured,
            },
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * POST /api/products
 * Admin only — create a new product
 */
export async function createProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { name, category, price, weight, type, description, image_url, in_stock, is_featured, sort_order } = req.body;

        if (!name || !category || !price) {
            res.status(400).json({ success: false, error: 'Name, category, and price are required.' });
            return;
        }

        // Generate slug from name
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        // Check for duplicate slug
        const { data: existing } = await supabase
            .from('products')
            .select('id')
            .eq('slug', slug)
            .single();

        if (existing) {
            res.status(409).json({ success: false, error: 'A product with a similar name already exists.' });
            return;
        }

        const { data, error } = await supabase
            .from('products')
            .insert({
                name,
                slug,
                category: category.toUpperCase(),
                price,
                weight: weight || null,
                type: type || null,
                description: description || null,
                image_url: image_url || null,
                in_stock: in_stock !== false,
                is_featured: is_featured || false,
                sort_order: sort_order || 0,
            })
            .select()
            .single();

        if (error) {
            console.error('Create product error:', error);
            res.status(500).json({ success: false, error: 'Failed to create product.' });
            return;
        }

        res.status(201).json({
            success: true,
            product: {
                id: data.slug,
                dbId: data.id,
                name: data.name,
                slug: data.slug,
                category: data.category,
                image: data.image_url,
                price: parseFloat(data.price),
                weight: data.weight,
                type: data.type,
                description: data.description,
                rating: data.rating ? parseFloat(data.rating) : null,
                inStock: data.in_stock,
                isFeatured: data.is_featured,
            },
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * PUT /api/products/:id
 * Admin only — update a product by UUID
 */
export async function updateProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const { name, category, price, weight, type, description, image_url, in_stock, is_featured, sort_order } = req.body;

        const updateData: Record<string, any> = {};
        if (name !== undefined) {
            updateData.name = name;
            // Also update slug if name changes
            updateData.slug = name
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
        }
        if (category !== undefined) updateData.category = category.toUpperCase();
        if (price !== undefined) updateData.price = price;
        if (weight !== undefined) updateData.weight = weight;
        if (type !== undefined) updateData.type = type;
        if (description !== undefined) updateData.description = description;
        if (image_url !== undefined) updateData.image_url = image_url;
        if (in_stock !== undefined) updateData.in_stock = in_stock;
        if (is_featured !== undefined) updateData.is_featured = is_featured;
        if (sort_order !== undefined) updateData.sort_order = sort_order;

        const { data, error } = await supabase
            .from('products')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            res.status(404).json({ success: false, error: 'Product not found.' });
            return;
        }

        res.json({
            success: true,
            product: {
                id: data.slug,
                dbId: data.id,
                name: data.name,
                slug: data.slug,
                category: data.category,
                image: data.image_url,
                price: parseFloat(data.price),
                weight: data.weight,
                type: data.type,
                description: data.description,
                inStock: data.in_stock,
                isFeatured: data.is_featured,
            },
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * DELETE /api/products/:id
 * Admin only — delete a product by UUID
 */
export async function deleteProduct(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete product error:', error);
            res.status(500).json({ success: false, error: 'Failed to delete product.' });
            return;
        }

        res.json({ success: true, message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}
