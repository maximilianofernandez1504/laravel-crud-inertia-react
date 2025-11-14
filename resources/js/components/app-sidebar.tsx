import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, PackageSearch,UsersRound, LockKeyhole} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Productos',
        url: '/products',
        icon: PackageSearch
        
    },
    {
        title: 'Categorias',
        url: '/categories',
        icon: Folder
    },
    {
        title: 'Roles',
        url: '/roles',
        icon: LockKeyhole,
    },
    {
        
        title: 'Permissions',
        url: '/permissions',
        icon: LockKeyhole, 
    }
    ,
    {
        title: 'Usuarios',
        url: '/users',
        icon: UsersRound
    },
    {
        title: 'Carrito',
        url: '/cart',
        icon : UsersRound,
    },
    {
        title:'Historial de Compra',
        url: '/orders/mis-compras',
        icon: UsersRound,
    },
    {
        title: 'Ordenes',
        url:'/orders',
        icon:LockKeyhole,
    },
    {
        title: 'SobreNosotros',
        url:'/about-us',
        icon:LockKeyhole,
    },

    {
        title:'Configuración de la pagina',
        url: '/sitesettings',
        icon: LockKeyhole,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        url: 'https://github.com/maximilianofernandez1504/laravel-crud-inertia-react/tree/main/sto',
        icon: Folder,
    },
    {
        title: 'Documentation',
        url: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
