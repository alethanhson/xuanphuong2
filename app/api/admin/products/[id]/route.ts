import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function GET({ params }: { params: { id: any } }) {
  try {
    const supabase = await createServerSupabaseClient();
    const { id } = await params;

    // Fetch the product with all related data
    const { data: product, error } = await supabase
      .from('products')
      .select(
        `
        *,
        categories:category_id(id, name, slug),
        images:product_images(*),
        features:product_features(*),
        specifications:product_specifications(*)
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Format the product for the frontend
    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.short_description,
      categoryId: product.category_id,
      category: product.categories,
      price: product.price,
      isFeatured: product.is_featured,
      status: product.status,
      model: product.model,
      workingDimensions: product.working_dimensions,
      spindlePower: product.spindle_power,
      spindleSpeed: product.spindle_speed,
      movementSpeed: product.movement_speed,
      accuracy: product.accuracy,
      controlSystem: product.control_system,
      compatibleSoftware: product.compatible_software,
      fileFormats: product.file_formats,
      powerConsumption: product.power_consumption,
      machineDimensions: product.machine_dimensions,
      weight: product.weight,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      images: product.images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: img.alt,
        isPrimary: img.is_primary,
      })),
      features: product.features.map((feature) => ({
        id: feature.id,
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
      })),
      specifications: product.specifications.map((spec) => ({
        id: spec.id,
        name: spec.name,
        value: spec.value,
        group: spec.group,
      })),
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const supabase = await createServerSupabaseClient();

    // Check if user is authenticated and has admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user metadata to check role
    const { data: userData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse the request body
    const productData = await request.json();

    // Extract images, features, and specifications to handle separately
    const { images, features, specifications, ...productDetails } = productData;

    // Update timestamp
    productDetails.updated_at = new Date().toISOString();

    // Update the product
    const { data: product, error } = await supabase
      .from('products')
      .update(productDetails)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Handle images if they exist
    if (images && images.length > 0) {
      // First, delete existing images
      await supabase.from('product_images').delete().eq('product_id', id);

      // Then insert new images
      const imageInserts = images.map((image, index) => ({
        product_id: id,
        url: image.url,
        alt: image.alt || product.name,
        is_primary: image.isPrimary || index === 0, // First image is primary by default
      }));

      await supabase.from('product_images').insert(imageInserts);
    }

    // Handle features if they exist
    if (features && features.length > 0) {
      // First, delete existing features
      await supabase.from('product_features').delete().eq('product_id', id);

      // Then insert new features
      const featureInserts = features.map((feature) => ({
        product_id: id,
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
      }));

      await supabase.from('product_features').insert(featureInserts);
    }

    // Handle specifications if they exist
    if (specifications && specifications.length > 0) {
      // First, delete existing specifications
      await supabase
        .from('product_specifications')
        .delete()
        .eq('product_id', id);

      // Then insert new specifications
      const specInserts = specifications.map((spec) => ({
        product_id: id,
        name: spec.name,
        value: spec.value,
        group: spec.group,
      }));

      await supabase.from('product_specifications').insert(specInserts);
    }

    // Revalidate the products pages to update the cache
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}`);
    revalidatePath('/products');
    revalidatePath(`/products/${product.slug}`);

    return NextResponse.json({
      success: true,
      product: product,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const supabase = await createServerSupabaseClient();

    // Check if user is authenticated and has admin role
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user metadata to check role
    const { data: userData } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get the product slug before deleting for revalidation
    const { data: product } = await supabase
      .from('products')
      .select('slug')
      .eq('id', id)
      .single();

    // Delete related data first (foreign key constraints)
    await supabase.from('product_images').delete().eq('product_id', id);
    await supabase.from('product_features').delete().eq('product_id', id);
    await supabase.from('product_specifications').delete().eq('product_id', id);

    // Delete the product
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Revalidate the products pages to update the cache
    revalidatePath('/admin/products');
    revalidatePath('/products');
    if (product?.slug) {
      revalidatePath(`/products/${product.slug}`);
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
