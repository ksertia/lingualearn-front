<template>
<div class="min-h-screen bg-slate-50 p-4 md:p-8 bg-[brand-gray-light]">
    <div class="text-3xl font-black text-brand-blue tracking-tight max-w-7xl mx-auto mb-8 md:flex items-center justify-between">
    <h1>Créer un parcours</h1>
    </div>
    <div class="max-w-7xl mx-auto ">
        <form action="" style="display: grid; gap: 104px;">
            <label for="">
                <h1>Titre</h1>
                <input type="text" placeholder="titre">
            </label>
            <label for="">
                <h1>Niveau</h1>
                <select>
                    <option value="debutant">Débutant</option>
                    <option value="intermediaire">Intermédiaire</option>
                    <option value="avance">Avancé</option>
                </select>
            </label>
            <label>
                <h1>Description</h1>
                <input type="text" placeholder="Description">
            </label>
            <label>
                <h1>Ajouter un cours</h1>
                <input type="file" placeholder="ajouter un cours">
            </label>
        </form>
    </div>
    <div style="display: flex; justify-content: space-between;">
        <button type="submit">Enregistrer</button>
        <button type="submit">Publier</button>
    </div>
</div>    

</template>

<script setup>

</script>

<style scoped>
form {
    background-color: antiquewhite;
}

input {
    background-color: aliceblue;
}

label {
    display: grid;
    gap: 10px;
}

</style>
