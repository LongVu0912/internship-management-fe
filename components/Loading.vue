<template>
    <div
         class="flex items-center justify-center pt-32 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:transform md:pt-0">
        <div class="loader bg-primary-500 dark:bg-primary-400"></div>
    </div>
</template>

<style lang="css" scoped>
.loader {
    width: 60px;
    padding: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    --_m:
        conic-gradient(#0000 10%, #000),
        linear-gradient(#000 0 0) content-box;
    -webkit-mask: var(--_m);
    mask: var(--_m);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;
    animation: l3 1s infinite linear;
}

@keyframes l3 {
    to {
        transform: rotate(1turn)
    }
}
</style>
