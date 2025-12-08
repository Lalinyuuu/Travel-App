<template>
  <div class="not-found-page">
    <NavBar />
    
    <main class="main-content">
      <div class="container">
        <div class="not-found-content">
          <div class="error-code">404</div>
          <h1 class="error-title">{{ $t('notFound.title') }}</h1>
          <p class="error-description">
            {{ $t('notFound.message') }}
          </p>
          <div class="error-actions">
            <router-link to="/" class="btn btn-primary">{{ $t('notFound.goHome') }}</router-link>
            <button @click="$router.go(-1)" class="btn btn-outline">{{ $t('notFound.goBack') }}</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: #007bff;
  line-height: 1;
  margin-bottom: 1rem;
}

.error-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.error-description {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-outline {
  background-color: transparent;
  border: 2px solid #6c757d;
  color: #6c757d;
}

.btn-outline:hover {
  background-color: #6c757d;
  color: white;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 5rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-actions {
    flex-direction: column;
  }

  .error-actions .btn {
    width: 100%;
  }
}
</style>

