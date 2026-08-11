<template>
  <div class="perfil-page">
    <ProgressBar mode="indeterminate" style="height: 6px" v-if="cargando" />

    <div v-else class="grid">
      <div class="col-12 lg:col-8 lg:col-offset-2">
        <Card class="perfil-card shadow-2 border-round-xl overflow-hidden">
          <template #content>
            <div class="perfil-hero">
              <div class="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-4">
                <div class="flex align-items-center gap-3 flex-wrap">
                  <Avatar :label="inicialesUsuario" shape="circle" size="xlarge" class="perfil-avatar" />
                  <div>
                    <div class="text-2xl font-bold text-900">{{ mis_datos.user.name }}</div>
                    <div class="text-600 mt-2">{{ mis_datos.user.email }}</div>
                    <div class="mt-3">
                      <Tag :value="mis_datos.role.nombre" :severity="rolSeverity" rounded />
                    </div>
                  </div>
                </div>

                <div class="flex gap-2 flex-wrap">
                  <Button label="Ir al inicio" icon="pi pi-home" outlined @click="irInicio" />
                  <Button label="Cerrar sesión" icon="pi pi-sign-out" severity="danger" @click="salir" />
                </div>
              </div>
            </div>

            <div class="grid mt-2">
              <div class="col-12 md:col-4">
                <div class="perfil-stat-card">
                  <div class="perfil-stat-icon bg-blue-50 text-blue-500">
                    <i class="pi pi-user"></i>
                  </div>
                  <div>
                    <small class="text-500 block mb-1">Nombre de usuario</small>
                    <div class="font-semibold text-900 line-height-3">{{ mis_datos.user.name }}</div>
                  </div>
                </div>
              </div>

              <div class="col-12 md:col-4">
                <div class="perfil-stat-card">
                  <div class="perfil-stat-icon bg-green-50 text-green-500">
                    <i class="pi pi-envelope"></i>
                  </div>
                  <div>
                    <small class="text-500 block mb-1">Correo electrónico</small>
                    <div class="font-semibold text-900 line-height-3 break-all">{{ mis_datos.user.email }}</div>
                  </div>
                </div>
              </div>

              <div class="col-12 md:col-4">
                <div class="perfil-stat-card">
                  <div class="perfil-stat-icon bg-orange-50 text-orange-500">
                    <i class="pi pi-id-card"></i>
                  </div>
                  <div>
                    <small class="text-500 block mb-1">Rol asignado</small>
                    <div class="font-semibold text-900 line-height-3">{{ mis_datos.role.nombre }}</div>
                  </div>
                </div>
              </div>
            </div>

            <Divider />

            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="perfil-info-panel h-full">
                  <div class="flex align-items-center gap-2 mb-3">
                    <i class="pi pi-info-circle text-primary"></i>
                    <h4 class="m-0">Información de la cuenta</h4>
                  </div>

                  <div class="perfil-info-item">
                    <span class="text-600">Nombre</span>
                    <strong>{{ mis_datos.user.name }}</strong>
                  </div>

                  <div class="perfil-info-item">
                    <span class="text-600">Correo</span>
                    <strong class="break-all">{{ mis_datos.user.email }}</strong>
                  </div>

                  <div class="perfil-info-item">
                    <span class="text-600">Rol</span>
                    <strong>{{ mis_datos.role.nombre }}</strong>
                  </div>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="perfil-info-panel h-full">
                  <div class="flex align-items-center gap-2 mb-3">
                    <i class="pi pi-shield text-primary"></i>
                    <h4 class="m-0">Acciones rápidas</h4>
                  </div>

                  <div class="flex flex-column gap-3">
                    <Button label="Volver al panel" icon="pi pi-home" outlined class="justify-content-start" @click="irInicio" />
                    <Button label="Cerrar sesión segura" icon="pi pi-sign-out" severity="danger" outlined class="justify-content-start" @click="salir" />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import authService from '@/service/AuthService';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const mis_datos = ref(null);
const cargando = ref(true);

const perfil = async () => {
  try {
    const { data } = await authService.getPerfil();
    mis_datos.value = data;
  } finally {
    cargando.value = false;
  }
};

const salir = async () => {
  await authService.logout();
  localStorage.removeItem('access_token');
  localStorage.removeItem('role');
  router.push({ name: 'Login' });
};

const irInicio = () => {
  router.push({ name: 'Dashboard' });
};

const inicialesUsuario = computed(() => {
  const nombre = mis_datos.value?.user?.name || '';
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return 'U';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
});

const rolSeverity = computed(() => {
  const rol = (mis_datos.value?.role?.nombre || '').toLowerCase();
  if (rol.includes('admin')) return 'danger';
  if (rol.includes('super')) return 'warning';
  if (rol.includes('vende')) return 'success';
  return 'info';
});

onMounted(() => {
  perfil();
});
</script>

<style scoped>
.perfil-page {
  min-height: 100%;
}

.perfil-card {
  border-radius: 1.25rem;
}

.perfil-hero {
  background: linear-gradient(135deg, rgba(17, 148, 139, 0.08), rgba(17, 148, 139, 0.02));
  border: 1px solid rgba(17, 148, 139, 0.12);
  border-radius: 1rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.perfil-avatar {
  background: var(--primary-color);
  color: #fff;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center;
  flex-shrink: 0;
}

:deep(.perfil-avatar .p-avatar-text) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  line-height: 1 !important;
  margin: 0 !important;
  transform: none !important;
}

.perfil-stat-card,
.perfil-info-panel {
  border: 1px solid var(--surface-border);
  border-radius: 1rem;
  background: var(--surface-card);
  padding: 1rem;
}

.perfil-stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 100%;
}

.perfil-stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.perfil-info-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--surface-border);
}

.perfil-info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

@media screen and (max-width: 575px) {
  .perfil-hero,
  .perfil-stat-card,
  .perfil-info-panel {
    padding: 1rem;
  }
}
</style>
