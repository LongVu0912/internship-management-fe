<template>
    <div class="bg-app-primary flex min-h-screen flex-col">
        <AppHeader />
        <div class="mt-20 flex-grow px-4">
            <slot></slot>
        </div>
        <AppFooter class="mt-4" />
    </div>
</template>