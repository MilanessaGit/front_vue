<template>
    <div class="login-page">
        <div class="login-shell">
            <!-- PANEL DE MARCA -->
            <section class="brand-panel">
                <div class="brand-overlay"></div>

                <div class="brand-content">
                    <div class="brand-logo-wrap">
                        <img
                            src="/layout/images/logo-aries-jb.jpg"
                            alt="Importadora Aries J&B"
                            class="brand-logo"
                        />
                    </div>

                    <div class="brand-summary">
                        <h2>Sistema de Gestión</h2>
                        <p>Inventario · Ventas · Compras · Reportes</p>

                        <div class="brand-divider"></div>

                        <div class="feature-list">
                            <div class="feature-item">
                                <i class="pi pi-box"></i>
                                <span>Control de inventario por lotes</span>
                            </div>

                            <div class="feature-item">
                                <i class="pi pi-tags"></i>
                                <span>Ventas y Salidas Fisicas</span>
                            </div>

                            <div class="feature-item">
                                <i class="pi pi-shield"></i>
                                <span>Reservas y seguimiento de entregas</span>
                            </div>

                            <div class="feature-item">
                                <i class="pi pi-chart-bar"></i>
                                <span>Dashboard y reportes de gestión</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- FORMULARIO -->
            <section class="form-panel">
                <div class="login-form-wrap">
                    <!-- Logo visible solo en tablet/móvil -->
                    <div class="mobile-logo-wrap">
                        <img
                            src="/layout/images/logo-aries-jb.jpg"
                            alt="Importadora Aries J&B"
                            class="mobile-logo"
                        />
                    </div>

                    <div class="login-heading">
                        <span class="welcome-text">Bienvenido de nuevo</span>
                        <h1>Iniciar sesión</h1>
                        <p>Ingrese sus credenciales para acceder al sistema</p>
                    </div>

                    <InlineMessage
                        v-if="mensajeError"
                        severity="error"
                        class="w-full login-message"
                    >
                        {{ mensajeError }}
                    </InlineMessage>

                    <!-- CORREO -->
                    <div class="field-group">
                        <label for="email1">Correo electrónico</label>

                        <div class="login-input-wrap">
                            <i class="pi pi-envelope login-field-icon"></i>

                            <InputText
                                id="email1"
                                v-model.trim="usuario.email"
                                type="email"
                                placeholder="Ingrese su correo"
                                class="w-full login-input"
                                :class="{ 'p-invalid': errores.email }"
                                autocomplete="username"
                                @keyup.enter="funIngresar"
                            />
                        </div>

                        <small v-if="errores.email" class="field-error">
                            <i class="pi pi-info-circle"></i>
                            {{ errores.email }}
                        </small>
                    </div>

                    <!-- CONTRASEÑA -->
                    <div class="field-group">
                        <label for="password1">Contraseña</label>

                        <div class="login-input-wrap">
                            <i class="pi pi-lock login-field-icon"></i>

                            <InputText
                                id="password1"
                                v-model="usuario.password"
                                :type="mostrarPassword ? 'text' : 'password'"
                                placeholder="Ingrese su contraseña"
                                class="w-full login-input login-password-native"
                                :class="{ 'p-invalid': errores.password }"
                                autocomplete="current-password"
                                @keyup.enter="funIngresar"
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

                        <small v-if="errores.password" class="field-error">
                            <i class="pi pi-info-circle"></i>
                            {{ errores.password }}
                        </small>
                    </div>

                    <Button
                        label="Ingresar al sistema"
                        icon="pi pi-sign-in"
                        class="w-full login-button"
                        :loading="cargando"
                        :disabled="cargando"
                        @click="funIngresar"
                    />

                    <div v-if="cargando" class="loading-note">
                        <i class="pi pi-spin pi-spinner"></i>
                        <span>Validando credenciales...</span>
                    </div>

                    <div class="security-note">
                        <i class="pi pi-lock"></i>
                        <span>Acceso protegido mediante autenticación segura</span>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import authService from '@/service/AuthService';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const usuario = ref({
    email: '',
    password: ''
});

const cargando = ref(false);
const mostrarPassword = ref(false);
const mensajeError = ref('');

const errores = reactive({
    email: '',
    password: ''
});

const limpiarErrores = () => {
    errores.email = '';
    errores.password = '';
    mensajeError.value = '';
};

const validarFormulario = () => {
    limpiarErrores();

    let valido = true;

    if (!usuario.value.email) {
        errores.email = 'El correo electrónico es obligatorio.';
        valido = false;
    } else {
        const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!patronCorreo.test(usuario.value.email)) {
            errores.email = 'Ingrese un correo electrónico válido.';
            valido = false;
        }
    }

    if (!usuario.value.password) {
        errores.password = 'La contraseña es obligatoria.';
        valido = false;
    }

    return valido;
};

const redirigirSegunRol = async (role) => {
    const rol = String(role || '').trim().toLowerCase();

    // El Dashboard únicamente corresponde al administrador.
    if (rol === 'admin' || rol === 'administrador') {
        await router.push({ name: 'Dashboard' });
        return;
    }

    // Supervisor y vendedor ingresan a una vista permitida para ambos.
    await router.push({ name: 'about' });
};

const funIngresar = async () => {
    if (cargando.value) return;

    if (!validarFormulario()) return;

    try {
        cargando.value = true;
        mensajeError.value = '';

        const { data } = await authService.login({
            email: usuario.value.email,
            password: usuario.value.password
        });

        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('role', data.role);

        await redirigirSegunRol(data.role);
    } catch (error) {
        console.error('Error al iniciar sesión:', error);

        if (!error.response) {
            mensajeError.value =
                'No se pudo conectar con el servidor. Verifique que Laravel esté ejecutándose y que el dispositivo tenga acceso a la red.';
            return;
        }

        if (error.response.status === 401) {
            mensajeError.value =
                'Correo o contraseña incorrectos. Verifique sus credenciales.';
            return;
        }

        if (error.response.status === 422) {
            mensajeError.value =
                'Revise el correo electrónico y la contraseña ingresados.';
            return;
        }

        mensajeError.value =
            'No fue posible iniciar sesión. Intente nuevamente.';
    } finally {
        cargando.value = false;
    }
};
</script>

<style scoped>
.login-page {
    width: 100%;
    min-width: 0;
    min-height: 100vh;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    overflow-x: hidden;
    background:
        radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.14), transparent 30%),
        radial-gradient(circle at 85% 85%, rgba(59, 130, 246, 0.10), transparent 30%),
        var(--surface-ground);
}

.login-shell {
    width: min(1120px, 100%);
    min-height: min(600px, calc(100vh - 2rem));
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    overflow: hidden;
    border-radius: 1.5rem;
    background: var(--surface-card);
    border: 1px solid var(--surface-border);
    box-shadow: 0 20px 55px rgba(15, 23, 42, 0.16);
}

/* ============================
   PANEL IZQUIERDO
   ============================ */
.brand-panel {
    position: relative;
    overflow: hidden;
    min-width: 0;
    background:
        radial-gradient(circle at 30% 25%, rgba(180, 83, 9, 0.20), transparent 32%),
        linear-gradient(145deg, #07121f 0%, #0b1f33 55%, #101827 100%);
}

.brand-panel::before,
.brand-panel::after {
    content: '';
    position: absolute;
    border-radius: 999px;
    pointer-events: none;
}

.brand-panel::before {
    width: 300px;
    height: 300px;
    right: -120px;
    top: -90px;
    background: rgba(180, 83, 9, 0.12);
}

.brand-panel::after {
    width: 260px;
    height: 260px;
    left: -100px;
    bottom: -100px;
    background: rgba(59, 130, 246, 0.09);
}

.brand-overlay {
    position: absolute;
    inset: 0;
    background:
        linear-gradient(180deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.26)),
        repeating-linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.018) 0,
            rgba(255, 255, 255, 0.018) 1px,
            transparent 1px,
            transparent 72px
        );
}

.brand-content {
    position: relative;
    z-index: 2;
    height: 100%;
    min-height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2rem;
    padding: 2.25rem 2.75rem;
}

/* Mientras usemos el JPG negro, lo mostramos como una placa horizontal
   recortando el exceso superior/inferior de la imagen original. */
.brand-logo-wrap {
    width: min(100%, 380px);
    height: 175px;
    margin: 0 auto;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    background: #000;
}

.brand-logo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
}

.brand-summary {
    padding: 1.5rem;
    border-radius: 1.15rem;
    color: #ffffff;
    background: rgba(5, 18, 32, 0.72);
    border: 1px solid rgba(255, 255, 255, 0.18);
    backdrop-filter: blur(10px);
}

.brand-summary h2 {
    margin: 0 0 0.35rem;
    font-size: 1.65rem;
    color: #ffffff !important;
}

.brand-summary > p {
    margin: 0;
    color: rgba(255, 255, 255, 0.84) !important;
    font-size: 0.95rem;
}

.brand-divider {
    height: 1px;
    margin: 1.25rem 0;
    background: rgba(255, 255, 255, 0.18);
}

.feature-list {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: rgba(255, 255, 255, 0.94);
    line-height: 1.35;
}

.feature-item i {
    width: 1.8rem;
    flex: 0 0 1.8rem;
    text-align: center;
    font-size: 1rem;
    color: #ffffff;
}

/* ============================
   PANEL FORMULARIO
   ============================ */
.form-panel {
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2.75rem 3.5rem;
    background: var(--surface-card);
}

.login-form-wrap {
    width: 100%;
    max-width: 440px;
    min-width: 0;
}

.mobile-logo-wrap {
    display: none;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.mobile-logo {
    width: min(300px, 82vw);
    height: 125px;
    object-fit: cover;
    object-position: center;
    display: block;
    border-radius: 0.8rem;
    background: #000;
}

.login-heading {
    text-align: center;
    margin-bottom: 1.75rem;
}

.welcome-text {
    display: block;
    color: var(--primary-color);
    font-weight: 600;
    margin-bottom: 0.4rem;
}

.login-heading h1 {
    margin: 0;
    color: var(--text-color);
    font-size: clamp(2rem, 4vw, 2.55rem);
    line-height: 1.15;
}

.login-heading p {
    margin: 0.65rem 0 0;
    color: var(--text-color-secondary);
}

.login-message {
    margin-bottom: 1.25rem;
    justify-content: flex-start;
}

.field-group {
    margin-bottom: 1.35rem;
}

.field-group > label {
    display: block;
    margin-bottom: 0.55rem;
    color: var(--text-color);
    font-weight: 600;
}

/* Wrapper propio para no depender de p-input-icon-left / Password
   de versiones distintas de PrimeVue. */
.login-input-wrap {
    position: relative;
    width: 100%;
    min-width: 0;
}

.login-field-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    color: var(--text-color-secondary);
    pointer-events: none;
}

:deep(.login-input) {
    width: 100%;
    min-width: 0;
    min-height: 3.4rem;
    box-sizing: border-box;
    padding-left: 2.7rem;
    padding-right: 1rem;
    border-radius: 0.75rem;
}

:deep(.login-password-native) {
    padding-right: 3.2rem !important;
}

.password-toggle {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 3;
    width: 2.25rem;
    height: 2.25rem;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--text-color-secondary);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.password-toggle:hover {
    color: var(--primary-color);
    background: var(--surface-100);
}

.password-toggle:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

.field-error {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.45rem;
    color: var(--red-500);
}

.login-button {
    min-height: 3.5rem;
    margin-top: 0.2rem;
    border-radius: 0.75rem;
    font-size: 1.05rem;
    font-weight: 600;
}

.loading-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    margin-top: 0.9rem;
    padding: 0.75rem;
    border-radius: 0.75rem;
    background: var(--surface-100);
    color: var(--text-color-secondary);
}

.security-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.35rem;
    color: var(--text-color-secondary);
    font-size: 0.82rem;
    text-align: center;
}

/* ============================
   RESPONSIVE
   ============================ */
@media screen and (max-width: 900px) {
    .login-page {
        padding: 1rem;
    }

    .login-shell {
        grid-template-columns: 1fr;
        min-height: 0;
        max-width: 560px;
    }

    .brand-panel {
        display: none;
    }

    .form-panel {
        padding: 2.5rem 2.25rem;
    }

    .mobile-logo-wrap {
        display: flex;
    }
}

@media screen and (max-width: 575px) {
    .login-page {
        min-height: 100vh;
        align-items: flex-start;
        padding: 0;
        background: var(--surface-card);
    }

    .login-shell {
        width: 100%;
        border: none;
        border-radius: 0;
        box-shadow: none;
    }

    .form-panel {
        width: 100%;
        min-height: 100vh;
        box-sizing: border-box;
        padding: 1.5rem 1.25rem 2rem;
    }

    .login-heading {
        margin-bottom: 1.35rem;
    }

    .mobile-logo {
        width: min(280px, 82vw);
        height: 115px;
    }
}
</style>
