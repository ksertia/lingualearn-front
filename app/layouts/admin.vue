<template>
  <div class="min-h-screen flex bg-gray-200">
    <!-- Sidebar -->
    <aside class="w-56 flex flex-col bg-[rgb(0,0,153)] text-white">
      <div class="p-4 font-bold text-lg border-b border-white/20">ADMIN</div>
      <nav class="flex-1 p-4 space-y-2">
        <NuxtLink to="/admin/users" class="block px-2 py-1 rounded hover:bg-[rgb(0,206,209)]">Gestion utilisateurs</NuxtLink>
        <NuxtLink to="/admin/profil" class="block px-2 py-1 rounded hover:bg-[rgb(0,206,209)]">Profil</NuxtLink>
      </nav>
      <button class="m-4 py-2 rounded font-semibold bg-[rgb(255,127,0)]">Déconnexion</button>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-6">
      <slot />
    </main>
  </div>
</template>
