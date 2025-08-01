<script setup lang="ts">
interface GradientTextProps {
  colors?: string[]
  background?: string
  showDivider?: boolean
}

const props = withDefaults(defineProps<GradientTextProps>(), {
  colors: () => ['#ffaa40', '#9c40ff', '#ffaa40'],
  background: 'bg-black',
  showDivider: false,
})

const gradientStyle = computed(() => ({
  backgroundImage: `linear-gradient(to right, ${props.colors.join(', ')})`,
}))
</script>

<template>
  <div class="relative mx-auto max-w-fit">
    <div
      class="animate-border absolute inset-px rounded-2xl blur-xs"
      :style="gradientStyle"></div>
    <div
      class="relative flex h-full rounded-2xl p-2 text-orange-200"
      :class="background">
      <div class="flex"><slot name="icon" /></div>
      <div class="text flex grow flex-col">
        <div
          class="animate-text relative bg-clip-text text-transparent"
          :style="gradientStyle">
          <slot name="title" />
        </div>
        <div
          v-if="showDivider"
          class="animate-text h-px w-full"
          :style="gradientStyle"></div>
        <div class=""><slot name="description" /></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@keyframes move {
  /* 0% {
    transform: translate(-4px, 4px);
  }
  25% {
    transform: translate(-4px, -4px);
  }
  50% {
    transform: translate(4px, -4px);
  }
  75% {
    transform: translate(4px, 4px);
  }
  100% {
    transform: translate(-4px, 4px);
  }
} */
  /* 0% {
    transform: translate(-2px, 2px);
  }
  25% {
    transform: translate(-2px, -2px);
  }
  50% {
    transform: translate(2px, -2px);
  }
  75% {
    transform: translate(2px, 2px);
  }
  100% {
    transform: translate(-2px, 2px);
  }
} */
  0% {
    transform: translate(-1px, 1px);
  }
  25% {
    transform: translate(-1px, -1px);
  }
  50% {
    transform: translate(1px, -1px);
  }
  75% {
    transform: translate(1px, 1px);
  }
  100% {
    transform: translate(-1px, 1px);
  }
}
.animate-text {
  animation: gradient 8s linear infinite;
  background-size: 300% 100%;
}
.animate-border {
  animation:
    gradient 8s linear infinite,
    move 6s linear infinite;
  background-size: 300% 100%;
}
</style>
