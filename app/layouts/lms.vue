<template>
  <div class="lms-layout">
    <nav class="vertical-navbar">
      <div class="nav-item menu-toggle">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12h18M3 6h18M3 18h18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span class="nav-text">Menu</span>
      </div>

      <div class="nav-items">
        <div class="nav-item active" title="Tableau de bord">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <polyline
              points="9 22 9 12 15 12 15 22"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="nav-text">Tableau de bord</span>
        </div>

        <div class="nav-item" title="Liste des apprenants">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <circle
              cx="9"
              cy="7"
              r="4"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M23 21v-2a4 4 0 0 0-3-3.87"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M16 3.13a4 4 0 0 1 0 7.75"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="nav-text">Liste des apprenants</span>
        </div>

        <div class="nav-item" title="Parcours">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="nav-text">Parcours</span>
        </div>

        <div class="nav-item" title="Paramètres">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="3"
              stroke="currentColor"
              stroke-width="2"
            />
            <path
              d="M12 1v6m0 6v6m4.22-13.22l4.24 4.24M1.54 9.96l4.24 4.24M1 12h6m6 0h6m-13.22 4.22l4.24-4.24M18.46 14.04l4.24-4.24"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="nav-text">Paramètres</span>
        </div>
      </div>

      <div class="nav-bottom">
        <div class="nav-item profile-item">
          <img
            src="https://picsum.photos/seed/woman-profile/32/32.jpg"
            alt="Profile"
            class="profile-pic"
          />
          <span class="nav-text">Profil</span>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup></script>

<style scoped>
.lms-layout {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

.vertical-navbar {
  width: 80px;
  background-color: #000099;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: width 0.3s ease;
  overflow: hidden;
}

.vertical-navbar:hover {
  width: 250px;
  align-items: flex-start;
  padding-left: 15px;
}

.nav-item {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin: 8px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #c0c0c0;
  position: relative;
  gap: 0;
  overflow: hidden;
}

.vertical-navbar:hover .nav-item {
  width: 220px;
  justify-content: flex-start;
  padding-left: 10px;
  gap: 12px;
}

.nav-item:hover {
  background-color: rgba(0, 206, 209, 0.2);
  color: #00ced1;
  transform: translateX(2px);
}

.nav-item.active {
  background-color: #00ced1;
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 206, 209, 0.3);
}

.menu-toggle:hover {
  background-color: rgba(255, 127, 0, 0.2);
  color: #ff7f00;
  transform: scale(1.05);
}

.nav-text {
  display: none;
}

.vertical-navbar:hover .nav-text {
  display: inline;
}

.nav-items {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-bottom {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.profile-pic {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  /* border: 2px solid #00CED1; */
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-weight: bold;
  font-size: 12px;
  padding: 0 8px;
  height: 36px;
  width: auto;
  min-width: 50px;
}

.points-text {
  font-size: 11px;
  font-weight: 600;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .vertical-navbar {
    width: 70px;
  }

  .nav-item {
    width: 45px;
    height: 45px;
  }
}

/* Icon animations */
.nav-item svg {
  transition: transform 0.2s ease;
}

.nav-item:hover svg {
  transform: scale(1.1);
}

.nav-item.active svg {
  transform: scale(1.05);
}
</style>
