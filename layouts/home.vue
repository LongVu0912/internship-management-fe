<template>
    <div class="bg-app-primary flex min-h-screen flex-col">
        <AppHeader />
        <div class="mt-20 flex-grow px-4 md:px-14 lg:px-28">
            <slot></slot>
        </div>
        <AppFooter class="mt-4" />
    </div>
</template>