<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'ADMINISTRADOR',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Perfil', icon: 'pi pi-fw pi-user', to: '/admin/about' }
           
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
            { label: 'Clientes', icon: 'pi pi-fw pi-globe', url: 'https://www.primefaces.org/primeblocks-vue', target: '_blank' }
        ]
    },
    

]);
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
