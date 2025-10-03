<template>
  <div class="card">
    <h1>Categorias</h1>

    <Button
      label="Nueva Categoria"
      icon="pi pi-external-link"
      @click="visible = true"
    />

    <Dialog
      v-model:visible="visible"
      modal
      header="Nueva categoria"
      :style="{ width: '50vw' }"
    >
      <span class="p-input-icon-left">
        <i class="pi pi-search" />
        <InputText v-model="categoria.nombre" placeholder="Nombre cat" />
        <InputText v-model="categoria.descripcion" placeholder="Descripcion cat" />
      </span>

      <template #footer>
        <Button label="Cerrar" icon="pi pi-times" class="p-button-text" />
        <Button
          label="Guardar"
          @click="guardarCategoria()"
          icon="pi pi-check"
          autofocus
        />
      </template>
    </Dialog>
    <ProgressBar mode="indeterminate" style="height: 6px" v-if="loading"></ProgressBar>

    <DataTable :value="categorias" responsiveLayout="scroll">
      <Column field="id" header="Codigo"></Column>
      <Column field="nombre" header="Nombre Categoria"></Column>
      <Column field="descripcion" header="Descripcion"></Column>
      <Column field="accion" header="Acciones">
        <template #body="slotProps">
          <Button @click="editarCategoria(slotProps.data)" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import CategoriaService from "@/service/CategoriaService";

const categorias = ref([]);
const visible = ref(false);
const categoria = ref({ nombre: "", descripcion: "" });
const loading = ref(true)

onMounted(() => {
  getCategorias();
});

const getCategorias = async () => {
  loading.value = true;

  const { data } = await CategoriaService.listar();
  categorias.value = data;

  loading.value = false;
};

const guardarCategoria = async () => {
  try {
    loading.value = true;

    if (categoria.value.id) {
      const { data } = await CategoriaService.modificar(
        categoria.value.id,
        categoria.value,
        //categoria.value.push(data.data)
        
      );
      categoria.value = { nombre: "", descripcion: "" };
      
    } else {
      const { data } = await CategoriaService.guardar(categoria.value);
      categoria.value = { nombre: "", descripcion: "" };
      
    }

    loading.value = false;

    visible.value = false;
    getCategorias();
    
  } catch (error) {
    console.log(error);
    loading.value = false;
  }
};

const editarCategoria = async (obj) => {
  categoria.value = obj;

  visible.value = true;
};

const modificarCategoria = async () => {
  try {
    const { data } = await CategoriaService.modificar(categoria.value);

    getCategorias();
    visible.value = false;
  } catch (error) {
    console.log(error);
  }
};
</script>