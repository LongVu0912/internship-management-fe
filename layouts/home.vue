<template>
    <div class="bg-app-primary flex min-h-screen flex-col">
        <AppHeader />
        <div class="mx-3 flex-grow pt-20 md:mx-24">
            <slot></slot>
        </div>
        <AppFooter class="mt-4" />
    </div>
</template>