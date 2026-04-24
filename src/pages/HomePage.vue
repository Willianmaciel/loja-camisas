<template>
    <q-page padding>

        <div class="text-h4 q-mb-md">Loja de Camisas de Futebol</div>


        <!-- Busca -->
        <q-input filled v-model="busca" label="Buscar camisa" class="q-mb-md" debounce="300" />

        <!-- Filtro por time -->
        <q-btn v-for="time in times" :key="time" :label="time || 'Todos'" @click="filtroTime = time"
            :color="filtroTime === time ? 'primary' : 'grey-7'" flat />

        <!-- Grid de produtos -->
        <div class="row q-col-gutter-md q-mt-md">
            <div v-for="produto in produtosPaginados" :key="produto.id" class="col-6 col-sm-4 col-md-3 col-lg-2">
                <ProductCard :produto="produto" @visualizar="abrirModal" />
            </div>
        </div>

        <q-pagination v-model="paginaAtual" :max="totalPaginas" max-pages="6" direction-links
            class="q-mt-lg flex flex-center" />

        <!-- Feedback se não encontrar produtos -->
        <div v-if="produtosFiltrados.length === 0" class="text-center q-mt-lg">
            <q-icon name="search_off" size="40px" class="q-mb-sm" />
            <div>Nenhuma camisa encontrada</div>
        </div>

        <!-- Modal de visualização -->
        <q-dialog v-model="modalAberto" @hide="limparFormulario">
            <q-card style="min-width: 300px; max-width: 500px">

                <q-card-section v-if="produtoSelecionado">
                    <q-img :src="imagemAtual" class="q-mb-md" />

                    <div class="row justify-center q-gutter-sm">
                        <q-img :src="produtoSelecionado.imagemFrente" style="width: 60px; cursor: pointer"
                            @click="imagemAtual = produtoSelecionado.imagemFrente" />
                        <q-img :src="produtoSelecionado.imagemVerso" style="width: 60px; cursor: pointer"
                            @click="produtoSelecionado.imagemVerso && (imagemAtual = produtoSelecionado.imagemVerso)" />
                    </div>
                    <div class="text-subtitle1 text-primary">
                        R$ {{ formatarPreco(produtoSelecionado.preco) }}
                    </div>
                    <div class="text-caption text-grey">{{ produtoSelecionado.time }}</div>

                    <!-- Seleção de tamanho -->
                    <div v-if="produtoSelecionado.tamanho" class="q-mt-md">
                        <q-select v-model="tamanhoSelecionado" :options="produtoSelecionado.tamanho"
                            label="Escolha o tamanho" dense outlined />
                    </div>

                    <!-- Personalização -->
                    <div v-if="produtoSelecionado.personalizacao" class="q-mt-md">
                        <q-input v-model="personalizacaoTexto" label="Nome para personalização" dense outlined
                            maxlength="20" />
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Fechar" color="primary" @click="fecharModal" />
                    <q-btn color="green" icon="shopping_cart" label="Pedir no WhatsApp" :disable="!produtoSelecionado"
                        @click="produtoSelecionado && pedirProduto(produtoSelecionado)" />
                </q-card-actions>

            </q-card>
        </q-dialog>

    </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ProductCard from 'src/components/product/ProdutoCard.vue'
import { produtos } from 'src/data/produtos'
import type { Produto } from 'src/types/Produto'

// Filtros
const busca = ref('')
const filtroTime = ref('')
const paginaAtual = ref(1)
const itensPorPagina = 12
const imagemAtual = ref('')

const produtosFiltrados = computed(() => {
    return produtos
        .filter((produto) => {
            const matchBusca = produto.nome.toLowerCase().includes(busca.value.toLowerCase())
            const matchTime = filtroTime.value === '' || produto.time === filtroTime.value
            return matchBusca && matchTime
        })
        .sort((a, b) => a.preco - b.preco)
})

const times = computed(() => {
    const lista = produtos.map(p => p.time)
    return ['', ...new Set(lista)]
})

// Modal
const produtoSelecionado = ref<Produto | null>(null)
const modalAberto = ref(false)

const abrirModal = (produto: Produto) => {
    limparFormulario()

    produtoSelecionado.value = produto
    imagemAtual.value = produto.imagemFrente

    modalAberto.value = true
}

const fecharModal = () => {
    limparFormulario()
    produtoSelecionado.value = null
    modalAberto.value = false
}

const limparFormulario = () => {
    tamanhoSelecionado.value = null
    personalizacaoTexto.value = ''
}

const produtosPaginados = computed(() => {
    const inicio = (paginaAtual.value - 1) * itensPorPagina
    const fim = inicio + itensPorPagina
    return produtosFiltrados.value.slice(inicio, fim)
})
const totalPaginas = computed(() => {
    return Math.ceil(produtosFiltrados.value.length / itensPorPagina)
})

// WhatsApp
const pedirProduto = (produto: Produto) => {
    let mensagem = `Olá, quero comprar: ${produto.nome}`

    if (tamanhoSelecionado.value) {
        mensagem += `\nTamanho: ${tamanhoSelecionado.value}`
    }

    if (personalizacaoTexto.value) {
        mensagem += `\nPersonalização: ${personalizacaoTexto.value}`
    }

    const url = `https://wa.me/5599999999999?text=${encodeURIComponent(mensagem)}`
    window.open(url, '_blank')
}

// Formatação de preço
const formatarPreco = (valor: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)

const tamanhoSelecionado = ref<string | null>(null)
const personalizacaoTexto = ref<string>('')
</script>