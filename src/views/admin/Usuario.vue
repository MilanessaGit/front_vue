<template>
    <div class="usuario-page">
        <Toast />

        <div class="usuario-card">
            <div class="usuario-header">
                <div class="usuario-title-wrap">
                    <div class="usuario-icon">
                        <i class="pi pi-users"></i>
                    </div>
                    <div>
                        <h2>Gestión de usuarios</h2>
                        <p>Administra las cuentas de acceso y el rol asignado a cada usuario.</p>
                    </div>
                </div>

                <Button
                    label="Nuevo usuario"
                    icon="pi pi-plus"
                    class="p-button-primary"
                    @click="abrirNuevoUsuario"
                />
            </div>

            <div class="usuario-summary">
                <div class="summary-item">
                    <span class="summary-label">Usuarios registrados</span>
                    <strong>{{ usuarios.length }}</strong>
                </div>

                <div class="summary-search">
                    <span class="p-input-icon-left search-box">
                        <i class="pi pi-search"></i>
                        <InputText
                            v-model="buscar"
                            placeholder="Buscar por nombre o correo..."
                            class="w-full"
                        />
                    </span>
                </div>
            </div>

            <DataTable
                :value="usuariosFiltrados"
                :loading="cargando"
                dataKey="id"
                :paginator="true"
                :rows="5"
                :rowsPerPageOptions="[5, 10, 20]"
                responsiveLayout="scroll"
                stripedRows
                class="usuario-table"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
            >
                <template #empty>
                    <div class="empty-state">
                        <i class="pi pi-users"></i>
                        <span>No se encontraron usuarios.</span>
                    </div>
                </template>

                <Column field="id" header="ID" style="width: 5rem">
                    <template #body="slotProps">
                        <span class="user-id">#{{ slotProps.data.id }}</span>
                    </template>
                </Column>

                <Column header="Usuario" style="min-width: 14rem">
                    <template #body="slotProps">
                        <div class="user-cell">
                            <div class="user-avatar">
                                {{ obtenerIniciales(slotProps.data.name) }}
                            </div>
                            <div class="user-main-data">
                                <span class="user-name">{{ slotProps.data.name }}</span>
                                <small>ID {{ slotProps.data.id }}</small>
                            </div>
                        </div>
                    </template>
                </Column>

                <Column field="email" header="Correo electrónico" style="min-width: 15rem">
                    <template #body="slotProps">
                        <div class="email-cell">
                            <i class="pi pi-envelope"></i>
                            <span>{{ slotProps.data.email }}</span>
                        </div>
                    </template>
                </Column>

                <Column header="Rol" style="min-width: 9rem">
                    <template #body="slotProps">
                        <Tag
                            :value="formatearRol(obtenerRol(slotProps.data))"
                            :severity="severidadRol(obtenerRol(slotProps.data))"
                            class="role-tag"
                        />
                    </template>
                </Column>

                <Column field="created_at" header="Fecha de registro" style="min-width: 11rem">
                    <template #body="slotProps">
                        {{ formatearFecha(slotProps.data.created_at) }}
                    </template>
                </Column>

                <Column header="Acciones" style="width: 10rem">
                    <template #body="slotProps">
                        <div class="action-buttons">
                            <Button
                                icon="pi pi-pencil"
                                class="p-button-rounded p-button-warning p-button-text"
                                v-tooltip.top="'Editar usuario'"
                                aria-label="Editar usuario"
                                @click="editarUsuario(slotProps.data)"
                            />
                            <Button
                                icon="pi pi-trash"
                                class="p-button-rounded p-button-danger p-button-text"
                                v-tooltip.top="'Eliminar usuario'"
                                aria-label="Eliminar usuario"
                                @click="eliminarUsuario(slotProps.data)"
                            />
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog
            v-model:visible="displayModal"
            :modal="true"
            :closable="!guardando"
            :closeOnEscape="!guardando"
            :header="usuario.id ? 'Editar usuario' : 'Nuevo usuario'"
            :style="{ width: '32rem' }"
            :breakpoints="{ '960px': '70vw', '640px': '94vw' }"
            class="usuario-dialog"
            @hide="limpiarFormulario"
        >
            <div class="dialog-intro">
                <div class="dialog-avatar">
                    <i :class="usuario.id ? 'pi pi-user-edit' : 'pi pi-user-plus'"></i>
                </div>
                <div>
                    <strong>{{ usuario.id ? 'Actualizar cuenta' : 'Registrar nueva cuenta' }}</strong>
                    <p>
                        {{ usuario.id
                            ? 'Modifica los datos de acceso y el rol del usuario.'
                            : 'Completa los datos y asigna el rol de la nueva cuenta.'
                        }}
                    </p>
                </div>
            </div>

            <div class="form-field">
                <label for="usuario-nombre">Nombre <span>*</span></label>
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-user"></i>
                    <InputText
                        id="usuario-nombre"
                        v-model.trim="usuario.name"
                        class="w-full"
                        :class="{ 'p-invalid': primerError('name') }"
                        placeholder="Ej. Juan Pérez"
                        autocomplete="off"
                    />
                </span>
                <small v-if="primerError('name')" class="p-error">
                    {{ primerError('name') }}
                </small>
            </div>

            <div class="form-field">
                <label for="usuario-email">Correo electrónico <span>*</span></label>
                <span class="p-input-icon-left w-full">
                    <i class="pi pi-envelope"></i>
                    <InputText
                        id="usuario-email"
                        v-model.trim="usuario.email"
                        type="email"
                        class="w-full"
                        :class="{ 'p-invalid': primerError('email') }"
                        placeholder="usuario@correo.com"
                        autocomplete="off"
                    />
                </span>
                <small v-if="primerError('email')" class="p-error">
                    {{ primerError('email') }}
                </small>
            </div>

            <div class="form-field">
                <label for="usuario-role">Rol <span>*</span></label>
                <Dropdown
                    id="usuario-role"
                    v-model="usuario.role"
                    :options="rolesDisponibles"
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Seleccione un rol"
                    class="w-full"
                    :class="{ 'p-invalid': primerError('role') }"
                />
                <small v-if="primerError('role')" class="p-error">
                    {{ primerError('role') }}
                </small>
                <small v-else class="field-help">
                    El rol determina los módulos disponibles para esta cuenta.
                </small>
            </div>

            <div class="form-field">
                <label for="usuario-password">
                    {{ usuario.id ? 'Nueva contraseña' : 'Contraseña' }} <span>*</span>
                </label>

                <div class="password-wrap">
                    <i class="pi pi-lock password-left-icon"></i>
                    <InputText
                        id="usuario-password"
                        v-model="usuario.password"
                        :type="mostrarPassword ? 'text' : 'password'"
                        class="w-full password-input"
                        :class="{ 'p-invalid': primerError('password') }"
                        :placeholder="usuario.id ? 'Ingrese la nueva contraseña' : 'Ingrese una contraseña'"
                        autocomplete="new-password"
                    />
                    <button
                        type="button"
                        class="password-toggle"
                        :aria-label="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                        @click="mostrarPassword = !mostrarPassword"
                    >
                        <i :class="mostrarPassword ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
                    </button>
                </div>

                <small v-if="primerError('password')" class="p-error">
                    {{ primerError('password') }}
                </small>
                <small v-else-if="usuario.id" class="field-help">
                    La contraseña es requerida para guardar los cambios.
                </small>
            </div>

            <template #footer>
                <Button
                    label="Cancelar"
                    icon="pi pi-times"
                    class="p-button-text p-button-secondary"
                    :disabled="guardando"
                    @click="cerrarModal"
                />
                <Button
                    :label="usuario.id ? 'Guardar cambios' : 'Crear usuario'"
                    :icon="usuario.id ? 'pi pi-check' : 'pi pi-plus'"
                    :loading="guardando"
                    @click="guardarUsuario"
                />
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import usuarioService from '@/service/UsuarioService';

const toast = useToast();

const usuarios = ref([]);
const usuario = ref(crearUsuarioVacio());
const errors = ref({});
const buscar = ref('');
const displayModal = ref(false);
const cargando = ref(false);
const guardando = ref(false);
const mostrarPassword = ref(false);

const rolesDisponibles = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Supervisor', value: 'supervisor' },
    { label: 'Vendedor', value: 'vendedor' }
];

function crearUsuarioVacio() {
    return {
        id: null,
        name: '',
        email: '',
        password: '',
        role: ''
    };
}

const usuariosFiltrados = computed(() => {
    const texto = buscar.value.trim().toLowerCase();

    if (!texto) {
        return usuarios.value;
    }

    return usuarios.value.filter((item) => {
        return String(item.id ?? '').includes(texto)
            || String(item.name ?? '').toLowerCase().includes(texto)
            || String(item.email ?? '').toLowerCase().includes(texto)
            || formatearRol(obtenerRol(item)).toLowerCase().includes(texto);
    });
});

const listarUsuarios = async () => {
    cargando.value = true;

    try {
        const { data } = await usuarioService.listar();
        usuarios.value = Array.isArray(data) ? data : [];
    } catch (error) {
        console.error(error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar la lista de usuarios.',
            life: 3500
        });
    } finally {
        cargando.value = false;
    }
};

const abrirNuevoUsuario = () => {
    usuario.value = crearUsuarioVacio();
    errors.value = {};
    mostrarPassword.value = false;
    displayModal.value = true;
};

const editarUsuario = (item) => {
    usuario.value = {
        id: item.id,
        name: item.name ?? '',
        email: item.email ?? '',
        password: '',
        role: obtenerRol(item)
    };

    errors.value = {};
    mostrarPassword.value = false;
    displayModal.value = true;
};

const validarFormulario = () => {
    const nuevosErrores = {};

    if (!usuario.value.name) {
        nuevosErrores.name = ['El nombre es obligatorio.'];
    }

    if (!usuario.value.email) {
        nuevosErrores.email = ['El correo electrónico es obligatorio.'];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.value.email)) {
        nuevosErrores.email = ['Ingrese un correo electrónico válido.'];
    }

    if (!usuario.value.role) {
        nuevosErrores.role = ['Seleccione un rol para el usuario.'];
    }

    if (!usuario.value.password) {
        nuevosErrores.password = ['La contraseña es obligatoria.'];
    }

    errors.value = nuevosErrores;
    return Object.keys(nuevosErrores).length === 0;
};

const guardarUsuario = async () => {
    if (!validarFormulario()) {
        return;
    }

    guardando.value = true;
    errors.value = {};

    try {
        if (usuario.value.id) {
            await usuarioService.modificar(usuario.value.id, usuario.value);

            toast.add({
                severity: 'success',
                summary: 'Usuario actualizado',
                detail: 'Los datos del usuario se actualizaron correctamente.',
                life: 3000
            });
        } else {
            await usuarioService.guardar(usuario.value);

            toast.add({
                severity: 'success',
                summary: 'Usuario registrado',
                detail: 'La cuenta fue creada correctamente.',
                life: 3000
            });
        }

        displayModal.value = false;
        await listarUsuarios();
    } catch (error) {
        console.error(error);

        if (error.response?.status === 422 && error.response?.data?.errors) {
            errors.value = error.response.data.errors;
            return;
        }

        toast.add({
            severity: 'error',
            summary: 'No se pudo guardar',
            detail: error.response?.data?.message || 'Ocurrió un error al guardar el usuario.',
            life: 4000
        });
    } finally {
        guardando.value = false;
    }
};

const eliminarUsuario = async (item) => {
    const confirmado = window.confirm(
        `¿Está seguro de eliminar al usuario "${item.name}"?`
    );

    if (!confirmado) {
        return;
    }

    try {
        await usuarioService.eliminar(item.id);

        toast.add({
            severity: 'success',
            summary: 'Usuario eliminado',
            detail: 'El usuario fue eliminado correctamente.',
            life: 3000
        });

        await listarUsuarios();
    } catch (error) {
        console.error(error);
        toast.add({
            severity: 'error',
            summary: 'No se pudo eliminar',
            detail: error.response?.data?.message
                || 'El usuario podría estar relacionado con otros registros del sistema.',
            life: 4000
        });
    }
};

const cerrarModal = () => {
    displayModal.value = false;
};

const limpiarFormulario = () => {
    usuario.value = crearUsuarioVacio();
    errors.value = {};
    mostrarPassword.value = false;
};

const obtenerRol = (item) => {
    return item?.roles?.[0]?.nombre || '';
};

const formatearRol = (rol) => {
    const nombres = {
        admin: 'Administrador',
        supervisor: 'Supervisor',
        vendedor: 'Vendedor'
    };

    return nombres[rol] || 'Sin rol';
};

const severidadRol = (rol) => {
    const severidades = {
        admin: 'danger',
        supervisor: 'info',
        vendedor: 'success'
    };

    return severidades[rol] || 'warning';
};

const primerError = (campo) => {
    const error = errors.value?.[campo];

    if (Array.isArray(error)) {
        return error[0] || '';
    }

    return error || '';
};

const obtenerIniciales = (nombre) => {
    const partes = String(nombre || '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2);

    return partes.map((parte) => parte.charAt(0).toUpperCase()).join('') || 'U';
};

const formatearFecha = (fecha) => {
    if (!fecha) {
        return '—';
    }

    const valor = new Date(fecha);

    if (Number.isNaN(valor.getTime())) {
        return '—';
    }

    return new Intl.DateTimeFormat('es-BO', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    }).format(valor);
};

onMounted(() => {
    listarUsuarios();
});
</script>

<style scoped>
.usuario-page {
    width: 100%;
}

.usuario-card {
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    border-radius: 14px;
    padding: 1.35rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.usuario-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.25rem;
}

.usuario-title-wrap {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    min-width: 0;
}

.usuario-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-50);
    color: var(--primary-color);
    flex: 0 0 auto;
}

.usuario-icon i {
    font-size: 1.35rem;
}

.usuario-header h2 {
    margin: 0;
    font-size: 1.45rem;
    color: var(--text-color);
}

.usuario-header p {
    margin: 0.25rem 0 0;
    color: var(--text-color-secondary);
    font-size: 0.92rem;
}

.usuario-summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.9rem 1rem;
    margin-bottom: 1rem;
    background: var(--surface-ground);
    border-radius: 10px;
}

.summary-item {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    white-space: nowrap;
}

.summary-item strong {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.55rem;
    border-radius: 999px;
    background: var(--primary-color);
    color: var(--primary-color-text);
}

.summary-label {
    color: var(--text-color-secondary);
    font-size: 0.9rem;
}

.summary-search {
    width: min(100%, 23rem);
}

.search-box {
    width: 100%;
}

.user-id {
    color: var(--text-color-secondary);
    font-weight: 600;
}

.user-cell {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.user-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    background: var(--primary-50);
    color: var(--primary-color);
    font-weight: 700;
    font-size: 0.85rem;
}

.user-main-data {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.user-name {
    font-weight: 600;
    color: var(--text-color);
}

.user-main-data small {
    margin-top: 0.15rem;
    color: var(--text-color-secondary);
}

.email-cell {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    color: var(--text-color);
}

.email-cell i {
    color: var(--text-color-secondary);
}

.role-tag {
    white-space: nowrap;
}

.action-buttons {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.empty-state {
    min-height: 8rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.65rem;
    color: var(--text-color-secondary);
}

.empty-state i {
    font-size: 2rem;
}

.dialog-intro {
    display: flex;
    gap: 0.85rem;
    align-items: center;
    padding: 0.85rem;
    margin-bottom: 1.25rem;
    border-radius: 10px;
    background: var(--surface-ground);
}

.dialog-avatar {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    background: var(--primary-50);
    color: var(--primary-color);
}

.dialog-avatar i {
    font-size: 1.2rem;
}

.dialog-intro strong {
    color: var(--text-color);
}

.dialog-intro p {
    margin: 0.2rem 0 0;
    font-size: 0.87rem;
    color: var(--text-color-secondary);
}

.form-field {
    margin-bottom: 1.15rem;
}

.form-field label {
    display: block;
    margin-bottom: 0.45rem;
    color: var(--text-color);
    font-weight: 600;
}

.form-field label span {
    color: var(--red-500);
}

.form-field .p-error,
.field-help {
    display: block;
    margin-top: 0.35rem;
    font-size: 0.82rem;
}

.field-help {
    color: var(--text-color-secondary);
}

.password-wrap {
    position: relative;
    width: 100%;
}

.password-left-icon {
    position: absolute;
    z-index: 2;
    left: 0.9rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-color-secondary);
    pointer-events: none;
}

.password-input {
    padding-left: 2.5rem !important;
    padding-right: 2.8rem !important;
}

.password-toggle {
    position: absolute;
    z-index: 2;
    right: 0.55rem;
    top: 50%;
    transform: translateY(-50%);
    width: 2rem;
    height: 2rem;
    border: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--text-color-secondary);
    cursor: pointer;
}

.password-toggle:hover {
    background: var(--surface-hover);
    color: var(--primary-color);
}

@media (max-width: 720px) {
    .usuario-card {
        padding: 1rem;
    }

    .usuario-header,
    .usuario-summary {
        align-items: stretch;
        flex-direction: column;
    }

    .usuario-header :deep(.p-button) {
        width: 100%;
        justify-content: center;
    }

    .summary-search {
        width: 100%;
    }

    .summary-item {
        justify-content: space-between;
    }
}
</style>
