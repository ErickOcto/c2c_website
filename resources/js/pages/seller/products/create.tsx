import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { WysiwygEditor } from '@/components/wysiwyg-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Card,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import InputError from '@/components/input-error';
import { Spinner } from '@/components/ui/spinner';
import type { Category } from '@/types';

type Props = {
    categories: Category[];
};

export default function CreateProduct({ categories }: Props) {
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [previews, setPreviews] = useState<string[]>([]);
    const [description, setDescription] = useState('');
    const formRef = useRef<HTMLFormElement>(null);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files;
        if (!files) return;

        const newPreviews: string[] = [];
        Array.from(files).forEach((file) => {
            newPreviews.push(URL.createObjectURL(file));
        });
        setPreviews(newPreviews);
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!formRef.current) return;

        setProcessing(true);
        setErrors({});

        const formData = new FormData(formRef.current);
        formData.set('description', description);

        router.post('/seller/products', formData, {
            forceFormData: true,
            onError: (errs) => {
                setErrors(errs as Record<string, string>);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Create Product" />

            <div className="flex flex-col gap-6 p-4 lg:p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">List New Product</h1>
                        <p className="text-sm text-muted-foreground">
                            Fill in the details to create a new listing
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/seller/products">← Back to Products</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                    </CardHeader>
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        className="space-y-6 px-6 pb-6"
                        encType="multipart/form-data"
                    >
                        {/* Images */}
                        <div className="grid gap-2">
                            <Label htmlFor="images">Product Images (max 5)</Label>
                            <p className="text-xs text-muted-foreground">
                                Upload up to 5 images. Max 5MB each. JPG, PNG, or WEBP.
                            </p>
                            <Input
                                id="images"
                                type="file"
                                name="images[]"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleImageChange}
                            />
                            {previews.length > 0 && (
                                <div className="flex gap-3 mt-2 flex-wrap">
                                    {previews.map((src, idx) => (
                                        <div key={idx} className="h-20 w-20 overflow-hidden rounded-md border">
                                            <img src={src} alt={`Preview ${idx}`} className="h-full w-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <InputError message={errors['images'] || errors['images.0']} />
                        </div>

                        {/* Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name">Product Name *</Label>
                            <Input id="name" name="name" required placeholder="e.g., Vintage Denim Jacket" />
                            <InputError message={errors.name} />
                        </div>

                        {/* Description */}
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description *</Label>
                            <WysiwygEditor 
                                value={description} 
                                onChange={setDescription} 
                                placeholder="Describe the condition, size, material, and any defects..."
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Category */}
                            <div className="grid gap-2">
                                <Label htmlFor="category_id">Category *</Label>
                                <Select name="category_id" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={String(cat.id)}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.category_id} />
                            </div>

                            {/* Condition */}
                            <div className="grid gap-2">
                                <Label htmlFor="condition">Condition *</Label>
                                <Select name="condition" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="new">New (with tags)</SelectItem>
                                        <SelectItem value="good">Good (like new)</SelectItem>
                                        <SelectItem value="bad">Fair (visible wear)</SelectItem>
                                        <SelectItem value="poor">Poor (needs repair)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.condition} />
                            </div>

                            {/* Department / Gender */}
                            <div className="grid gap-2">
                                <Label htmlFor="department">Gender/Department *</Label>
                                <Select name="department" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unisex">Unisex</SelectItem>
                                        <SelectItem value="men">Men</SelectItem>
                                        <SelectItem value="women">Women</SelectItem>
                                        <SelectItem value="kids">Kids</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.department} />
                            </div>

                            {/* Price */}
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price (IDR) *</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="1000"
                                    required
                                    placeholder="150000"
                                />
                                <InputError message={errors.price} />
                            </div>

                            {/* Stock */}
                            <div className="grid gap-2">
                                <Label htmlFor="stock">Stock *</Label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    min="1"
                                    required
                                    placeholder="1"
                                />
                                <InputError message={errors.stock} />
                            </div>

                            {/* Brand */}
                            <div className="grid gap-2">
                                <Label htmlFor="brand">Brand</Label>
                                <Input id="brand" name="brand" placeholder="e.g., Levi's, Uniqlo" />
                                <InputError message={errors.brand} />
                            </div>

                            {/* Size */}
                            <div className="grid gap-2">
                                <Label htmlFor="size">Size</Label>
                                <Input id="size" name="size" placeholder="e.g., M, L, 42" />
                                <InputError message={errors.size} />
                            </div>

                            {/* Color */}
                            <div className="grid gap-2">
                                <Label htmlFor="color">Color</Label>
                                <Input id="color" name="color" placeholder="e.g., Blue, Black" />
                                <InputError message={errors.color} />
                            </div>

                            {/* Material */}
                            <div className="grid gap-2">
                                <Label htmlFor="material">Material</Label>
                                <Input id="material" name="material" placeholder="e.g., Cotton, Polyester" />
                                <InputError message={errors.material} />
                            </div>
                        </div>

                        <div className="flex gap-3 border-t pt-6">
                            <Button type="submit" disabled={processing}>
                                {processing && <Spinner />}
                                Create Product
                            </Button>
                            <Button variant="outline" type="button" asChild>
                                <Link href="/seller/products">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </>
    );
}
