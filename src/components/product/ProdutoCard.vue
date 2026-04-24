<template>
    <q-card class="product-card">

        <q-img :src="hover ? produto.imagemVerso : produto.imagemFrente" class="product-image" fit="cover"
            @mouseenter="hover = true" @mouseleave="hover = false" />

        <q-card-section>
            <div class="text-subtitle1 text-weight-medium">{{ produto.nome }}</div>
            <div class="text-h6 text-primary">R$ {{ formatarPreco(produto.preco) }}</div>
            <div class="text-caption text-grey">{{ produto.time }}</div>
        </q-card-section>

        <q-card-actions align="center">
            <q-btn color="green" icon="shopping_cart" label="Pedir no WhatsApp" @click="pedirProduto" />
            <q-btn flat icon="zoom_in" label="Ver" @click="abrirVisualizacao" />
        </q-card-actions>

    </q-card>
</template>

<script setup lang="ts">
import type { Produto } from 'src/types/Produto'
import { ref } from 'vue'
const hover = ref(false)


const props = defineProps<{ produto: Produto }>()

const emit = defineEmits<{
    (e: 'visualizar', produto: Produto): void
}>()

const abrirVisualizacao = () => {
    emit('visualizar', props.produto)
}

const pedirProduto = () => {
    const mensagem = `Olá, quero comprar: ${props.produto.nome}`
    const url = `https://wa.me/5599999999999?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
}

const formatarPreco = (valor: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
</script>

<style scoped>
.product-card {
    transition: transform 0.2s;
}

.product-card:hover {
    transform: scale(1.03);
}

.product-image {
    object-fit: cover;
}
</style>