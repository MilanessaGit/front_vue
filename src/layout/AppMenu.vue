<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';
import { useRouter } from 'vue-router';

const rol = localStorage.getItem("role")

const menuAdmin = [
    {
        label: 'ADMINISTRADOR',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/admin/dashboard' },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/admin/about' },
            { label: 'Empleados', icon: 'pi pi-fw pi-id-card', to: '/admin/empleado' }
           
           /* { label: 'Categorias', icon: 'pi pi-fw pi-id-card', to: '/uikit/formlayout' },
            { label: 'Productos', icon: 'pi pi-fw pi-check-square', to: '/uikit/input' },
            { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', to: '/uikit/floatlabel' },
            { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', to: '/uikit/invalidstate' },
            { label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/uikit/button', class: 'rotated-icon' },
            { label: 'Table', icon: 'pi pi-fw pi-table', to: '/uikit/table' },
            { label: 'List', icon: 'pi pi-fw pi-list', to: '/uikit/list' },
            { label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/uikit/tree' },
            { label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/uikit/panel' },
            { label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/uikit/overlay' },
            { label: 'Media', icon: 'pi pi-fw pi-image', to: '/uikit/media' },
            { label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/uikit/menu', preventExact: true },
            { label: 'Message', icon: 'pi pi-fw pi-comment', to: '/uikit/message' },
            { label: 'File', icon: 'pi pi-fw pi-file', to: '/uikit/file' },
            { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/uikit/charts' },
            { label: 'Misc', icon: 'pi pi-fw pi-circle', to: '/uikit/misc' }
            */
        ]
        
    },
    {
        label: 'Gestión Productos',
        items: [
            { label: 'Categorias', icon: 'pi pi-fw pi-id-card', to: '/admin/categoria' },
            { label: 'Productos', icon: 'pi pi-fw pi-table', to: '/admin/producto' },
            { label: 'Lotes', icon: 'pi pi-fw pi-tags', to: '/admin/lote' }
        ]
    },
    {
        label: 'Ventas',
        items: [
            { label: 'Nueva Venta', icon: 'pi pi-fw pi-eye', to: '/admin/venta/nueva', badge: 'NUEVO' },
            { label: 'Lista Ventas', icon: 'pi pi-fw pi-globe', to: '/admin/venta' },
            { label: 'Clientes', icon: 'pi pi-fw pi-user', to: '/admin/cliente' }
        ]
    },
    {
        label: 'Entradas',
        items: [
            { label: 'Nueva Entrada', icon: 'pi pi-fw pi-eye', to: '/admin/entrada/nueva', badge: 'NUEVO' },
            { label: 'Lista Entradas', icon: 'pi pi-fw pi-globe', to: '/admin/entrada' },
            { label: 'Proveedores', icon: 'pi pi-fw pi-user', to: '/admin/proveedor' }
        ]
    },

    {
        label: 'Salidas',
        items: [
            { label: 'Nueva Salida', icon: 'pi pi-fw pi-eye', to: '/admin/salida/nueva', badge: 'NUEVO' },
            { label: 'Lista Salidas', icon: 'pi pi-fw pi-globe', to: '/admin/salida' } 
        ]
    },
    {
        label: 'Gestion Almacen',
        items: [
            { label: 'Nueva Almacen', icon: 'pi pi-fw pi-eye', to: '/admin/almacen/nueva', badge: 'NUEVO' },
            { label: 'Lista Almacenes', icon: 'pi pi-fw pi-globe', to: '/admin/almacen' } 
        ]
    }
];

const menuSupervisor = [
    {
        label: 'SUPERVISOR',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/admin/dashboard' },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/admin/about' }
        ]
    },
    {
        label: 'Gestión Productos',
        items: [
            { label: 'Categorias', icon: 'pi pi-fw pi-id-card', to: '/admin/categoria' },
            { label: 'Productos', icon: 'pi pi-fw pi-table', to: '/admin/producto' },
            { label: 'Lotes', icon: 'pi pi-fw pi-tags', to: '/admin/lote' }
        ]
    },
    {
        label: 'Ventas',
        items: [
            { label: 'Nueva Venta', icon: 'pi pi-fw pi-eye', to: '/admin/venta/nueva', badge: 'NUEVO' },
            { label: 'Lista Ventas', icon: 'pi pi-fw pi-globe', to: '/admin/venta' },
            { label: 'Clientes', icon: 'pi pi-fw pi-user', to: '/admin/cliente' }
        ]
    },
    {
        label: 'Salidas',
        items: [
            { label: 'Nueva Salida', icon: 'pi pi-fw pi-eye', to: '/admin/salida/nueva', badge: 'NUEVO' },
            { label: 'Lista Salidas', icon: 'pi pi-fw pi-globe', to: '/admin/salida' } 
        ]
    },
    {
        label: 'Gestion Almacen',
        items: [
            { label: 'Nueva Almacen', icon: 'pi pi-fw pi-eye', to: '/admin/almacen/nueva', badge: 'NUEVO' },
            { label: 'Lista Almacenes', icon: 'pi pi-fw pi-globe', to: '/admin/almacen' } 
        ]
    }
];

const menuVendedor = [
    {
        label: 'VENDEDOR',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/admin/dashboard' },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/admin/about' }
        ]
    },
    {
        label: 'Gestión Productos',
        items: [
            { label: 'Categorias', icon: 'pi pi-fw pi-id-card', to: '/admin/categoria' },
            { label: 'Productos', icon: 'pi pi-fw pi-table', to: '/admin/producto' },
            { label: 'Lotes', icon: 'pi pi-fw pi-tags', to: '/admin/lote' }
        ]
    },
    {
        label: 'Ventas',
        items: [
            { label: 'Nueva Venta', icon: 'pi pi-fw pi-eye', to: '/admin/venta/nueva', badge: 'NUEVO' },
            { label: 'Lista Ventas', icon: 'pi pi-fw pi-globe', to: '/admin/venta' },
            { label: 'Clientes', icon: 'pi pi-fw pi-user', to: '/admin/cliente' }
        ]
    }
];

const model = ref([])

if (rol === "admin") {
    model.value = menuAdmin
}

if (rol === "supervisor") {
    model.value = menuSupervisor
}

if (rol === "vendedor") {
    model.value = menuVendedor
}

</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        <!--
        <li>
            <a href="https://www.primefaces.org/primeblocks-vue/#/" target="_blank">
                <img src="/layout/images/banner-primeblocks.png" alt="Prime Blocks" class="w-full mt-3" />
            </a>
        </li>
        -->
    </ul>
</template>

<style lang="scss" scoped></style>
