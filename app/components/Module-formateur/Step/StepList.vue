<template>
  <div class="bg-white shadow rounded-lg p-6">
    <h3 class="text-lg font-semibold text-blue-900 mb-4">
      Liste des étapes
    </h3>

    <!-- Loading -->
    <div v-if="pending" class="text-gray-500">
      Chargement des étapes...
    </div>

    <!-- Empty -->
    <div v-else-if="steps.length === 0" class="text-gray-400">
      Aucune étape pour ce parcours
    </div>

    <!-- List -->
    <!-- <div v-else class="space-y-3">
      <div
        v-for="step in steps"
        :key="step.id"
        class="border rounded-md p-4 flex justify-between items-center"
      >
        <div>
          <p class="font-medium text-gray-800">
            {{ step.title }}
          </p>

          <p class="text-sm text-gray-500 capitalize">
            {{ step.type }}
          </p>
        </div>

        <span
          class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600"
        >
          #{{ step.index ?? '?' }}
        </span>
      </div>
    </div> -->

    <div
  v-for="step in steps"
  :key="step.id"
  class="border rounded-md p-4 hover:bg-gray-50 transition flex justify-between items-center"
>
  <!-- ZONE CLIQUABLE -->
  <NuxtLink
    :to="`/module-formateur/etapes/step/${step.id}`"
    class="flex-1"
  >
    <p class="font-medium text-gray-800">
      {{ step.title }}
    </p>

    <p class="text-sm text-gray-500 capitalize">
      {{ step.type }}
    </p>
  </NuxtLink>

  <!-- ACTIONS -->
  <div class="flex items-center gap-2 ml-4">

    <!-- EDIT -->
    <button
      @click.stop="editStep(step)"
      class="text-blue-600 hover:text-blue-800 text-sm"
    >
      ✏️
    </button>

    <!-- DELETE -->
    <button
      @click.stop="deleteStep(step.id)"
      class="text-red-600 hover:text-red-800 text-sm"
    >
      🗑️
    </button>

    <span class="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
      #{{ step.index ?? '?' }}
    </span>

  </div>
</div>


  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  parcoursId: string;
}>();

interface Step {
  id: string;
  title: string;
  type: "cours" | "exercice" | "quiz";
  index?: number;
}

// à remplacer par un useFetch réel(backend)
// const { data, pending, error, refresh } = await useFetch<Step[]>(
//   () => `/api/steps?parcoursId=${props.parcoursId}`,
//   {
//     watch: [() => props.parcoursId],
//   }
// );


const pending = ref(false)

const steps = ref([
  { id: "1", title: "Introduction", type: "cours", index: 1 },
  { id: "2", title: "Premier exercice", type: "exercice", index: 2 },
])


// const steps = computed(() => data.value ?? []); // à garder pour le backend

const refresh = () => {
  pending.value = true;
  steps.value = [
    { id: "1", title: "Introduction", type: "cours", index: 1 },
    { id: "2", title: "Premier exercice", type: "exercice", index: 2 },
  ];
  pending.value = false;
};
//supprimer une étape
const deleteStep = async (id: string) => {
  if (!confirm("Supprimer cette étape ?")) return;

  await $fetch(`/api/steps/${id}`, {
    method: "DELETE",
  });

  refresh(); // recharge la liste
};

//éditer une étape
const router = useRouter();

const editStep = (step: any) => {
  router.push(`/module-formateur/etapes/edit/${step.id}`);
};


</script>
