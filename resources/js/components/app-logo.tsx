import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex aspect-square size-9 items-center justify-center rounded-xl transition-all duration-300">
            <AppLogoIcon className="size-8 fill-current text-primary" />
        </div>
    );
}
