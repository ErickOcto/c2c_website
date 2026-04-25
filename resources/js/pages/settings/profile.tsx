import { useState, useRef, useEffect } from 'react';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage, router } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
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
import { Separator } from '@/components/ui/separator';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import { Spinner } from '@/components/ui/spinner';

type Profile = {
    id?: number;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    nationality?: string;
    address?: string;
    city?: string;
    city_id?: number;
    province_id?: number;
    province_name?: string;
    postal_code?: string;
    profile_picture?: string;
};

export default function ProfilePage({
    mustVerifyEmail,
    status,
    profile,
}: {
    mustVerifyEmail: boolean;
    status?: string;
    profile?: Profile;
}) {
    const { auth } = usePage().props;
    const [avatarPreview, setAvatarPreview] = useState<string | null>(
        profile?.profile_picture ?? null,
    );
    const formRef = useRef<HTMLFormElement>(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [saved, setSaved] = useState(false);

    // Rajaongkir Dropdown States
    const [provinces, setProvinces] = useState<{province_id: string, province: string}[]>([]);
    const [cities, setCities] = useState<{city_id: string, city_name: string, type: string}[]>([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState<string>(profile?.province_id?.toString() ?? '');
    const [selectedCityId, setSelectedCityId] = useState<string>(profile?.city_id?.toString() ?? '');
    const [selectedProvinceName, setSelectedProvinceName] = useState<string>(profile?.province_name ?? '');
    const [selectedCityName, setSelectedCityName] = useState<string>(profile?.city ?? '');

    // Formatted date for input
    const dob = profile?.date_of_birth ? profile.date_of_birth.split('T')[0] : '';

    useEffect(() => {
        fetch('/api/shipping/provinces', { headers: { Accept: 'application/json' } })
            .then((res) => res.json())
            .then((data) => setProvinces(data.provinces || []))
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (selectedProvinceId) {
            fetch(`/api/shipping/cities?province_id=${selectedProvinceId}`, { headers: { Accept: 'application/json' } })
                .then((res) => res.json())
                .then((data) => setCities(data.cities || []))
                .catch(() => {});
        } else {
            setCities([]);
        }
    }, [selectedProvinceId]);

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
        }
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!formRef.current) return;

        setProcessing(true);
        setErrors({});
        setSaved(false);

        const formData = new FormData(formRef.current);
        formData.append('_method', 'PATCH');

        router.post('/settings/profile', formData, {
            forceFormData: true,
            preserveScroll: true,
            onError: (errs) => {
                setErrors(errs as Record<string, string>);
                setProcessing(false);
            },
            onSuccess: () => {
                setSaved(true);
                setProcessing(false);
                setTimeout(() => setSaved(false), 3000);
            },
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Profile information"
                    description="Update your personal data, profile photo, and contact information"
                />

                <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    encType="multipart/form-data"
                >
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-muted bg-muted">
                            {avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                                    {(auth as any).user.name?.[0]?.toUpperCase() ?? 'U'}
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="avatar">Profile Photo</Label>
                            <Input
                                id="avatar"
                                type="file"
                                name="avatar"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleAvatarChange}
                                className="max-w-xs"
                            />
                            <InputError message={errors.avatar} />
                        </div>
                    </div>

                    <Separator />

                    {/* Basic Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                required
                                autoComplete="name"
                                defaultValue={(auth as any).user.name}
                                placeholder="Full name"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                                defaultValue={(auth as any).user.email}
                                placeholder="Email address"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                defaultValue={profile?.phone ?? ''}
                                placeholder="+62 812-3456-7890"
                            />
                            <InputError message={errors.phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date_of_birth">Date of Birth</Label>
                            <Input
                                id="date_of_birth"
                                name="date_of_birth"
                                type="date"
                                defaultValue={dob}
                            />
                            <InputError message={errors.date_of_birth} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select name="gender" defaultValue={profile?.gender ?? ''}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.gender} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="nationality">Nationality</Label>
                            <Input
                                id="nationality"
                                name="nationality"
                                defaultValue={profile?.nationality ?? ''}
                                placeholder="e.g., Indonesian"
                            />
                            <InputError message={errors.nationality} />
                        </div>
                    </div>

                    <Separator />

                    {/* Address */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="address">Main Address</Label>
                            <textarea
                                id="address"
                                name="address"
                                rows={2}
                                defaultValue={profile?.address ?? ''}
                                placeholder="Street address"
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <InputError message={errors.address} />
                        </div>

                        <input type="hidden" name="province_id" value={selectedProvinceId} />
                        <input type="hidden" name="province_name" value={selectedProvinceName} />
                        <input type="hidden" name="city_id" value={selectedCityId} />
                        <input type="hidden" name="city" value={selectedCityName} />

                        <div className="grid gap-2">
                            <Label htmlFor="province">Province</Label>
                            <Select
                                value={selectedProvinceId || undefined}
                                onValueChange={(val) => {
                                    setSelectedProvinceId(val);
                                    const prov = provinces.find((p) => p.province_id.toString() === val);
                                    if (prov) setSelectedProvinceName(prov.province);
                                    // Reset city when province changes
                                    setSelectedCityId('');
                                    setSelectedCityName('');
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={provinces.length > 0 ? "Select province" : "Loading provinces..."} />
                                </SelectTrigger>
                                <SelectContent>
                                    {provinces.length === 0 && (
                                        <div className="p-2 text-sm text-muted-foreground text-center">
                                            No provinces available. Check API key.
                                        </div>
                                    )}
                                    {provinces.map((prov) => (
                                        <SelectItem key={prov.province_id} value={prov.province_id.toString()}>
                                            {prov.province}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.province_id || errors.province_name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="city">City / Regency</Label>
                            <Select
                                value={selectedCityId || undefined}
                                onValueChange={(val) => {
                                    setSelectedCityId(val);
                                    const city = cities.find((c) => c.city_id.toString() === val);
                                    if (city) setSelectedCityName(city.city_name);
                                }}
                                disabled={!selectedProvinceId}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={!selectedProvinceId ? 'Select a province first' : (cities.length > 0 ? 'Select city' : 'Loading cities...')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {cities.length === 0 && selectedProvinceId && (
                                        <div className="p-2 text-sm text-muted-foreground text-center">
                                            No cities available.
                                        </div>
                                    )}
                                    {cities.map((city) => (
                                        <SelectItem key={city.city_id} value={city.city_id.toString()}>
                                            {city.type} {city.city_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.city_id || errors.city} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="postal_code">Postal Code</Label>
                            <Input
                                id="postal_code"
                                name="postal_code"
                                defaultValue={profile?.postal_code ?? ''}
                                placeholder="e.g., 40115"
                            />
                            <InputError message={errors.postal_code} />
                        </div>
                    </div>

                    {mustVerifyEmail &&
                        (auth as any).user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={send.url()}
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the
                                        verification email.
                                    </Link>
                                </p>

                                {status ===
                                    'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been
                                        sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}

                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            data-test="update-profile-button"
                        >
                            {processing && <Spinner />}
                            Save
                        </Button>

                        <Transition
                            show={saved}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">
                                Saved
                            </p>
                        </Transition>
                    </div>
                </form>
            </div>

            <DeleteUser />
        </>
    );
}

ProfilePage.layout = {
    breadcrumbs: [
        {
            title: 'Profile settings',
            href: edit.url(),
        },
    ],
};
